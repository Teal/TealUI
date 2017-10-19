/**
 * @fileOverview 开发系统驱动文件。此文件同时运行于浏览器端及 node 端。
 * @author xuld
 */

//#region 前后台公用的部分

var Demo = Demo || {};

/**
 * 配置模块。
 */
Demo.Configs = {

	/**
	 * 当前开发系统在处理文件操作时使用的远程服务器地址。
	 */
	serverBaseUrl: 'http://localhost:8021/',

	/**
	 * 存放源文件的文件夹。
	 */
	src: "src",

	/**
	 * 存放文档文件的文件夹。
	 */
	examples: "examples",

	/**
	 * 存放开发系统文件的文件夹。
	 */
	apps: "apps",

	/**
	 * 存放数据字段的 meta 节点。
	 */
	metaModuleInfo: 'module-info',

	/**
	 * dpl 访问历史最大值。
	 */
	maxHistory: 10,

	/**
	 * 工具的下拉菜单 HTML 模板。
	 */
	tool: '<a href="~/apps/node/modulebuilder/index.html" target="_blank">模块打包工具</a>\
                <a href="~/apps/tools/codehelper/index.html" target="_blank">代码工具</a>\
                <a href="~/apps/tools/codesegments/specialcharacters.html" target="_blank">特殊字符</a>\
                <a href="~/apps/tools/codesegments/regexp.html" target="_blank">常用正则</a>\
                <!--<a href="~/resources/index.html#tool" target="_blank">更多工具</a>-->\
                <a href="javascript://显示或隐藏页面中自动显示的源码片段" onclick="Demo.Page.toggleSources()" style="border-top: 1px solid #EBEBEB;">折叠代码</a>\
                <a href="javascript://浏览当前页面的源文件" onclick="Demo.Page.exploreSource();">浏览源文件</a>',

	/**
	 * 文档的下拉菜单 HTML 模板。
	 */
	doc: '<!--<a href="~/resources/cookbooks/jplusui-full-api/index.html" target="_blank">jPlusUI API 文档</a>\
                <a href="~/resources/cookbooks/jplusui-core-api/index.html" target="_blank">jPlusUI Core 文档</a>\
                <a href="~/resources/cookbooks/jquery2jplus.html" target="_blank">jQuery 转 jPlusUI</a>-->\
                <!--<a href="~/resources/cookbooks/dplsystem.html" target="_blank" style="border-top: 1px solid #EBEBEB;">模块开发教程</a>-->\
				<a href="~/dev/cookbooks/apps.html" target="_blank">开发系统文档</a>\
                <!--<a href="~/resources/cookbooks/classdiagram" target="_blank">类图</a>-->\
                <a href="~/dev/index.html" target="_blank" style="border-top: 1px solid #EBEBEB;">更多文档</a>',

	/**
	 * 底部 HTML 模板。
	 */
	footer: '<footer class="demo"><hr class="demo"><nav class="demo-toolbar"><a href="http://www.jplusui.com/">jPlusUI.com</a> | <a href="https://www.github.com/jplusui/jplusui">Github</a> | <a href="#">返回顶部</a></nav><span>Copyright &copy; 2011-2013 jPlusUI.com</span></footer>',

	/**
	 * 合法的状态值。
	 */
	status: {
		'ok': '已完成',
		'beta': '测试版',
		'complete': '完美版',
		'plan': '计划中',
		'develop': '开发中',
		'obsolete': '已放弃'
	},

	/**
	 * 合法的浏览器。
	 */
	support: 'IE6|IE7|IE7|IE8|IE10|FireFox|Chrome|Opera|Safari|Mobile'.split('|'),

	/**
	 * 整个项目标配使用的编码。
	 */
	encoding: 'utf-8'

};

