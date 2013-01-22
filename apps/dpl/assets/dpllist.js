
Demo.Dpl.submitForm = function (formElem, redirectTo) {
	var form = Dom.get(formElem);
	var path = form.find('[name=path]').getText();
	var name = form.find('[name=title]').getText();
	var hasError = false;

	form.query('.x-textbox-error').removeClass('x-textbox-error');

	if (!path) {
		hasError = true;
		form.find('[name=path]').addClass('x-textbox-error');
	}

	if (hasError) {
		return;
	}

	form.find('[name=postback]').setText(redirectTo ? "" : location.href);

	form.submit();

};

Demo.Dpl.add = function (parentNode) {
	parentNode.innerHTML = '<form action="' + Demo.Configs.serverBaseUrl + Demo.Configs.apps + '/dpl/server/dplmanager.njs" method="GET"><input type="hidden" name="postback" value=""><input type="text" name="path" class="x-textbox textbox-path" placeholder="模块完整路径"> <input type="text" name="title" class="x-textbox textbox-name" placeholder="(可选)模块描述"> <input type="hidden" name="action" value="create"> <select class="x-textbox" name="tpl"><option value="jscss">js+css模块</option><option value="js">js模块</option><option value="css">css模块</option><option value="docs">文档</option></select> <input type="button" class="x-button x-button-info" value="添加并转到" onclick="Demo.Dpl.submitForm(this.parentNode, true)"> <input type="button" class="x-button" value="添加" onclick="Demo.Dpl.submitForm(this.parentNode, false)"></form>';

	var form = Dom.get(parentNode);

	var suggest = new Suggest(form.find('[name=path]').focus());
	
	suggest.getSuggestItems = function (text) {

		var r = [];

		Demo.Dpl.tree = Demo.Dpl.tree || Demo.Dpl.listToTree(DplList.src);

		if (!text) {
			for (var category in Demo.Dpl.tree) {
				r.push(category + "/");
			}
		} else if (text.indexOf('/') < 0) {
			for (var category in Demo.Dpl.tree) {
				if (category.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
					r.push(category + "/");
				}
			}
		} else {
			for (var category in DplList.src) {
				if (category.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
					r.push(category.replace(/(-[\.\d]+)?\.\w+$/, ""));
				}
			}
		}

		return r.unique();
	};

};

Demo.Dpl.listToTree = function (list, filter) {

	var tree = {

	}, path, category, slash, version, data;

	for (path in list) {
		
		slash = path.lastIndexOf('/');

		// 删除扩展名。
		category = slash < 0 ? '全局' : path.substr(0, slash);
		fileNameWithoutExtension = (slash < 0 ? path : path.substr(slash + 1)).replace(/\.\w+$/, "");

		version = 0;

		// 检测是否存在版本号。
		fileNameWithoutExtension = fileNameWithoutExtension.replace(/\-([\d\.]+)$/, function (_, v) {
			list[path].version = list[path].version || v;
			list[path].versionValue = version = parseFloat(v);
			return "";
		});

		if (filter) {
			if (category.indexOf(filter) !== 0) {
				continue;
			}

			category = category.substr(filter.length);
		}

		if (fileNameWithoutExtension === "index") {
			continue;
		}


		data = tree[category] || (tree[category] = {});
		
		if (!data[fileNameWithoutExtension]) {
			data[fileNameWithoutExtension] = path;
		} else if (version && !(list[data[fileNameWithoutExtension]].versionValue > version)) {
			data[fileNameWithoutExtension] = path;
		}

	}

	// 如果一个分类下存在主页，且有超过三级的目录，则降级为二级目录。
	for (path in tree) {
		if (tree[path].index) {
			slash = path.lastIndexOf('/');

			if (slash >= 0) {
				category = path.substr(0, slash);
				fileNameWithoutExtension = path.substr(slash + 1);

				if (!tree[category]) {
					tree[category] = {};
				}

				if (!tree[category][fileNameWithoutExtension]) {
					tree[category][fileNameWithoutExtension] = tree[path].index;
				}

				delete tree[path];

			}
		}
	}

	return tree;
};

Demo.writeDplList = function (filter) {

	var list = DplList.examples,
		tree = Demo.Dpl.listToTree(list, filter),
		from = document.referrer || "",
		html = "",
		html2 = "",
		url,
		category,
		data,
		name,
		info,
		counts = {};

	html += '<article class="demo">';

	if (Demo.local)
		html += '<nav class="demo demo-toolbar" style="margin-top:-40px;"><a href="javascript://创建一个新的模块" class="x-linkbutton" onclick="Demo.Dpl.add(this.parentNode)">✚ 创建模块</a></nav>';

	for (category in tree) {
		data = tree[category];

		html += '<section class="demo"><h3 class="demo" style="margin-top:0;">' + category + '</h3><ul class="demo demo-plain">';

		for (name in data) {

			info = list[data[name]];

			url = Demo.baseUrl + Demo.Configs.examples + "/" + data[name];

			html += '<li style="margin:0;list-style:disc inside;color:#E2E2EB;font-size:14px;line-height:24px;height:24px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"><a class="demo status-' + info.status + (from === url ? ' current' : '') + '" href="' + url + '" title="' + name + ' ' + (info.version || "1.0") + '&#13;&#10;名字：' + info.name + '&#13;&#10;状态：' + (Demo.Configs.status[info.status] || '已完成') + '">' + name + '</a>' + (info["attr"] ? '<sup class="x-highlight">' + info["attr"] + '</sup>' : '') + '<small style="color: #999999;"> - ' + info.name + '</small></li>';

			if (!counts[info.status]) {
				counts[info.status] = 1;
			} else {
				counts[info.status]++;
			}

		}

		html += '</ul></section>';

	}

	html += '</article>';

	document.write(html);

	Demo.waterFall(4);

	var toolbar = document.getElementById('demo-toolbar');

	if (toolbar) {
		var next = toolbar.nextSibling;
		if (next.tagName !== "H1") {
			next = next.nextSibling;
		}
		
		html = '<small title="';
		data = 0;

		for (name in counts) {
			data += counts[name];
			html += Demo.Configs.status[name] + ": " + counts[name] + "&#13;&#10;";
		}

		html += '全部: ' + data + '">' + ((counts.ok || 0) + (counts.complete || 0)) + '/' + (data - (counts.obsolete || 0)) + '</small>';

		next.innerHTML += html;
	}

};