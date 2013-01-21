

var DplBuilder = {

	current: null,

    addDpl: function () {
        var type = Dom.find('.newDpl select').getText();
        var path = Dom.find('.newDpl input.x-textbox').getText();

        if (path) {

            for (var i = 0; i < DplFile.dpls.length; i++) {
                if (DplFile.dpls[i].type === type && DplFile.dpls[i].path === path) {
                    if (confirm('组件 ' + path + ' 已存在于列表中，是否重复添加?') === false) {
                        return;
                    } else {
                        break;
                    }
                }
            }

            DplFile.dpls.push({ type: type, path: path });
            this.updateDpls();
        } else {
            Dom.find('.newDpl input.x-textbox').addClass('x-textbox-error');
        }
    },

    clearList: function () {
        if (confirm('确定清空列表吗?')) {
        	DplBuilder.current.list.length = 0;
            this.updateDpls();
        }
    },

    updateList: function () {

    	var list = DplBuilder.current.list;
    	var form = Dom.find('.dpls');

    	var html = '';

    	if (t.length) {
    		html += '<div class="demo demo-toolbar"><a onclick="DplBuilder.clearList();" href="javascript://按顺序执行全部测试用例">清空列表</a></div>';
    	}

    	for (var i = 0; i < list.length; i++) {
    		var dpl = list[i];

    		html += '<div class="demo-tip" onmouseover="this.className += \' demo-tip-hover\'" onmouseout="this.className = this.className.replace(\' demo-tip-hover\', \'\');"><nav class="demo demo-toolbar"><a href="javascript://查看关联的源文件" onclick="DplBuilder.viewSource(this, \'' + dpl.extension + '\', \'' + dpl.path + '\');return false;">源文件</a> | <a href="javascript://查看当前模块引用的项" onclick="DplBuilder.viewRefs(this, \'' + dpl.extension + '\', \'' + dpl.path + '\');return false;">查看引用</a>';

    		if (i > 0)
    			html += ' | <a class="demo-viewsource-toggle" href="javascript://上移生成的位置" onclick="DplBuilder.moveDpl(' + i + ', false); return false;">上移</a>';

    		if (i < t.length - 1)
    			html += ' | <a class="demo-viewsource-toggle" href="javascript://下移生成的位置" onclick="DplBuilder.moveDpl(' + i + ', true);">下移</a>';

    		html += ' | <a class="demo-viewsource-toggle" href="javascript://删除对当前模块的引用" onclick="DplBuilder.deleteDpl(' + i + '); return false;">删除</a></nav><a class="demo demo-mono" target="_blank" href="' + Demo.basePath + Demo.Configs.src + dpl.path + '">';

    		if (dpl.type == "exclude") {
    			html += '<del>[排除]' + dpl.path + '</del>';
    		} else {
    			html += dpl.path;
    		}

    		html += '</a>						    </div>';
    	}

    	html += '<div class="newDpl"><select class="x-textbox"><option value="using" title="完全引入一个组件及其依赖项">引用</option><option value="imports" title="仅引入一个组件的样式及其依赖样式">仅样式</option><option value="include" title="仅引入一个组件的样式及其依赖样式">仅脚本</option><option value="-using" title="排除一个组件的样式和脚本">排除</option><option value="-imports" title="排除一个组件的样式">排除样式</option><option value="-include" title="排除一个组件的脚本">排除脚本</option></select>  <input type="text" class="x-textbox" placeholder="输入组件路径">  <a href="javascript://添加一个组件" class="x-button x-button-success" onclick="DplBuilder.addDpl()">添加</a></div>';

    	form.setHtml(html);

    	initData && initData();

    	new PathSuggest(Dom.find('.newDpl input.x-textbox'));

    },

    openBuildFile: function (url) {
    	url = url || Dom.find('[name=path]').getText();


    	window.__bpm = {
    		js: 'aaaa',
    		css: 'gsdfsdf',
    		images: 'fsadasdsadasd',
    		list: [
				{ type: 'include', path: 'core/base.js' },
				{ type: 'include', path: 'dom/base.js' }
    		]
    	};

    	DplBuilder.loadBuildFile(window.__bpm);

    },

    /**
	 * 将界面上的 BuildFile 对象应用到 UI信息。
	 */
    loadBuildFile: function (configs) {

        var form = Dom.find('.props');

      //  Dom.find('[name=path]').setText(configs.path);
        form.find('[name=js]').setText(configs.js || '');
        form.find('[name=css]').setText(configs.css);
        form.find('[name=images]').setText(configs.images);
        form.find('[name=removeTrace]').setAttr('checked', configs.removeTrace);
        form.find('[name=removeAssert]').setAttr('checked', configs.removeAssert);
        form.find('[name=removeConsole]').setAttr('checked', configs.removeConsole);
        form.find('[name=addHeader]').setAttr('checked', configs.addModulePath);
        form.find('[name=resolveRefs]').setAttr('checked', configs.resolveRefs);

        this.updateList(configs.list);

        //var suggest = new Suggest(form.find('[name=js]'));
        //suggest.getSuggestItems = function (text) {
        //    var r = [];

        //    var fileName = form.find('[name=path]').getText();

        //    fileName = (/\\([^\\]*)\.dpl$/.exec(fileName) || [0, ""])[1];

        //    if (!text) {
        //        r.push(fileName + ".js");
        //    } else if (/\/$/.test(text)) {
        //        r.push(text + fileName + ".js");
        //        r.push(text + "assets/scripts/");
        //        r.push(text + "assets/scripts/" + fileName + ".js");
        //    } else if (!(/\.js/.test(text))) {
        //        if (/\.j?s?$/.test(text)) {
        //            r.push(text.replace(/\.j?s?$/, '.js'));
        //        } else {
        //            r.push(text + ".js");
        //        }
        //    } 

        //    return r;
        //};
        //var suggest = new Suggest(form.find('[name=css]'));
        //suggest.getSuggestItems = function (text) {
        //    var r = [];

        //    var fileName = form.find('[name=path]').getText();

        //    fileName = (/\\([^\\]*)\.dpl$/.exec(fileName) || [0, ""])[1];

        //    if (!text) {
        //        r.push(fileName + ".css");
        //    } else if (/\/$/.test(text)) {
        //        r.push(text + "assets/styles/");
        //    } else if (!(/\.css$/.test(text))) {
        //        if (/\.c?s?s?$/.test(text)) {
        //            r.push(text.replace(/\.c?s?s?$/, '.css'));
        //        } else {
        //            r.push(text + ".css");
        //        }
        //    } else {
        //        return r;
        //    }

        //    var js = form.find('[name=js]').getText();
        //    if (js) {
        //        r.push(js.replace('scripts/', 'styles/').replace('js/', 'css/').replace('.js', '.css'));
        //    }

        //    return r;
        //};
        //var suggest = new Suggest(form.find('[name=images]'));
        //suggest.getSuggestItems = function (text) {
        //    var r = [];

        //    var js = form.find('[name=css]').getText();
        //    if (js) {
        //        if (js.indexOf('/') >= 0)
        //            r.push(js.replace(/\/[^\/]+$/, "/images"));
        //        else
        //            r.push("images");

        //        if (js.indexOf('styles') >= 0) {
        //            r.push(js.replace(/\/[^\/]+$/, "").replace('styles', 'images'));
        //        }

        //    }

        //    return r;
        //};

    },

    /**
	 * 将界面上的UI信息收集起来，放入 BuildFile 对象。
	 */
    saveBuildFile: function (configs) {

        var form = Dom.find('.props');

        //configs.path = form.find('[name=path]').getText();
        //t.properties.base = form.find('[name=base]').getText();
        //t.properties.title = form.find('[name=title]').getText();
        configs.js = form.find('[name=js]').getText();
        configs.css = form.find('[name=css]').getText();
        configs.images = form.find('[name=images]').getText();

        //t.requires = form.find('[name=requires]').getText().trim();
        //t.requires = t.requires ? t.requires.split(/\s*;\s*/) : [];

        //t.properties.parseMacro = form.find('[name=parseMacro]').getAttr('checked');
        //t.properties.defines = form.find('[name=defines]').getText();
        configs.removeTrace = form.find('[name=removeTrace]').getAttr('checked');
        configs.removeAssert = form.find('[name=removeAssert]').getAttr('checked');
        configs.removeConsole = form.find('[name=removeConsole]').getAttr('checked');
        configs.addHeader = form.find('[name=addHeader]').getAttr('checked');
        configs.resolveRefs = form.find('[name=resolveRefs]').getAttr('checked');

    },

    moveDpl: function (id, down) {
        var oldId = down ? (id + 1) : (id - 1);

        if (oldId < 0 || oldId >= DplFile.dpls.length) {
            return;
        }

        var old = DplFile.dpls[oldId];
        DplFile.dpls[oldId] = DplFile.dpls[id];

        DplFile.dpls[id] = old;


        this.updateDpls();

    },

    deleteDpl: function (id) {
        DplFile.dpls.splice(id, 1);
        this.updateDpls();
    },

    viewSource: function (node, type, path) {
        var div = Dom.get(node.parentNode.parentNode);

        var source = div.next('.source');

        if (source) {
            source.toggle();
            return;
        }
		
        source = div.next().next('.source');

        if (source) {
            source.toggle();
            return;
        }

        Demo.jsonp(Demo.Configs.apiPath + 'dplfilemanager.njs', {
            action: 'getsource',
            path: path,
            type: ({
                'using': '',
                'imports': 'css',
                'include': 'js',
                '-using': '',
                '-imports': 'css',
                '-include': 'js'
            })[type] || ''
        }, function (data) {

            source = div.after('<ul class="source x-bubble"></ul>');


            var html = '';

            for (var path in data) {
                html += '<li><a href="' + Demo.Configs.rootUrl + Demo.Configs.src + '/' + path + '" class="x-hint" target="_blank">' + Demo.Text.encodeHTML(data[path]) + '</a></li>';
            }

            source.setHtml(html || '<li>(无源码)</li>');

        });

    },

    viewRefs: function (node, type, path) {
        var div = Dom.get(node.parentNode.parentNode);
        
        var source = div.next('.refs');

        if (source) {
            source.toggle();
            return;
        }
        
        source = div.next().next('.refs');

        if (source) {
            source.toggle();
            return;
        }

        Demo.jsonp(Demo.Configs.apiPath + 'dplfilemanager.njs', {
            action: 'getrefs',
            path: path,
            type: ({
                'using': '',
                'imports': 'css',
                'include': 'js',
                '-using': '',
                '-imports': 'css',
                '-include': 'js'
            })[type] || ''
        }, function (data) {

            source = div.after('<ul class="refs"></ul>');

            var html = '';

            for (var path in data) {

                var type = data[path] ? data[path] == 'js' ? 'include' : 'imports' : 'using';

                var prefix = data[path] ? data[path] == 'js' ? '[脚本]' : '[样式]' : '';

                html += '<li><div class="demo-tip" onmouseover="this.className += \' demo-tip-hover\'" onmouseout="this.className = this.className.replace(\' demo-tip-hover\', \'\');"><span class="demo-toolbar"><a class="demo" href="javascript://查看关联的源文件" onclick="DplBuilder.viewSource(this, \'' + type + '\', \'' + path + '\');return false;">源文件</a> | <a class="demo" href="javascript://查看当前模块引用的项" onclick="DplBuilder.viewRefs(this, \'' + type + '\', \'' + path + '\');return false;">查看引用</a></span><a class="demo demo-mono" href="' + Demo.getDemoUrl(path) + '">' + prefix + path + '</a></div></li>';

            }

            source.setHtml(html || '<li>(无引用)</li>');

        });
    },

    submitData: function (action, target) {
        this.saveDplFile();
        Demo.submit(Demo.Configs.apiPath + 'dplbuilder.njs?action=' + action + '&file=' + DplFile.path + '&postback=' + encodeURIComponent(Demo.Configs.rootUrl + "assets/dpl/dplfilelist.html"), DplFile, target);
    },

    saveAndBuildFile: function () {
        this.submitData('savebuild');
    },

    saveFile: function () {
        this.submitData('save');
    },

    previewFile: function () {
        this.submitData('preview', '_blank');
    }

};