Demo.Module = {

	/**
     * 获取当前页面指定的控件的信息。
     */
	parseModuleInfo: function (value) {

		var r = {}, i, t, s;

		value = value.split(';');

		for (i = 0; i < value.length; i++) {
			t = value[i];
			s = t.indexOf('=');
			r[t.substr(0, s)] = t.substr(s + 1);
		}

		return r;

	},

	/**
     * 获取当前页面指定的控件的信息。
     */
	stringifyModuleInfo: function (value) {

		var r = [];

		for (var key in value) {
			r.push(key + '=' + value[key]);
		}

		return r.join(';');

	},

	/**
     * 将 URL 转换为模块名。
     */
	toModulePath: function (path) {
		return path ? path.replace(/[?#].*$/, "").replace(/\.[a-zA-Z]+$/, "").replace(/^[\/\\]+/, "").replace(/[\/\\]+$/, "") : "";
	}

};

//#endregion

// 指示当前系统是否在后台运行。
if (typeof module !== 'object') {

	//#region 前台部分

	/**
	* DOM辅助处理模块。
	*/
	Demo.Dom = {

		/**
		 * 指示当前是否为 IE6-8 浏览器。
		 */
		isIE: !+"\v1",

		/**
		 * 遍历指定的标签名并执行指定函数。仅对 class=demo 的元素有效。
		 */
		iterate: function (tagName, fn) {
			var domlist = document.getElementsByTagName(tagName), r = [], i, t;
			for (i = 0; t = domlist[i]; i++) {
				if (t.className.indexOf('demo') >= 0) {
					r.push(t);
				}
			}

			for (i = 0; i < r.length; i++) {
				fn(r[i]);
			}
		},

		/**
		 * 设置 DOM ready 后的回调。
		 */
		ready: function (callback) {

			function check() {
				/in/.test(document.readyState) ? setTimeout(check, 1) : callback();
			}

			check();
		}
	};

	/**
	 * 代码处理模块。
	 */
	Demo.Utils = {

		indexOf: function (arr, value) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === value) {
					return i;
				}
			}

			return -1;
		},

		removeIndents: function (value) {
			value = value.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
			var space = /^\s+/.exec(value);

			if (space) {
				space = space[0];
				value = value.split(/[\r\n]/);
				for (var i = value.length - 1; i >= 0; i--) {
					value[i] = value[i].replace(space, "");
				}
				value = value.join('\r\n');
			}
			return value;
		},

		/**
		 * 编码 HTML 特殊字符。
		 * @param {String} value 要编码的字符串。
		 * @return {String} 返回已编码的字符串。
		 * @remark 此函数主要将 & < > ' " 分别编码成 &amp; &lt; &gt; &#39; &quot; 。
		 */
		encodeHTML: (function () {

			var map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'\'': '&#39;',
				'\"': '&quot;'
			};

			function replaceMap(v) {
				return map[v];
			}

			return function (value) {
				return value.replace(/[&<>\'\"]/g, replaceMap);
			};
		})(),
		
		/**
		 * 获取一个函数内的源码。
		 */
		getFunctionSource: function (fn){
			return Demo.Utils.removeIndents(fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
				return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
			}));
		}

	};

	/**系统模块*/
	Demo.Page = {

		/**
		 * 预处理页面。
		 */
		init: function () {

			// 令 IE 支持显示 HTML5 新元素。
			if (Demo.Dom.isIE) {
				'article section header footer nav aside details summary menu'.replace(/\w+/g, function (tagName) {
					document.createElement(tagName);
				});
			}

			var configs = Demo.Configs;

			// 判断当前开发系统是否在本地运行。
			Demo.local = location.protocol === 'file' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

			// 自动获取项目跟目录。
			var node = document.getElementsByTagName("script");
			node = node[node.length - 1];
			node = (!Demo.Dom.isIE || typeof document.constructor === 'object') ? node.src : node.getAttribute('src', 5);
			node = node.substr(0, node.length - configs.apps.length - "/demo/demo.js".length);
			Demo.baseUrl = node;

			// 获取当前的目录信息。
			var pathname = location.href.substr(Demo.baseUrl.length);
			var slashIndex = pathname.indexOf('/');
			Demo.urlPrefix = pathname.substr(0, slashIndex);
			Demo.urlPostfix = pathname.substr(slashIndex + 1);

			// 判断当前开发系统的打开模式。
			// 如果是在一个网页上使用，则不生成其它额外的内容。
			// 如果是在 docs 里使用，则自动生成标题部分。
			if (Demo.urlPrefix) {
				Demo.writeHeader();
			}

			Demo.Dom.ready(function () {

				// 处理 script.demo 。
				// script.demo[type=text/html] => aside.demo
				// script.demo[type=text/javascript] => 插入 pre.demo
				// script.demo[type=code/html] => pre.demo
				// script.demo[type=code/javascript] => pre.demo
				Demo.Dom.iterate('SCRIPT', function (node) {
					var value = node.innerHTML.replace(/< (\/?)script/g, "<$1script");
					switch (node.type) {
						case '':
						case 'text/javascript':
							insertCode(node, node.innerHTML, 'js', true);
							break;
						case 'text/html':
							var code = document.createElement('ASIDE');
							code.className = node.className;
							node.parentNode.replaceChild(code, node);
							code.$code = value;

							if (Demo.Dom.isIE) {
								code.innerHTML = '$' + value;
								code.removeChild(code.firstChild);
							} else {
								code.innerHTML = value;
							}

							// 模拟执行全部脚本。
							var scripts = code.getElementsByTagName('SCRIPT');
							for (var i = 0; scripts[i]; i++) {
								if (window.execScript) {
									window.execScript(scripts[i].innerHTML);
								} else {
									window.eval(scripts[i].innerHTML);
								}
							}
							break;
						case 'text/markdown':
							if (Demo.Markdown) {
								value = Demo.Markdown.toHTML(Demo.Utils.removeIndents(value));
								var div = document.createElement('SECTION');
								div.innerHTML = value;
								var nodes = div.getElementsByTagName('*');
								for (var i = 0; nodes[i]; i++) {
									nodes[i].className = 'demo';
								}
								node.parentNode.replaceChild(div, node);
							} else {
								insertCode(node, value, 'text');
							}
							break;
						case 'code/javascript':
							insertCode(node, value, 'js');
							break;
						default:
							if (/^code\//.test(node.type)) {
								insertCode(node, value, node.type.substr(5));
							} else {
								insertCode(node, value, 'text');
							}

							break;
					}
				});

				// 处理 aside.demo 。
				Demo.Dom.iterate('ASIDE', function (node) {
					insertCode(node, node.$code || node.innerHTML, 'html', true);
				});

				// 如果存在代码高亮的插件。
				if (Demo.SyntaxHighligher) {
					setTimeout(function () {
						Demo.Dom.iterate('PRE', Demo.SyntaxHighligher.one);
					}, 0);
				}

				function insertCode(node, value, language, canHide) {

					var pre = document.createElement('pre');
					pre.className = 'demo sh sh-' + language + (canHide ? ' demo-sourcecode' : '');

					// 如果存在格式代码插件，判断当前是否需要格式化代码。
					if (Demo.Beautify && (language in Demo.Beautify) && node.className.indexOf('demo-noformat') < 0) {
						value = Demo.Beautify[language](value);
					} else {
						value = Demo.Utils.removeIndents(value);
					}

					pre.textContent = pre.innerText = value;

					pre.innerHTML = pre.innerHTML.replace(/##([\s\S]*?)##/g, "<strong>$1</strong>").replace(/__([\s\S]*?)__/g, "<u>$1</u>");

					node.parentNode.insertBefore(pre, node.nextSibling);
				}

			});
		},

		/**
		 * 切换折叠或展开全部源码。
		 */
		toggleSources: function (value) {

			Demo.Page.sourceDisplay = Demo.Page.sourceDisplay === 'none' ? '' : 'none';

			Demo.Dom.iterate('PRE', function (node) {
				if (node.className.indexOf('demo-sourcecode') >= 0) {
					node.style.display = Demo.Page.sourceDisplay;
				}
			});

		},

		initDropDown: function (id) {
			var dropDown = document.createElement('div');
			dropDown.id = id;
			document.getElementById('demo-toolbar').appendChild(dropDown);
			switch (id) {
				case "demo-toolbar-tool":
					simpleDropDown('tool', '74px');
					break;
				case "demo-toolbar-doc":
					simpleDropDown('doc', '100px');
					break;
				case "demo-toolbar-goto":
					dropDown.className = 'demo-toolbar-dropdown';
					dropDown.style.width = '300px';
					dropDown.innerHTML = '<input style="width:290px;padding:5px;border:0;border-bottom:1px solid #9B9B9B;" type="text" onfocus="this.select()" placeholder="输入模块路径/名称以快速转到"><div class="demo-toolbar-dropdown-menu" style="_height: 300px;_width:300px;word-break:break-all;max-height:300px;overflow:auto;"></div>';
					dropDown.defaultButton = dropDown.firstChild;
					dropDown.defaultButton.onkeydown = function (e) {
						e = e || window.event;
						var keyCode = e.keyCode;
						if (keyCode == 40 || keyCode == 38) {
							Demo.Page.gotoMoveListHover(keyCode == 40);

						}
					};

					dropDown.defaultButton.onkeypress = function (e) {
						e = e || window.event;
						var keyCode = e.keyCode;
						if (keyCode == 13 || keyCode == 10) {
							var link = Demo.Page.gotoGetCurrent();

							if (link) {
								location.href = link.href;
							}

						}
					};

					dropDown.defaultButton.onkeyup = function (e) {
						e = e || window.event;
						var keyCode = e.keyCode;
						if (keyCode !== 40 && keyCode !== 38 && keyCode != 13 && keyCode != 10) {
							Demo.Page.gotoUpdateList();
						}
					};

					Demo.Page.loadModuleList(Demo.Page.gotoUpdateList);

					break;
				case "demo-toolbar-controlstate":
					var moduleInfo = Demo.moduleInfo;
					dropDown.className = 'demo-toolbar-dropdown';
					dropDown.style.cssText = 'padding:5px;*width:260px;';
					var html = '<style>#demo-toolbar-controlstate input{vertical-align: -2px;}</style><form style="*margin-bottom:0" action="' + Demo.Configs.serverBaseUrl + Demo.Configs.apps + '/node/modulemanager/server/api.njs" method="get">\
                    <fieldset>\
                        <legend>状态</legend>';

					var i = 1, key;
					for (key in Demo.Configs.status) {
						html += '<input name="status" type="radio"' + (moduleInfo.status === key ? ' checked="checked"' : '') + ' id="demo-controlstate-status-' + key + '" value="' + key + '"><label for="demo-controlstate-status-' + key + '">' + Demo.Configs.status[key] + '</label>';

						if (i++ === 3) {
							html += '<br>';
						}
					}

					html += '</fieldset>\
                    <fieldset>\
                        <legend>兼容</legend>';

					i = 1;
					var support = moduleInfo.support ? moduleInfo.support.split('|') : Demo.Configs.support;

					for (i = 0; i < Demo.Configs.support.length; i++) {
						key = Demo.Configs.support[i];
						html += '<input name="support" type="checkbox"' + (Demo.Utils.indexOf(support, key) >= 0 ? ' checked="checked"' : '') + ' id="demo-controlstate-support-' + key + '" value="' + key + '"><label for="demo-controlstate-support-' + key + '">' + Demo.Configs.support[i] + '</label>';

						if (i === 5) {
							html += '<br>';
						}
					}

					html += '</fieldset>\
                    <fieldset>\
                        <legend>描述</legend>\
                    <input style="width:224px" type="text" name="title" value="' + moduleInfo.name + '">\
                </fieldset>\
\
                <input value="保存修改" class="demo-right" type="submit">\
                <a href="javascript://彻底删除当前模块及相关源码" onclick="if(prompt(\'确定删除当前模块吗?  如果确认请输入 yes\') === \'yes\')location.href=\'' + Demo.Configs.serverBaseUrl + Demo.Configs.apps + '/node/modulemanager/server/api.njs?action=delete&path=' + encodeURIComponent(Demo.moduleInfo.path) + '&postback=' + encodeURIComponent(Demo.Configs.serverBaseUrl + Demo.Configs.examples) + '\'">删除模块</a>\
<input type="hidden" name="path" value="' + Demo.Utils.encodeHTML(location.pathname) + '">\
<input type="hidden" name="action" value="update">\
<input type="hidden" name="postback" value="' + Demo.Utils.encodeHTML(location.href) + '">\
            </form>';
					dropDown.innerHTML = html;
					break;
			}

			function simpleDropDown(id, right) {
				dropDown.style.right = right;
				dropDown.className = 'demo-toolbar-dropdown demo-toolbar-dropdown-menu demo-toolbar-dropdown-menu-usehover';
				dropDown.innerHTML = Demo.Configs[id].replace(/~\//g, Demo.baseUrl);
				dropDown.onclick = function () {
					dropDown.style.display = 'none';
				};
			}

			return dropDown;
		},

		showDropDown: function (id, delay) {

			Demo.Page.cleanDropDownTimer();

			Demo.Page.dropDownTimerShow = setTimeout(function () {

				// 删除延时状态。
				Demo.Page.dropDownTimerShow = 0;

				// 如果已经显示了一个菜单，则关闭之。
				if (Demo.Page.dropDownShown) {
					Demo.Page.dropDownShown.style.display = 'none';
				}

				var dropDown = document.getElementById(id);

				if (!dropDown) {
					dropDown = Demo.Page.initDropDown(id);
				}

				// 如果移到了菜单上，则停止关闭菜单的计时器。
				dropDown.onmouseover = function () {
					if (Demo.Page.dropDownTimerHide) {
						clearTimeout(Demo.Page.dropDownTimerHide);
						Demo.Page.dropDownTimerHide = 0;
					}
				};

				dropDown.onmouseout = Demo.Page.hideDropDown;

				dropDown.style.display = '';

				if (dropDown.defaultButton) {
					dropDown.defaultButton.focus();
				}
				Demo.Page.dropDownShown = dropDown;
			}, delay || 200);

		},

		cleanDropDownTimer: function () {

			// 如果正在隐藏，则忽略之。
			if (Demo.Page.dropDownTimerHide) {
				clearTimeout(Demo.Page.dropDownTimerHide);
				Demo.Page.dropDownTimerHide = 0;
			}

			// 如果正在显示，则忽略之。
			if (Demo.Page.dropDownTimerShow) {
				clearTimeout(Demo.Page.dropDownTimerShow);
				Demo.Page.dropDownTimerShow = 0;
			}
		},

		hideDropDown: function () {

			Demo.Page.cleanDropDownTimer();

			if (Demo.Page.dropDownShown) {
				Demo.Page.dropDownTimerHide = setTimeout(function () {
					Demo.Page.dropDownShown.style.display = 'none';
					Demo.Page.dropDownShown = null;
				}, 400);
			}
		},

		addModuleHistory: function (dpl) {
			if (window.localStorage) {
				var dplList = localStorage.demoModuleHistory;
				dplList = dplList ? dplList.split(';') : [];

				for (var i = 0; i < dplList.length; i++) {
					if (dplList[i] === dpl) {
						dplList.splice(i, 1);
						break;
					}
				}

				if (dplList.length > Demo.Configs.maxHistory) {
					dplList.shift();
				}

				dplList.push(dpl);
				localStorage.demoModuleHistory = dplList.join(';');
			}
		},

		exploreSource: function () {
			if (Demo.local) {
				var img = new Image();
				img.src = Demo.Configs.serverBaseUrl + Demo.Configs.apps + "/server/explorer.njs?path=" + encodeURIComponent(location.pathname) + "&_=" + (+new Date()) + Math.random();
			} else {
				location.href = 'view-source:' + location.href;
			}
		},

		/**
		 * 载入 DPL 列表。
		 */
		loadModuleList: function (callback) {

			if (window.ModuleList) {
				callback(window.ModuleList);
				return;
			}

			var script = document.createElement('SCRIPT');
			script.onload = script.onreadystatechange = function () {
				if (!script.readyState || !/in/.test(script.readyState)) {
					script.onload = script.onreadystatechange = null;

					callback(window.ModuleList);
				}
			};

			script.type = 'text/javascript';
			script.src = Demo.baseUrl + Demo.Configs.apps + "/data/modulelist.js";

			var head = document.getElementsByTagName('HEAD')[0];
			head.insertBefore(script, head.firstChild);
		},

		gotoUpdateList: function () {

			if (!window.ModuleList) {
				return;
			}

			var dropDown = document.getElementById('demo-toolbar-goto'),
				filter = dropDown.defaultButton.value.toLowerCase(),
				pathLower,
				html = '',
				html2 = '',
				histories,
				sep = false;

			if (filter) {
				filter = filter.replace(/^\s+|\s+$/g, "").toLowerCase();
				for (var path in ModuleList.examples) {
					if (path.indexOf('/' + filter) >= 0) {
						html += getTpl(path);
					} else if (path.indexOf(filter) >= 0 || ModuleList.examples[path].name.toLowerCase().indexOf(filter) >= 0) {
						html2 += getTpl(path);
					}
				}
			} else {

				if (histories = window.localStorage && localStorage.demoModuleHistory) {
					histories = histories.split(';');
					for (var i = histories.length - 1; i >= 0; i--) {
						if (histories[i] in ModuleList.examples) {
							html += getTpl(histories[i]);
						}
					}

					sep = !!html;
				}

				for (var path in ModuleList.examples) {
					html2 += getTpl(path);
				}
			}

			function getTpl(path) {
				var tpl = '';
				if (sep) {
					tpl = ' style="border-top: 1px solid #EBEBEB"';
					sep = false;
				}
				return '<a' + tpl + ' onmouseover="Demo.Page.gotoSetListHover(this)" href="' + Demo.baseUrl + Demo.Configs.examples + "/" + path + '">' + path.replace(/\.\w+$/, "") + '<small style="color: #999"> - ' + ModuleList.examples[path].name + '</small></a>';
			}

			dropDown.lastChild.innerHTML = html + html2;

			if (dropDown.lastChild.firstChild) {
				dropDown.lastChild.firstChild.className = 'demo-toolbar-dropdown-menu-hover';
			}

		},

		gotoMoveListHover: function (goDown) {
			var currentNode = Demo.Page.gotoGetCurrent();

			if (currentNode) {
				currentNode.className = '';
			}

			if (!currentNode || !currentNode[goDown ? 'nextSibling' : 'previousSibling']) {
				currentNode = document.getElementById('demo-toolbar-goto').lastChild[goDown ? 'firstChild' : 'lastChild'];
			} else {
				currentNode = currentNode[goDown ? 'nextSibling' : 'previousSibling'];
			}

			if (currentNode)
				currentNode.className = 'demo-toolbar-dropdown-menu-hover';
		},

		gotoSetListHover: function (newHover) {
			var current = Demo.Page.gotoGetCurrent();
			if (current) {
				current.className = '';
			}
			newHover.className = 'demo-toolbar-dropdown-menu-hover';
		},

		gotoGetCurrent: function () {
			var node = document.getElementById('demo-toolbar-goto').lastChild;
			for (node = node.firstChild; node; node = node.nextSibling) {
				if (node.className === 'demo-toolbar-dropdown-menu-hover') {
					return node;
				}
			}
		}

	};

	/**
	 * 向页面写入自动生成的头部信息。
	 */
	Demo.writeHeader = function () {

		// 获取当前页面的配置信息。
		var configs = Demo.Configs,
			space = navigator.userAgent.indexOf('Firefox/') > 0 ? '' : ' ',
			html = '',
			node = document.getElementsByTagName("meta"),
			i,
			moduleInfo,
			isInDocs = Demo.urlPrefix === configs.examples,
			isHomePage = !Demo.urlPostfix || /^index\./.test(Demo.urlPostfix);

		// 生成 moduleInfo 字段。

		for (i = 0; node[i]; i++) {
			if (node[i].name === configs.metaModuleInfo) {
				node = node[i].content;
				moduleInfo = Demo.Module.parseModuleInfo(node);
				break;
			}
		}

		Demo.moduleInfo = moduleInfo = moduleInfo || {};

		if (!(moduleInfo.status in configs.status)) {
			moduleInfo.status = 'ok';
		}

		// 默认使用 document.title 作为标题。
		if (!('name' in moduleInfo)) {
			moduleInfo.name = document.title;
		}

		// 输出 css 和 js
		document.write('<link type="text/css" rel="stylesheet" href="' + Demo.baseUrl + configs.apps + '/demo/demo.css" />');
		// document.write('<link type="text/css" rel="stylesheet" href="' + Demo.baseUrl + configs.apps + '_staticpages/assets/demo.css" />');

		// 不支持 console 时，自动载入 firebug-lite 。
		if (!window.console)
			document.write('<script type="text/javascript" src="' + Demo.baseUrl + configs.apps + '/demo/firebug-lite/build/firebug-lite.js"></script>');

		// 非本地运行时，自动载入统计代码。
		if (!Demo.local) {
			document.write('<script type="text/javascript" src="' + Demo.baseUrl + configs.apps + '/demo/social.js"></script>');
		}

		// IE 需要强制中止 <head>
		if (Demo.Dom.isIE) {
			document.write('<div class="demo-hide" id="demo-ie6-html5hack">&nbsp;</div>');
			document.body.removeChild(document.getElementById("demo-ie6-html5hack"));
		}

		// 输出 header
		html += '<header class="demo">';

		html += '<aside id="demo-toolbar"><nav class="demo-toolbar">';

		// 如果当前的页面是 docs 下的一个页面。
		// 则添加模块状态和历史记录。
		if (isInDocs && !isHomePage) {

			if (!('path' in moduleInfo)) {
				moduleInfo.path = Demo.Module.toModulePath(Demo.urlPostfix);
			}

			// 模块默认使用路径作为副标题。
			if (!moduleInfo.subtitle) {
				moduleInfo.subtitle = moduleInfo.path;
			}

			Demo.Page.addModuleHistory(Demo.urlPostfix);

			// 只有本地的时候，才支持修改模块状态。
			if (Demo.local) {
				html += '<a href="javascript://更改模块属性" onclick="Demo.Page.showDropDown(\'demo-toolbar-controlstate\', 1);return false;" onmouseout="Demo.Page.hideDropDown()" title="点击修改模块状态" accesskey="S">' + configs.status[moduleInfo.status] + '</a> | ';
			} else {
				html += '<a href="javascript:;">' + configs.status[moduleInfo.status] + '</a> | ';
			}
		}

		html += '<a href="javascript://常用文档" onclick="Demo.Page.showDropDown(\'demo-toolbar-doc\', 1);return false;" onmouseover="Demo.Page.showDropDown(\'demo-toolbar-doc\')" onmouseout="Demo.Page.hideDropDown()" accesskey="D">文档' + space + '▾</a> | <a href="javascript://常用工具" onclick="Demo.Page.showDropDown(\'demo-toolbar-tool\', 1);return false;" onmouseover="Demo.Page.showDropDown(\'demo-toolbar-tool\')" onclick="Demo.Page.showDropDown(\'demo-toolbar-tool\', 1);return false;" onmouseout="Demo.Page.hideDropDown()" accesskey="T">工具' + space + '▾</a> | <a href="javascript://快速打开其他模块" onmouseover="Demo.Page.showDropDown(\'demo-toolbar-goto\')" onclick="Demo.Page.showDropDown(\'demo-toolbar-goto\', 1);return false;" onmouseout="Demo.Page.hideDropDown()" accesskey="F">搜索' + space + '▾</a> | <a href="' + Demo.baseUrl + configs.examples + '/index.html" title="返回模块列表" accesskey="H">返回列表</a></nav></aside>';

		// 生成标题。
		if (moduleInfo.name) {
			html += '<h1 class="demo">' + moduleInfo.name;

			if (moduleInfo.subtitle) {
				html += '<small>' + moduleInfo.subtitle + '</small>';
			}

			html += '</h1>';
		}

		html += '</header>';

		document.write(html);

	};

	/**
	* 向页面写入自动生成的底部信息。
	*/
	Demo.writeFooter = function () {
		document.write(Demo.Configs.footer.replace(/~\//g, Demo.baseUrl));
	};

	/**
	 * 代码高亮模块。
	 */
	Demo.SyntaxHighligher = (function () {
		// Copyright (C) 2012 xuld
		//
		// Licensed under the Apache License, Version 2.0 (the "License");
		// you may not use this file except in compliance with the License.
		// You may obtain a copy of the License at
		//
		//      http://www.apache.org/licenses/LICENSE-2.0
		//
		// Unless required by applicable law or agreed to in writing, software
		// distributed under the License is distributed on an "AS IS" BASIS,
		// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		// See the License for the specific language governing permissions and
		// limitations under the License.

		/**
		 * @namespace SyntaxHighligher
		 */
		var SH = {

			/**
			 * 所有可用的刷子。
			 */
			brushes: {
				none: function (sourceCode, position) {
					return [position, 'plain'];
				}
			},

			/**
			 * 创建一个用于指定规则的语法刷子。
			 * @param {Array} stylePatterns 匹配的正则列表，格式为：。
			 * [[css样式名1, 正则1, 可选的头字符], [css样式名2, 正则2], ...]
			 * 其中，可选的头字符是这个匹配格式的简化字符，如果源码以这个字符里的任何字符打头，表示自动匹配这个正则。
			 * @return {Function} 返回一个刷子函数。刷子函数的输入为：
			 *
			 * - sourceCode {String} 要处理的源码。
			 * - position {Number} 要开始处理的位置。
			 *
			 * 返回值为一个数组，格式为。
			 * [位置1, 样式1, 位置2, 样式2, ..., 位置n-1, 样式n-1]
			 *
			 * 表示源码中， 位置n-1 到 位置n 之间应用样式n-1
			 */
			createBrush: function (stylePatterns) {
				var shortcuts = {},
					tokenizer, stylePatternsStart = 0,
					stylePatternsEnd = stylePatterns.length;
				(function () {
					var allRegexs = [],
						i, stylePattern, shortcutChars, c;
					for (i = 0; i < stylePatternsEnd; i++) {
						stylePattern = stylePatterns[i];
						if ((shortcutChars = stylePattern[2])) {
							for (c = shortcutChars.length; --c >= 0;) {
								shortcuts[shortcutChars.charAt(c)] = stylePattern;
							}

							if (i == stylePatternsStart) stylePatternsStart++;
						}
						allRegexs.push(stylePattern[1]);
					}
					allRegexs.push(/[\0-\uffff]/);
					tokenizer = combinePrefixPatterns(allRegexs);
				})();

				function decorate(sourceCode, position) {
					/** Even entries are positions in source in ascending order.  Odd enties
					 * are style markers (e.g., COMMENT) that run from that position until
					 * the end.
					 * @type {Array<number/string>}
					 */
					var decorations = [position, 'plain'],
						tokens = sourceCode.match(tokenizer) || [],
						pos = 0,
						// index into sourceCode
						styleCache = {},
						ti = 0,
						nTokens = tokens.length,
						token, style, match, isEmbedded, stylePattern;

					while (ti < nTokens) {
						token = tokens[ti++];

						if (styleCache.hasOwnProperty(token)) {
							style = styleCache[token];
							isEmbedded = false;
						} else {

							// 测试 shortcuts。
							stylePattern = shortcuts[token.charAt(0)];
							if (stylePattern) {
								match = token.match(stylePattern[1]);
								style = stylePattern[0];
							} else {
								for (var i = stylePatternsStart; i < stylePatternsEnd; ++i) {
									stylePattern = stylePatterns[i];
									match = token.match(stylePattern[1]);
									if (match) {
										style = stylePattern[0];
										break;
									}
								}

								if (!match) { // make sure that we make progress
									style = 'plain';
								}
							}

							if (style in SH.brushes) {
								if (style === 'none') {
									style = SH.guessLanguage(match[1]);
								}
								style = SH.brushes[style];
							}

							isEmbedded = typeof style === 'function';

							if (!isEmbedded) {
								styleCache[token] = style;
							}
						}

						if (isEmbedded) {
							// Treat group 1 as an embedded block of source code.
							var embeddedSource = match[1];
							var embeddedSourceStart = token.indexOf(embeddedSource);
							var embeddedSourceEnd = embeddedSourceStart + embeddedSource.length;
							if (match[2]) {
								// If embeddedSource can be blank, then it would match at the
								// beginning which would cause us to infinitely recurse on the
								// entire token, so we catch the right context in match[2].
								embeddedSourceEnd = token.length - match[2].length;
								embeddedSourceStart = embeddedSourceEnd - embeddedSource.length;
							}

							// Decorate the left of the embedded source
							appendDecorations(position + pos, token.substring(0, embeddedSourceStart), decorate, decorations);
							// Decorate the embedded source
							appendDecorations(position + pos + embeddedSourceStart, embeddedSource, style, decorations);
							// Decorate the right of the embedded section
							appendDecorations(position + pos + embeddedSourceEnd, token.substring(embeddedSourceEnd), decorate, decorations);
						} else {
							decorations.push(position + pos, style);
						}
						pos += token.length;
					}


					removeEmptyAndNestedDecorations(decorations);
					return decorations;
				};

				return decorate;
			},

			/**
			 * 根据源码猜测对应的刷子。
			 * @param {String} sourceCode 需要高亮的源码。
			 * @return {String} 返回一个语言名。
			 */
			guessLanguage: function (sourceCode) {
				// Treat it as markup if the first non whitespace character is a < and
				// the last non-whitespace character is a >.
				return /^\s*</.test(sourceCode) ? 'xml' : 'default';
			},

			/**
			 * 搜索用于处理指定语言的刷子。
			 * @param {String} language 要查找的语言名。
			 * @return {Function} 返回一个刷子，用于高亮指定的源码。
			 */
			findBrush: function (language) {
				return SH.brushes[language] || SH.brushes.none;
			},

			/**
			 * 注册一个语言的刷子。
			 * @param {String} language 要注册的语言名。
			 * @param {Array} stylePatterns 匹配的正则列表。见 {@link SyntaxHighligher.createBrush}
			 * @return {Function} 返回一个刷子，用于高亮指定的源码。
			 */
			register: function (language, stylePatterns) {
				language = language.split(' ');
				stylePatterns = SH.createBrush(stylePatterns);
				for (var i = 0; i < language.length; i++) {
					SH.brushes[language[i]] = stylePatterns;
				}
			}

		};

		// CAVEAT: this does not properly handle the case where a regular
		// expression immediately follows another since a regular expression may
		// have flags for case-sensitivity and the like.  Having regexp tokens
		// adjacent is not valid in any language I'm aware of, so I'm punting.
		// TODO: maybe style special characters inside a regexp as punctuation.

		/**
		 * Given a group of {@link RegExp}s, returns a {@code RegExp} that globally
		 * matches the union of the sets of strings matched by the input RegExp.
		 * Since it matches globally, if the input strings have a start-of-input
		 * anchor (/^.../), it is ignored for the purposes of unioning.
		 * @param {Array.<RegExp>} regexs non multiline, non-global regexs.
		 * @return {RegExp} a global regex.
		 */
		function combinePrefixPatterns(regexs) {
			var capturedGroupIndex = 0;

			var needToFoldCase = false;
			var ignoreCase = false;
			for (var i = 0, n = regexs.length; i < n; ++i) {
				var regex = regexs[i];
				if (regex.ignoreCase) {
					ignoreCase = true;
				} else if (/[a-z]/i.test(regex.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ''))) {
					needToFoldCase = true;
					ignoreCase = false;
					break;
				}
			}

			function allowAnywhereFoldCaseAndRenumberGroups(regex) {
				// Split into character sets, escape sequences, punctuation strings
				// like ('(', '(?:', ')', '^'), and runs of characters that do not
				// include any of the above.
				var parts = regex.source.match(
				new RegExp('(?:' + '\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]' // a character set
				+
				'|\\\\u[A-Fa-f0-9]{4}' // a unicode escape
				+
				'|\\\\x[A-Fa-f0-9]{2}' // a hex escape
				+
				'|\\\\[0-9]+' // a back-reference or octal escape
				+
				'|\\\\[^ux0-9]' // other escape sequence
				+
				'|\\(\\?[:!=]' // start of a non-capturing group
				+
				'|[\\(\\)\\^]' // start/emd of a group, or line start
				+
				'|[^\\x5B\\x5C\\(\\)\\^]+' // run of other characters
				+
				')', 'g'));
				var n = parts.length;

				// Maps captured group numbers to the number they will occupy in
				// the output or to -1 if that has not been determined, or to
				// undefined if they need not be capturing in the output.
				var capturedGroups = [];

				// Walk over and identify back references to build the capturedGroups
				// mapping.
				for (var i = 0, groupIndex = 0; i < n; ++i) {
					var p = parts[i];
					if (p === '(') {
						// groups are 1-indexed, so max group index is count of '('
						++groupIndex;
					} else if ('\\' === p.charAt(0)) {
						var decimalValue = +p.substring(1);
						if (decimalValue && decimalValue <= groupIndex) {
							capturedGroups[decimalValue] = -1;
						}
					}
				}

				// Renumber groups and reduce capturing groups to non-capturing groups
				// where possible.
				for (var i = 1; i < capturedGroups.length; ++i) {
					if (-1 === capturedGroups[i]) {
						capturedGroups[i] = ++capturedGroupIndex;
					}
				}
				for (var i = 0, groupIndex = 0; i < n; ++i) {
					var p = parts[i];
					if (p === '(') {
						++groupIndex;
						if (capturedGroups[groupIndex] === undefined) {
							parts[i] = '(?:';
						}
					} else if ('\\' === p.charAt(0)) {
						var decimalValue = +p.substring(1);
						if (decimalValue && decimalValue <= groupIndex) {
							parts[i] = '\\' + capturedGroups[groupIndex];
						}
					}
				}

				// Remove any prefix anchors so that the output will match anywhere.
				// ^^ really does mean an anchored match though.
				for (var i = 0, groupIndex = 0; i < n; ++i) {
					if ('^' === parts[i] && '^' !== parts[i + 1]) {
						parts[i] = '';
					}
				}

				// Expand letters to groups to handle mixing of case-sensitive and
				// case-insensitive patterns if necessary.
				if (regex.ignoreCase && needToFoldCase) {
					for (var i = 0; i < n; ++i) {
						var p = parts[i];
						var ch0 = p.charAt(0);
						if (p.length >= 2 && ch0 === '[') {
							parts[i] = caseFoldCharset(p);
						} else if (ch0 !== '\\') {
							// TODO: handle letters in numeric escapes.
							parts[i] = p.replace(/[a-zA-Z]/g, function (ch) {
								var cc = ch.charCodeAt(0);
								return '[' + String.fromCharCode(cc & ~32, cc | 32) + ']';
							});
						}
					}
				}

				return parts.join('');
			}

			var rewritten = [];
			for (var i = 0, n = regexs.length; i < n; ++i) {
				var regex = regexs[i];
				if (regex.global || regex.multiline) {
					throw new Error('' + regex);
				}
				rewritten.push('(?:' + allowAnywhereFoldCaseAndRenumberGroups(regex) + ')');
			}

			return new RegExp(rewritten.join('|'), ignoreCase ? 'gi' : 'g');
		}

		function encodeEscape(charCode) {
			if (charCode < 0x20) {
				return (charCode < 0x10 ? '\\x0' : '\\x') + charCode.toString(16);
			}
			var ch = String.fromCharCode(charCode);
			if (ch === '\\' || ch === '-' || ch === '[' || ch === ']') {
				ch = '\\' + ch;
			}
			return ch;
		}

		var escapeCharToCodeUnit = {
			'b': 8,
			't': 9,
			'n': 0xa,
			'v': 0xb,
			'f': 0xc,
			'r': 0xd
		};

		function decodeEscape(charsetPart) {
			var cc0 = charsetPart.charCodeAt(0);
			if (cc0 !== 92 /* \\ */) {
				return cc0;
			}
			var c1 = charsetPart.charAt(1);
			cc0 = escapeCharToCodeUnit[c1];
			if (cc0) {
				return cc0;
			} else if ('0' <= c1 && c1 <= '7') {
				return parseInt(charsetPart.substring(1), 8);
			} else if (c1 === 'u' || c1 === 'x') {
				return parseInt(charsetPart.substring(2), 16);
			} else {
				return charsetPart.charCodeAt(1);
			}
		}

		function caseFoldCharset(charSet) {
			var charsetParts = charSet.substring(1, charSet.length - 1).match(
			new RegExp('\\\\u[0-9A-Fa-f]{4}' + '|\\\\x[0-9A-Fa-f]{2}' + '|\\\\[0-3][0-7]{0,2}' + '|\\\\[0-7]{1,2}' + '|\\\\[\\s\\S]' + '|-' + '|[^-\\\\]', 'g'));
			var groups = [];
			var ranges = [];
			var inverse = charsetParts[0] === '^';
			for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
				var p = charsetParts[i];
				if (/\\[bdsw]/i.test(p)) { // Don't muck with named groups.
					groups.push(p);
				} else {
					var start = decodeEscape(p);
					var end;
					if (i + 2 < n && '-' === charsetParts[i + 1]) {
						end = decodeEscape(charsetParts[i + 2]);
						i += 2;
					} else {
						end = start;
					}
					ranges.push([start, end]);
					// If the range might intersect letters, then expand it.
					// This case handling is too simplistic.
					// It does not deal with non-latin case folding.
					// It works for latin source code identifiers though.
					if (!(end < 65 || start > 122)) {
						if (!(end < 65 || start > 90)) {
							ranges.push([Math.max(65, start) | 32, Math.min(end, 90) | 32]);
						}
						if (!(end < 97 || start > 122)) {
							ranges.push([Math.max(97, start) & ~32, Math.min(end, 122) & ~32]);
						}
					}
				}
			}

			// [[1, 10], [3, 4], [8, 12], [14, 14], [16, 16], [17, 17]]
			// -> [[1, 12], [14, 14], [16, 17]]
			ranges.sort(function (a, b) {
				return (a[0] - b[0]) || (b[1] - a[1]);
			});
			var consolidatedRanges = [];
			var lastRange = [NaN, NaN];
			for (var i = 0; i < ranges.length; ++i) {
				var range = ranges[i];
				if (range[0] <= lastRange[1] + 1) {
					lastRange[1] = Math.max(lastRange[1], range[1]);
				} else {
					consolidatedRanges.push(lastRange = range);
				}
			}

			var out = ['['];
			if (inverse) {
				out.push('^');
			}
			out.push.apply(out, groups);
			for (var i = 0; i < consolidatedRanges.length; ++i) {
				var range = consolidatedRanges[i];
				out.push(encodeEscape(range[0]));
				if (range[1] > range[0]) {
					if (range[1] + 1 > range[0]) {
						out.push('-');
					}
					out.push(encodeEscape(range[1]));
				}
			}
			out.push(']');
			return out.join('');
		}

		/**
		 * Apply the given language handler to sourceCode and add the resulting
		 * decorations to out.
		 * @param {number} basePos the index of sourceCode within the chunk of source
		 *    whose decorations are already present on out.
		 */
		function appendDecorations(basePos, sourceCode, brush, out) {
			if (sourceCode) {
				out.push.apply(out, brush(sourceCode, basePos));
			}
		}

		/**
		 * 删除空的位置和相邻的位置。
		 */
		function removeEmptyAndNestedDecorations(decorations) {
			for (var srcIndex = 0, destIndex = 0, length = decorations.length, lastPos, lastStyle; srcIndex < length;) {

				// 如果上一个长度和当前长度相同，或者上一个样式和现在的相同，则跳过。
				if (lastPos === decorations[srcIndex]) {
					srcIndex++;
					decorations[destIndex - 1] = lastStyle = decorations[srcIndex++];
				} else if (lastStyle === decorations[srcIndex + 1]) {
					srcIndex += 2;
				} else {
					decorations[destIndex++] = lastPos = decorations[srcIndex++];
					decorations[destIndex++] = lastStyle = decorations[srcIndex++];
				}
			};

			decorations.length = destIndex;

		}

		/**
		 * 高亮单一的节点。
		 * @param {Element} elem 要高亮的节点。
		 * @param {String} [language] 语言本身。系统会自动根据源码猜测语言。
		 * @param {Number} lineNumberStart=null 第一行的计数，如果是null，则不显示行号。
		 */
		SH.one = function (pre, language, lineNumberStart) {

			// Extract tags, and convert the source code to plain text.
			var sourceAndSpans = extractSourceSpans(pre),
				specificLanuage = (pre.className.match(/\bsh-(\w+)(?!\S)/i) || [0, null])[1];

			// 自动决定 language 和 lineNumbers
			if (!language) {
				language = specificLanuage || SH.guessLanguage(sourceAndSpans.sourceCode);
			}

			if (!specificLanuage) {
				pre.className += ' sh-' + language;
			}

			// Apply the appropriate language handler
			// Integrate the decorations and tags back into the source code,
			// modifying the sourceNode in place.
			recombineTagsAndDecorations(sourceAndSpans, SH.findBrush(language)(sourceAndSpans.sourceCode, 0));
		};

		/**
		 * Split markup into a string of source code and an array mapping ranges in
		 * that string to the text nodes in which they appear.
		 *
		 * <p>
		 * The HTML DOM structure:</p>
		 * <pre>
		 * (Element   "p"
		 *   (Element "b"
		 *     (Text  "print "))       ; #1
		 *   (Text    "'Hello '")      ; #2
		 *   (Element "br")            ; #3
		 *   (Text    "  + 'World';")) ; #4
		 * </pre>
		 * <p>
		 * corresponds to the HTML
		 * {@code <p><b>print </b>'Hello '<br>  + 'World';</p>}.</p>
		 *
		 * <p>
		 * It will produce the output:</p>
		 * <pre>
		 * {
		 *   sourceCode: "print 'Hello '\n  + 'World';",
		 *   //              1         2
		 *   //       012345678901234 5678901234567
		 *   spans: [0, #1, 6, #2, 14, #3, 15, #4]
		 * }
		 * </pre>
		 * <p>
		 * where #1 is a reference to the {@code "print "} text node above, and so
		 * on for the other text nodes.
		 * </p>
		 *
		 * <p>
		 * The {@code} spans array is an array of pairs.  Even elements are the start
		 * indices of substrings, and odd elements are the text nodes (or BR elements)
		 * that contain the text for those substrings.
		 * Substrings continue until the next index or the end of the source.
		 * </p>
		 *
		 * @param {Node} node an HTML DOM subtree containing source-code.
		 * @return {Object} source code and the text nodes in which they occur.
		 */
		function extractSourceSpans(node) {

			var chunks = [];
			var length = 0;
			var spans = [];
			var k = 0;

			var whitespace;
			if (node.currentStyle) {
				whitespace = node.currentStyle.whiteSpace;
			} else if (window.getComputedStyle) {
				whitespace = document.defaultView.getComputedStyle(node, null).getPropertyValue('white-space');
			}
			var isPreformatted = whitespace && 'pre' === whitespace.substring(0, 3);

			function walk(node) {
				switch (node.nodeType) {
					case 1:
						// Element
						for (var child = node.firstChild; child; child = child.nextSibling) {
							walk(child);
						}
						var nodeName = node.nodeName;
						if ('BR' === nodeName || 'LI' === nodeName) {
							chunks[k] = '\n';
							spans[k << 1] = length++;
							spans[(k++ << 1) | 1] = node;
						}
						break;
					case 3:
					case 4:
						// Text
						var text = node.nodeValue;
						if (text.length) {
							if (isPreformatted) {
								text = text.replace(/\r\n?/g, '\n'); // Normalize newlines.
							} else {
								text = text.replace(/[\r\n]+/g, '\r\n　');
								text = text.replace(/[ \t]+/g, ' ');
							}
							// TODO: handle tabs here?
							chunks[k] = text;
							spans[k << 1] = length;
							length += text.length;
							spans[(k++ << 1) | 1] = node;
						}
						break;
				}
			}

			walk(node);

			return {
				sourceCode: chunks.join('').replace(/\n$/, ''),
				spans: spans
			};
		}

		/**
		 * Breaks {@code job.sourceCode} around style boundaries in
		 * {@code job.decorations} and modifies {@code job.sourceNode} in place.
		 * @param {Object} job like <pre>{
		 *    sourceCode: {string} source as plain text,
		 *    spans: {Array.<number|Node>} alternating span start indices into source
		 *       and the text node or element (e.g. {@code <BR>}) corresponding to that
		 *       span.
		 *    decorations: {Array.<number|string} an array of style classes preceded
		 *       by the position at which they start in job.sourceCode in order
		 * }</pre>
		 * @private
		 */
		function recombineTagsAndDecorations(sourceAndSpans, decorations) {
			//var isIE = /\bMSIE\b/.test(navigator.userAgent);
			var newlineRe = /\n/g;

			var source = sourceAndSpans.sourceCode;
			var sourceLength = source.length;
			// Index into source after the last code-unit recombined.
			var sourceIndex = 0;

			var spans = sourceAndSpans.spans;
			var nSpans = spans.length;
			// Index into spans after the last span which ends at or before sourceIndex.
			var spanIndex = 0;

			var decorations = decorations;
			var nDecorations = decorations.length;
			var decorationIndex = 0;

			var decoration = null;
			while (spanIndex < nSpans) {
				var spanStart = spans[spanIndex];
				var spanEnd = spans[spanIndex + 2] || sourceLength;

				var decStart = decorations[decorationIndex];
				var decEnd = decorations[decorationIndex + 2] || sourceLength;

				var end = Math.min(spanEnd, decEnd);

				var textNode = spans[spanIndex + 1];
				var styledText;
				if (textNode.nodeType !== 1 // Don't muck with <BR>s or <LI>s
					// Don't introduce spans around empty text nodes.
				&&
				(styledText = source.substring(sourceIndex, end))) {
					// This may seem bizarre, and it is.  Emitting LF on IE causes the
					// code to display with spaces instead of line breaks.
					// Emitting Windows standard issue linebreaks (CRLF) causes a blank
					// space to appear at the beginning of every line but the first.
					// Emitting an old Mac OS 9 line separator makes everything spiffy.
					// if (isIE) {
					// styledText = styledText.replace(newlineRe, '\r');
					// }
					textNode.nodeValue = styledText;
					var document = textNode.ownerDocument;
					var span = document.createElement('SPAN');
					span.className = 'sh-' + decorations[decorationIndex + 1];
					var parentNode = textNode.parentNode;
					parentNode.replaceChild(span, textNode);
					span.appendChild(textNode);
					if (sourceIndex < spanEnd) { // Split off a text node.
						spans[spanIndex + 1] = textNode
						// TODO: Possibly optimize by using '' if there's no flicker.
						=
						document.createTextNode(source.substring(end, spanEnd));
						parentNode.insertBefore(textNode, span.nextSibling);
					}
				}

				sourceIndex = end;

				if (sourceIndex >= spanEnd) {
					spanIndex += 2;
				}
				if (sourceIndex >= decEnd) {
					decorationIndex += 2;
				}
			}
		}

		// Keyword lists for various languages.
		// We use things that coerce to strings to make them compact when minified
		// and to defeat aggressive optimizers that fold large string constants.
		var FLOW_CONTROL_KEYWORDS = "break continue do else for if return while";
		var C_KEYWORDS = FLOW_CONTROL_KEYWORDS + " auto case char const default double enum extern float goto int long register short signed sizeof " + "static struct switch typedef union unsigned void volatile";
		var COMMON_KEYWORDS = [C_KEYWORDS, "catch class delete false import new operator private protected public this throw true try typeof"];
		var CPP_KEYWORDS = [COMMON_KEYWORDS, "alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename using virtual where"];
		var JAVA_KEYWORDS = [COMMON_KEYWORDS, "abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient"];
		var CSHARP_KEYWORDS = [JAVA_KEYWORDS, "as base by checked decimal delegate descending dynamic event fixed foreach from group implicit in interface internal into is lock object out override orderby params partial readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var"];
		var JSCRIPT_KEYWORDS = [COMMON_KEYWORDS, "debugger eval export function get null set undefined var with Infinity NaN"];
		var PERL_KEYWORDS = "caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END";
		var PYTHON_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None"];
		var RUBY_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END"];
		var SH_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "case done elif esac eval fi function in local set then until"];
		var ALL_KEYWORDS = [CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS + PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS];
		var C_TYPES = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/;

		/**
		 * A set of tokens that can precede a regular expression literal in
		 * javascript
		 * http://web.archive.org/web/20070717142515/http://www.mozilla.org/js/language/js20/rationale/syntax.html
		 * has the full list, but I've removed ones that might be problematic when
		 * seen in languages that don't support regular expression literals.
		 *
		 * <p>Specifically, I've removed any keywords that can't precede a regexp
		 * literal in a syntactically legal javascript program, and I've removed the
		 * "in" keyword since it's not a keyword in many languages, and might be used
		 * as a count of inches.
		 *
		 * <p>The link a above does not accurately describe EcmaScript rules since
		 * it fails to distinguish between (a=++/b/i) and (a++/b/i) but it works
		 * very well in practice.
		 *
		 * @private
		 * @const
		 */
		var REGEXP_PRECEDER_PATTERN = '(?:^^\\.?|[+-]|\\!|\\!=|\\!==|\\#|\\%|\\%=|&|&&|&&=|&=|\\(|\\*|\\*=|\\+=|\\,|\\-=|\\->|\\/|\\/=|:|::|\\;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\@|\\[|\\^|\\^=|\\^\\^|\\^\\^=|\\{|\\||\\|=|\\|\\||\\|\\|=|\\~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';
		// token style names.  correspond to css classes
		/**
		 * token style for a string literal
		 * @const
		 */
		var STRING = 'string';
		/**
		 * token style for a keyword
		 * @const
		 */
		var KEYWORD = 'keyword';
		/**
		 * token style for a comment
		 * @const
		 */
		var COMMENT = 'comment';
		/**
		 * token style for a type
		 * @const
		 */
		var TYPE = 'type';
		/**
		 * token style for a literal value.  e.g. 1, null, true.
		 * @const
		 */
		var LITERAL = 'literal';
		/**
		 * token style for a punctuation string.
		 * @const
		 */
		var PUNCTUATION = 'punctuation';
		/**
		 * token style for a punctuation string.
		 * @const
		 */
		var PLAIN = 'plain';

		/**
		 * token style for an sgml tag.
		 * @const
		 */
		var TAG = 'tag';
		/**
		 * token style for a markup declaration such as a DOCTYPE.
		 * @const
		 */
		var DECLARATION = 'declaration';
		/**
		 * token style for embedded source.
		 * @const
		 */
		var SOURCE = 'source';
		/**
		 * token style for an sgml attribute name.
		 * @const
		 */
		var ATTRIB_NAME = 'attrname';
		/**
		 * token style for an sgml attribute value.
		 * @const
		 */
		var ATTRIB_VALUE = 'attrvalue';

		var register = SH.register;

		/** returns a function that produces a list of decorations from source text.
		 *
		 * This code treats ", ', and ` as string delimiters, and \ as a string
		 * escape.  It does not recognize perl's qq() style strings.
		 * It has no special handling for double delimiter escapes as in basic, or
		 * the tripled delimiters used in python, but should work on those regardless
		 * although in those cases a single string literal may be broken up into
		 * multiple adjacent string literals.
		 *
		 * It recognizes C, C++, and shell style comments.
		 *
		 * @param {Object} options a set of optional parameters.
		 * @return {function (Object)} a function that examines the source code
		 *     in the input job and builds the decoration list.
		 */
		var simpleLexer = SH.simpleLexer = function (options) {

			var shortcutStylePatterns = [], fallthroughStylePatterns = [];
			if (options.tripleQuotedStrings) {
				// '''multi-line-string''', 'single-line-string', and double-quoted
				shortcutStylePatterns.push(['string', /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, '\'"']);
			} else if (options.multiLineStrings) {
				// 'multi-line-string', "multi-line-string"
				shortcutStylePatterns.push(['string', /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, '\'"`']);
			} else {
				// 'single-line-string', "single-line-string"
				shortcutStylePatterns.push(['string', /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, '"\'']);
			}
			if (options.verbatimStrings) {
				// verbatim-string-literal production from the C# grammar.  See issue 93.
				fallthroughStylePatterns.push(['string', /^@\"(?:[^\"]|\"\")*(?:\"|$)/]);
			}
			var hc = options.hashComments;
			if (hc) {
				if (options.cStyleComments) {
					if (hc > 1) {  // multiline hash comments
						shortcutStylePatterns.push(['comment', /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, '#']);
					} else {
						// Stop C preprocessor declarations at an unclosed open comment
						shortcutStylePatterns.push(['comment', /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/, '#']);
					}
					fallthroughStylePatterns.push(['string', /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/]);
				} else {
					shortcutStylePatterns.push(['comment', /^#[^\r\n]*/, '#']);
				}
			}
			if (options.cStyleComments) {
				fallthroughStylePatterns.push(['comment', /^\/\/[^\r\n]*/]);
				fallthroughStylePatterns.push(['comment', /^\/\*[\s\S]*?(?:\*\/|$)/]);
			}
			if (options.regexLiterals) {
				fallthroughStylePatterns.push(['regex', new RegExp('^' + REGEXP_PRECEDER_PATTERN + '(' + // A regular expression literal starts with a slash that is
				// not followed by * or / so that it is not confused with
				// comments.
				'/(?=[^/*])'
				// and then contains any number of raw characters,
				+
				'(?:[^/\\x5B\\x5C]'
				// escape sequences (\x5C),
				+
				'|\\x5C[\\s\\S]'
				// or non-nesting character sets (\x5B\x5D);
				+
				'|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+'
				// finally closed by a /.
				+
				'/' + ')')]);
			}

			var types = options.types;
			if (types) {
				fallthroughStylePatterns.push(['type', types]);
			}

			var keywords = ("" + options.keywords).replace(/^ | $/g, '');
			if (keywords.length) {
				fallthroughStylePatterns.push(['keyword', new RegExp('^(?:' + keywords.replace(/[\s,]+/g, '|') + ')\\b')]);
			}

			shortcutStylePatterns.push(['plain', /^\s+/, ' \r\n\t\xA0']);
			fallthroughStylePatterns.push(
			// TODO(mikesamuel): recognize non-latin letters and numerals in idents
			['literal', /^@[a-z_$][a-z_$@0-9]*/i],
			['type', /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/],
			['plain', /^[a-z_$][a-z_$@0-9]*/i],
			['literal', new RegExp(
				 '^(?:'
				 // A hex number
				 + '0x[a-f0-9]+'
				 // or an octal or decimal number,
				 + '|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)'
				 // possibly in scientific notation
				 + '(?:e[+\\-]?\\d+)?'
				 + ')'
				 // with an optional modifier like UL for unsigned long
				 + '[a-z]*', 'i'), '0123456789'],
			// Don't treat escaped quotes in bash as starting strings.  See issue 144.
			['plain', /^\\[\s\S]?/],
			['punctuation', /^.[^\s\w\.$@\'\"\`\/\#\\]*/]);

			return shortcutStylePatterns.concat(fallthroughStylePatterns);





		}

		register('default', simpleLexer({
			'keywords': ALL_KEYWORDS,
			'hashComments': true,
			'cStyleComments': true,
			'multiLineStrings': true,
			'regexLiterals': true
		}));
		register('regex', [
			[STRING, /^[\s\S]+/]
		]);
		register('js', simpleLexer({
			'keywords': JSCRIPT_KEYWORDS,
			'cStyleComments': true,
			'regexLiterals': true
		}));
		register('in.tag',
		[
			[PLAIN, /^[\s]+/, ' \t\r\n'],
			[ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, '\"\''],
			[TAG, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
			[ATTRIB_NAME, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
			['uq.val', /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
			[PUNCTUATION, /^[=<>\/]+/],
			['js', /^on\w+\s*=\s*\"([^\"]+)\"/i],
			['js', /^on\w+\s*=\s*\'([^\']+)\'/i],
			['js', /^on\w+\s*=\s*([^\"\'>\s]+)/i],
			['css', /^style\s*=\s*\"([^\"]+)\"/i],
			['css', /^style\s*=\s*\'([^\']+)\'/i],
			['css', /^style\s*=\s*([^\"\'>\s]+)/i]
		]);

		register('htm html mxml xhtml xml xsl', [
			['plain', /^[^<?]+/],
			['declaration', /^<!\w[^>]*(?:>|$)/],
			['comment', /^<\!--[\s\S]*?(?:-\->|$)/],
			// Unescaped content in an unknown language
			['in.php', /^<\?([\s\S]+?)(?:\?>|$)/],
			['in.asp', /^<%([\s\S]+?)(?:%>|$)/],
			['punctuation', /^(?:<[%?]|[%?]>)/],
			['plain', /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
			// Unescaped content in javascript.  (Or possibly vbscript).
			['js', /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
			// Contains unescaped stylesheet content
			['css', /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
			['in.tag', /^(<\/?[a-z][^<>]*>)/i]
		]);

		register('json', simpleLexer({
			'keywords': 'null,true,false'
		}));

		return SH;
	})();

	/**
	 * 演示模块。
	 */
	Demo.Example = {

		run: function (id) {
			var example = this.data[id],
				ret;

			try {

				if (example[1]) {
					ret = example[1].call(window);
				} else {
					ret = window.eval(example[0]);
				}

			} catch (e) {
				this.reportResult(id, '[执行出现错误: ' + e.message + ']');
				console.error(example[0], ' => ', e);
				return;
			}

			if (ret === undefined) {
				console.log(example[0]);
			} else {
				console.log(example[0], " => ", ret);
			}

		},

		runAll: function () {
			var me = this,
				i = 0,
				len = me.data.length,
				needEnd;

			// Support For Alert
			var _alert = window.alert;
			window.alert = function (value) { console.info("alert: ", value); };

			function work() {
				if (i < len) {
					if (me.data[i][0] === null) {
						needEnd = true;
						if (i && console.groupEnd) {
							console.groupEnd();
						}

						if (console.group) {
							console.group(me.data[i][1]);
						} else {
							console.info(me.data[i][1]);
						}

						i++;
						work();
					} else {
						me.run(i++);
						setTimeout(work, 1);
					}

				} else {
					needEnd && console.groupEnd && console.groupEnd();
					window.alert = _alert;
				}
			}

			work();
		},

		speedTest: function (id) {

			// Support For Trace
			trace.disable = true;

			// Support For Alert
			var _alert = window.alert;
			window.alert = function () { };

			var time,
				currentTime,
				start = +new Date(),
				past,
				func = this.data[id][1] || new Function(this.data[id][0]);

			try {

				time = 0;

				do {

					time += 10;

					currentTime = 10;
					while (--currentTime > 0) {
						func();
					}

					past = +new Date() - start;

				} while (past < 100);

				past = '  [' + Math.round(past / time * 1000) / 1000 + 'ms]';

			} catch (e) {
				past = '[执行出现错误: ' + e.message + ']';
			} finally {
				window.alert = _alert;

				trace.disable = false;

			}

			this.reportResult(id, past);

		},

		speedTestAll: function () {
			var me = this, i = 0, len = me.data.length;
			function work() {
				if (i < len) {
					if (me.data[i][0] === null) {
						i++;
						work();
					} else {
						me.speedTest(i++);
						setTimeout(work, 1);
					}
				}
			}

			work();
		},

		reportResult: function (id, value) {
			id = document.getElementById('demo-example-' + id);

			if (id.lastChild.tagName !== 'SMALL') {
				id.appendChild(document.createElement('SMALL'));
			}

			id.lastChild.innerHTML = value;
		}

	};

	/**
	* 输出示例代码。
	*/
	Demo.writeExamples = function (examples, options) {

		var globalExamples = Demo.Example.data,
			html = '',
			key,
			id,
			example,
			text,
			func;

		// 如果第一次使用测试。则写入全部测试和效率。
		if (!globalExamples) {
			Demo.Example.data = globalExamples = [];
			html = '<nav class="demo demo-toolbar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="Demo.Page.toggleSources();" href="javascript://切换显示或隐藏全部源码">折叠代码</a> | <a onclick="Demo.Example.speedTestAll();" href="javascript://查看全部代码的执行效率">全部效率</a> | <a onclick="Demo.Example.runAll();" href="javascript://按顺序执行全部代码">全部执行</a></nav>';
		}

		for (key in examples) {
			id = globalExamples.length;
			example = examples[key];

			if (example === '-') {
				text = null;
				func = key;
				html += '<h3 class="demo">' + Demo.Utils.encodeHTML(key) + '</h3>';
			} else {

				if (typeof example === 'function') {
					func = example;
					text = Demo.Utils.getFunctionSource(example);
				} else{
					if(Demo.Beautify) {
						text = Demo.Beautify.js(example);
					} else {
						text = Demo.Utils.getFunctionSource(new Function(example));
					}
					func = null;
				}

				html += '<section onmouseover="this.firstChild.style.display=\'block\'" onmouseout="this.firstChild.style.display=\'none\'"><nav class="demo demo-toolbar" style="display: none"><a onclick="Demo.Example.speedTest(' + id + '); return false;" href="javascript://测试代码执行的效率">效率</a> | <a onclick="Demo.Example.run(' + id + '); return false;" href="javascript://执行函数">执行</a></nav><h4 class="demo" id="demo-example-' + id + '">' + Demo.Utils.encodeHTML(key) + '</h4><pre class="demo demo-sourcecode sh-js sh">' + Demo.Utils.encodeHTML(text) + '</pre></section>';

			}

			globalExamples[id] = [text, func];
		}

		document.write(html);
	};

	Demo.Page.init();

    //#endregion

} else {

    //#region 后台部分

    Demo.basePath = require('path').resolve(__dirname, '../../') + require('path').sep;

	// 导出 Demo 模块。
    module.exports = Demo;

    //#endregion

}

//#region trace

/**
 * Print variables to console.
 * @param {Object} ... The variable list to print.
 */
function trace() {

    if (!trace.disable) {

        // If no argument exisits. Fill argument as (trace: id).
        // For usages like: callback = trace;
        if (arguments.length === 0) {
            if (!trace.$count)
                trace.$count = 0;
            return trace('(trace: ' + (trace.$count++) + ')');
        }

        // Use console if available.
        if (window.console) {

            // Check console.debug
            if (console.debug && console.debug.apply) {
                return console.debug.apply(console, arguments);
            }

            // Check console.log
            if (console.log && console.log.apply) {
                return console.log.apply(console, arguments);
            }

            // console.log.apply is undefined in IE 7-8.
            if (console.log) {
                return console.log(arguments.length > 1 ? arguments : arguments[0]);
            }

        }

        // Fallback to call trace.write, which calls window.alert by default.
        return trace.write.apply(trace, arguments);

    }
}

trace.disable = false;

/**
 * Display all variables to user. 
 * @param {Object} ... The variable list to print.
 * @remark Differs from trace(), trace.write() preferred to using window.alert. 
 * Overwrite it to disable window.alert.
 */
trace.write = function () {

    var r = [], i = arguments.length;

    // dump all arguments.
    while (i--) {
        r[i] = trace.dump(arguments[i]);
    }

    window.alert(r.join(' '));
};

/**
 * Convert any objects to readable string. Same as var_dump() in PHP.
 * @param {Object} obj The variable to dump.
 * @param {Number} deep=3 The maximum count of recursion.
 * @return String The dumped string.
 */
trace.dump = function (obj, deep, showArrayPlain) {

    if (deep == null)
        deep = 3;
    switch (typeof obj) {
        case "function":
            // 函数
            return deep >= 3 ? obj.toString().replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
                return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
            }) : "function()";

        case "object":
            if (obj == null)
                return "null";
            if (deep < 0)
                return obj.toString();

            if (typeof obj.length === "number") {
                var r = [];
                for (var i = 0; i < obj.length; i++) {
                    r.push(trace.inspect(obj[i], ++deep));
                }
                return showArrayPlain ? r.join("   ") : ("[" + r.join(", ") + "]");
            } else {
                if (obj.setInterval && obj.resizeTo)
                    return "window#" + obj.document.URL;
                if (obj.nodeType) {
                    if (obj.nodeType == 9)
                        return 'document ' + obj.URL;
                    if (obj.tagName) {
                        var tagName = obj.tagName.toLowerCase(), r = tagName;
                        if (obj.id) {
                            r += "#" + obj.id;
                            if (obj.className)
                                r += "." + obj.className;
                        } else if (obj.outerHTML)
                            r = obj.outerHTML;
                        else {
                            if (obj.className)
                                r += " class=\"." + obj.className + "\"";
                            r = "<" + r + ">" + obj.innerHTML + "</" + tagName + ">  ";
                        }

                        return r;
                    }

                    return '[Node type=' + obj.nodeType + ' name=' + obj.nodeName + ' value=' + obj.nodeValue + ']';
                }
                var r = "{\r\n", i, flag = 0;
                for (i in obj) {
                    if (typeof obj[i] !== 'function')
                        r += "\t" + i + " = " + trace.inspect(obj[i], deep - 1) + "\r\n";
                    else {
                        flag++;
                    }
                }

                if (flag) {
                    r += '\t... (' + flag + ' more)\r\n';
                }

                r += "}";
                return r;
            }
        case "string":
            return deep >= 3 ? obj : '"' + obj + '"';
        case "undefined":
            return "undefined";
        default:
            return obj.toString();
    }
};

/**
 * Print a log to console.
 * @param {String} message The message to print.
 * @type Function
 */
trace.log = function (message) {
    if (!trace.disable && window.console && console.log) {
        return console.log(message);
    }
};

/**
 * Print a error to console.
 * @param {String} message The message to print.
 */
trace.error = function (message) {
    if (!trace.disable) {
        if (window.console && console.error)
            return console.error(message); // This is a known error which is caused by mismatched argument in most time.
        else
            throw message; // This is a known error which is caused by mismatched argument in most time.
    }
};

/**
 * Print a warning to console.
 * @param {String} message The message to print.
 */
trace.warn = function (message) {
    if (!trace.disable) {
        return window.console && console.warn ? console.warn(message) : trace("[WARNING]", message);
    }
};

/**
 * Print a inforation to console.
 * @param {String} message The message to print.
 */
trace.info = function (message) {
    if (!trace.disable) {
        return window.console && console.info ? console.info(message) : trace("[INFO]", message);
    }
};

/**
 * Print all members of specified variable.
 * @param {Object} obj The varaiable to dir.
 */
trace.dir = function (obj) {
    if (!trace.disable) {
        if (window.console && console.dir)
            return console.dir(obj);
        else if (obj) {
            var r = "", i;
            for (i in obj)
                r += i + " = " + trace.inspect(obj[i], 1) + "\r\n";
            return trace(r);
        }
    }
};

/**
 * Try to clear console.
 */
trace.clear = function () {
    if (window.console && console.clear)
        return console.clear();
};

/**
 * Test the efficiency of specified function.
 * @param {Function} fn The function to test, which will be executed more than 10 times.
 */
trace.time = function (fn) {

    if (typeof fn === 'string') {
        fn = new Function(fn);
    }

    var time = 0,
        currentTime,
        start = +new Date(),
        past;

    try {

        do {

            time += 10;

            currentTime = 10;
            while (--currentTime > 0) {
                fn();
            }

            past = +new Date() - start;

        } while (past < 100);

    } catch (e) {
        return trace.error(e);
    }
    return trace.info("[TIME] " + past / time);
};

//#endregion
