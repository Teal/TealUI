
var UI = {

    writeModuleList: function (filter) {

        if (Demo.local)
            UI._showRefreshButton();

        var list = ModuleList.examples,
            tree = UI._listToTree(list, filter),
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
            html += '<nav class="demo demo-toolbar" style="margin-top:-40px;" id="addmodule">' + UI._addModuleTpl + '</nav>';

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

    },

    _showRefreshButton: function () {
        var toolbar = Dom.get('demo-toolbar').lastChild.lastChild;

        toolbar.href = Demo.Configs.serverBaseUrl + Demo.Configs.apps + '/node/modulemanager/server/api.njs?action=updatelist&postback=' + encodeURIComponent(location.href);
        toolbar.innerHTML = '刷新列表';
        toolbar.title = '刷新模块列表缓存';
        toolbar.title = '刷新模块列表缓存';
    },

    _addModuleTpl: '<a href="javascript://创建一个新的模块" onclick="UI.addModule()">✚ 创建模块</a>',

    _listToTree: function (list, filter) {

        var tree = {

        }, path, category, slash, version, data, versions = {};

        for (path in list) {

            slash = path.lastIndexOf('/');

            // 删除扩展名。
            category = slash < 0 ? '全局' : path.substr(0, slash);
            fileNameWithoutExtension = (slash < 0 ? path : path.substr(slash + 1)).replace(/\.\w+$/, "");

            version = 0;

            // 检测是否存在版本号。
            fileNameWithoutExtension = fileNameWithoutExtension.replace(/\-([\d\.]+)$/, function (_, v) {

                // 如果列表自带了版本信息，则优先使用文件名内部的版本信息。
                if (list[path].version) {
                    v = list[path].version;
                } else {
                    list[path].version = v;
                }

                if (!versions[path]) {
                    versions[path] = version = UI._versionToValue(v);
                }

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
            } else if (version && !(versions[data[fileNameWithoutExtension]] > version)) {
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
    },

    _versionToValue: function (version) {
        
        version =version.split('.');
        for (var i = 0 ; i < version.length; i++) {
            version[i] = 1000 + version[i];
        }
        return version.join('.');
    },

    submitForm: function (redirectTo) {
        var form = Dom.get('addmodule').firstChild;
        var pathInput = Dom.find('[name=path]', form);
        
        if(!pathInput.value) {
            Dom.addClass(pathInput, 'x-textbox-error');
            return;
        }

        Dom.removeClass(pathInput, 'x-textbox-error');

        Dom.find('[name=postback]', form).value = redirectTo ? "" : location.href;

        form.submit();

    },

    cancelAddModule: function () {
        Dom.get('addmodule').innerHTML = UI._addModuleTpl;
    },

    addModule: function () {

        var form = Dom.get('addmodule');

        form.innerHTML = '<form action="' + Demo.Configs.serverBaseUrl + Demo.Configs.apps + '/node/modulemanager/server/api.njs" method="GET"><input type="hidden" name="postback" value=""><input type="text" name="path" class="x-textbox modulepath" placeholder="输入模块路径" title="模块路径将作为模块的唯一标识符，模块路径不得尾缀扩展名，区分大小写"> <input type="text" name="title" class="x-textbox moduletitle" placeholder="(可选)输入模块名称" title="用于在模块示例页显示的模块名称"> <select class="x-textbox" name="tpl" title="创建新模块使用的模板"><option value="jscss">js+css模块</option><option value="js">js模块</option><option value="css">css模块</option><option value="docs">空模块</option></select><input type="hidden" name="action" value="create"> <input type="button" class="x-button x-button-info" value="创建并转到" onclick="UI.submitForm(true)" title="创建模块，并且转到新创建的模块示例页面"> <input type="button" class="x-button" value="创建" onclick="UI.submitForm(false)" title="创建模块，并且刷新本模块列表页"> <input type="button" class="x-button" value="返回" onclick="UI.cancelAddModule()"></form>';

        var suggest = new Suggest(Dom.find('[name=path]', form));
	
        suggest.getSuggestItems = function (text) {

            var r = [];

            UI._tree = UI._tree || UI._listToTree(ModuleList.src);

            if (!text) {
                for (var category in UI._tree) {
                    r.push(category + "/");
                }
            } else {
                var part = /^(.*)\/(.*)$/.exec(text) || [text, text, ""];
                
                if (part[1] in UI._tree) {
                    for (var name in UI._tree[part[1]]) {
                        if (name.indexOf(part[2]) === 0) {
                            r.push("<strong>" + part[1] + "/" + part[2] + "</strong>" + name.substr(part[2].length));
                        }
                    }
                } else {
                    for (var category in UI._tree) {
                        if (category.indexOf(text) === 0) {
                            r.push("<strong>" + text + "</strong>" + category.substr(text.length) + "/");
                        }
                    }
                }

            }

            return r;
        };

        suggest.elem.focus();

    }

};