var PathSuggest = Suggest.extend({

    _getModules: function (module) {
        var r = [];

        if (module) {

            module = module.toLowerCase();

            for (var i in PathSuggest.tree) {
                if (i.toLowerCase().indexOf(module) !== -1)
                    r.push(i + '.');
            }

            for (var i in PathSuggest.list) {
                if (i.toLowerCase().indexOf(module) !== -1)
                    r.push(i);
            }

        } else {


            for (var i in PathSuggest.tree) {
                r.push(i + '.');
            }

        }

        return r;
    },

    _getCategories: function (module, categegory) {
        var c = PathSuggest.tree[module];

        var r = [];

        var p = module + '.';

        if (categegory) {

            categegory = categegory.toLowerCase();

            for (var i in c) {
                if (i.toLowerCase().indexOf(categegory) !== -1) {
                    r.push(p + i + '.');
                }
            }

        } else {

            for (var i in c) {
                r.push(p + i + '.');
            }

        }

        return r;
    },

    _getDplList: function (module, categegory, name) {
        var c = (PathSuggest.tree[module] || {})[categegory];

        var r = [];

        if (name) {

            name = name.toLowerCase();

            for (var i in c) {
                if (i.toLowerCase().indexOf(name) !== -1) {
                    r.push(c[i]);
                }
            }

        } else {

            for (var i in c) {
                r.push(c[i]);
            }

        }

        return r;
    },

    getSuggestItems: function (text) {

        text = text.trim();

        // 空的文本，获取模块列表。
        if (!text) {
            return this._getModules();
        }

        var split = Demo.splitPath(text);

        // 以点结尾，使用向导。
        if (/\.$/.test(text)) {
            if (split.category) {
                return this._getDplList(split.module, split.category, '');
            }

            return this._getCategories(split.module);
        }

        // 如果存在分类了。
        if (split.name) {
            return this._getDplList(split.module, split.category, split.name);
        }

        if (split.category) {
            return this._getCategories(split.module, split.category);
        }

        return this._getModules(split.module);
    },

    /**
     * 模拟用户选择一项。
     */
    selectItem: function (item) {
        if (item) {
            this.setText(item.getText());
        }
        return this.showDropDown();
    }

});

PathSuggest.list = PathSuggest.tree = {};

function initData() {

    Demo.jsonp(Demo.Configs.apiPath + 'dplmanager.njs', {
        action: 'getlist',
        type: 'src'
    }, function (DplList) {
        PathSuggest.list = DplList;
        PathSuggest.tree = Demo.listToTree(DplList);
    });

    initData = null;
}
