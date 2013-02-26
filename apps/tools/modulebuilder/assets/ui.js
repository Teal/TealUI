
var UI = {

    currentStep: 1,

    usingXFly: false,

    init: function () {
        Dom.query('.panel').hide();
        Dom.show(Dom.get('step1'));
    },

    step: function (id) {

        // 从左到右渐变。
        if (UI.currentStep < id) {
            Dom.show(Dom.get('step' + id));
            Dom.animate(Dom.get('container'), { marginLeft: '0--' + Dom.get('step' + UI.currentStep).offsetWidth }, -1, function () {
                Dom.get('container').style.marginLeft = 0;
                Dom.hide(Dom.get('step' + UI.currentStep));
                UI.currentStep = id;
            });
        } else if (UI.currentStep > id) {
            Dom.show(Dom.get('step' + id));
            Dom.animate(Dom.get('container'), { marginLeft: '-' + Dom.get('step' + UI.currentStep).offsetWidth + '-0' }, -1, function () {
                Dom.hide(Dom.get('step' + UI.currentStep));
                UI.currentStep = id;
            });
        }
    },

    createNewBuildFile: function () {
        if (UI.currentBuildFile && UI.currentBuildFile.isNew) {
            UI.step(3);
            return;
        }

        UI.currentBuildFile = new BuildFile();
        UI.currentBuildFile.isNew = true;
        UI.showBuildFile();
        UI.step(3);
    },

    showModuleList: function () {
        var buildFile = UI.currentBuildFile;
        var html = '';

        add("includes", "", "");
        add("excludes", "<del>", "</del>");

        function add(includeOrExclude, prefix, postfix) {
            
            for (var i = 0, all = buildFile[includeOrExclude]; i < all.length; i++) {
                html += '<div class="line" onmouseover="this.className += \' line-hover\'" onmouseout="this.className = this.className.replace(\' line-hover\', \'\');"><nav class="demo demo-toolbar"><a onclick="UI.viewSource(this, \'' + all[i] + '\');return false;" href="javascript://查看当前模块对应的源文件">源文件</a> | <a onclick="UI.viewRequires(this, \'' + all[i] + '\');return false;" href="javascript://查看当前模块依赖的模块">查看引用</a>';
                
                if (i > 0)
                    html += ' | <a href="javascript://上移生成的位置" onclick="UI.moveModule(\'' + includeOrExclude + '\', ' + i + ', false); return false;">上移</a>';

                if (i < all.length - 1)
                    html += ' | <a href="javascript://下移生成的位置" onclick="UI.moveModule(\'' + includeOrExclude + '\', ' + i + ', true);">下移</a>';


                html += ' | <a onclick="UI.deleteModule(\'' + includeOrExclude + '\', ' + i + '); return false;" href="javascript://删除此行">删除</a></nav>';
                html += '<a class="link link-url" href="' + getModuleExampleUrl(all[i]) + '" target="_blank">' + prefix + all[i] + postfix + '</a></div>';
            }

        }

        Dom.get('step3_modulelist').innerHTML = html;
        Dom.get('step_clearModules').style.display = html ? '' : 'none';

    },

    showBuildFile: function () {
        
        UI.showModuleList();

        var buildFile = UI.currentBuildFile;

        Dom.get('step3_compress').checked = buildFile.compress;
        Dom.get('step3_removeAssert').checked = buildFile.removeAssert;
        Dom.get('step3_removeConsole').checked = buildFile.removeConsole;

        Dom.get('step3_buildfile').value = buildFile.path;
        Dom.get('step3_js').value = buildFile.js;
        Dom.get('step3_css').value = buildFile.css;
        Dom.get('step3_images').value = buildFile.images;
        Dom.get('step3_src').value = buildFile.src;
        Dom.get('step3_dependencySyntax').value = buildFile.dependencySyntax;
        Dom.get('step3_uniqueBuildFiles').value = buildFile.uniqueBuildFiles;
        Dom.get('step3_parseMacro').checked = buildFile.parseMacro;
        Dom.get('step3_defines').value = buildFile.defines;
        Dom.get('step3_prependComments').value = buildFile.prependComments;
        Dom.get('step3_prependModuleComments').value = buildFile.prependModuleComments;

    },

    updateBuildFile: function () {
        var buildFile = UI.currentBuildFile;

        buildFile.basePath = Demo.baseUrl + Demo.Configs.src;
    },

    addModule: function (showErrorMessage) {

        var value = Dom.get('step3_module').value;

        Dom.removeClass(Dom.get('step3_module'), 'ui-textbox-error');
        if (!value) {
            if (showErrorMessage !== false) {
                Dom.addClass(Dom.get('step3_module'), 'ui-textbox-error');
            }

            return;
        }

        if (UI.currentBuildFile.includes.indexOf(value) >= 0) {
            if (confirm('模块 ' + value + ' 已在列表中，是否重复添加?') === false) {
                return;
            }
        }

        if (UI.currentBuildFile.excludes.indexOf(value) >= 0) {
            if (confirm('模块 ' + value + ' 已被排除，是否取消排除并添加?') === false) {
                return;
            }

            UI.currentBuildFile.excludes.remove(value);
        }

        UI.currentBuildFile.includes.push(value);

        UI.showModuleList();

        Dom.get('step3_module').value = '';

    },

    removeModule: function (showErrorMessage) {

        var value = Dom.get('step3_module').value;

        Dom.removeClass(Dom.get('step3_module'), 'ui-textbox-error');
        if (!value) {
            Dom.addClass(Dom.get('step3_module'), 'ui-textbox-error');

            return;
        }
        if (!value) {
            if (showErrorMessage !== false) {
                Dom.addClass(Dom.get('step3_module'), 'ui-textbox-error');
            }

            return;
        }

        if (UI.currentBuildFile.includes.indexOf(value) >= 0) {
            if (confirm('模块 ' + value + ' 已在列表中，是否排除?') === false) {
                return;
            }
        }

        if (UI.currentBuildFile.excludes.indexOf(value) >= 0) {
            alert('模块 ' + value + ' 已被排除');
            return;
        }

        UI.currentBuildFile.excludes.push(value);

        UI.showModuleList();

        Dom.get('step3_module').value = '';

    },

    clearModules: function () {
        if (confirm('确定清空列表吗?')) {
            UI.currentBuildFile.includes.length = UI.currentBuildFile.excludes.length = 0;
            UI.showModuleList();
        }
    },

    moveModule: function (includeOrExclude, id, down) {
        var oldId = down ? (id + 1) : (id - 1);
        if (oldId < 0 || oldId >= UI.currentBuildFile[includeOrExclude].length) {
            return;
        }
        var old = UI.currentBuildFile[includeOrExclude][oldId];
        UI.currentBuildFile[includeOrExclude][oldId] = UI.currentBuildFile[includeOrExclude][id];
        UI.currentBuildFile[includeOrExclude][id] = old;

        UI.showModuleList();
    },

    deleteModule: function (includeOrExclude, id) {
        UI.currentBuildFile[includeOrExclude].splice(id, 1);

        UI.showModuleList();
    },

    viewSource: function (node, module) {
        var div = node.parentNode.parentNode;

        if (div.nextSlibing && Dom.hasClass(div.nextSlibing, 'source')) {
            Dom.toggle(div.nextSlibing);
            return;
        }

        if (div.nextSlibing && div.nextSlibing.tagName === 'UL' && div.nextSlibing.nextSlibing && Dom.hasClass(div.nextSlibing.nextSlibing, 'source')) {
            Dom.toggle(div.nextSlibing.nextSlibing);
            return;
        }

        ModuleBuilder.getSource(module, function (data) {
            div = Dom.after(div, '<ul class="source ui-bubble"></ul>');
            var html = '';
            for (var path in data) {
                html += '<li><a href="' + Demo.baseUrl + Demo.Configs.src + '/' + path + '" class="ui-hint" target="_blank">' + Demo.Utils.encodeHTML(data[path]) + '</a></li>';
            }
            div.innerHTML = html || '<li>(无源码)</li>';
        });

        //Demo.jsonp(Demo.Configs.apiPath + 'dplfilemanager.njs', {
        //    action: 'getsource',
        //    path: path,
        //    type: ({
        //        'using': '',
        //        'imports': 'css',
        //        'include': 'js',
        //        '-using': '',
        //        '-imports': 'css',
        //        '-include': 'js'
        //    })[type] || ''
        //}, function (data) {
        //    source = div.after('<ul class="source ui-bubble"></ul>');
        //    var html = '';

        //});
    },

    viewRequires: function (node, module) {
        var div = node.parentNode.parentNode;

        if (div.nextSlibing && Dom.hasClass(div.nextSlibing, 'refs')) {
            Dom.toggle(div.nextSlibing);
            return;
        }

        if (div.nextSlibing && div.nextSlibing.tagName === 'UL' && div.nextSlibing.nextSlibing && Dom.hasClass(div.nextSlibing.nextSlibing, 'refs')) {
            Dom.toggle(div.nextSlibing.nextSlibing);
            return;
        }

        ModuleBuilder.getRequires(module, function (data) {
            div = Dom.after(div, '<ul class="refs"></ul>');
            var html = '';
            for (var path in data) {
                html += '<li><div class="line" onmouseover="this.className += \' line-hover\'" onmouseout="this.className = this.className.replace(\' line-hover\', \'\');"><span class="demo-toolbar"><a class="demo" href="javascript://查看关联的源文件" onclick="DplBuilder.viewSource(this, \'' + path + '\');return false;">源文件</a> | <a class="demo" href="javascript://查看当前模块引用的项" onclick="DplBuilder.viewRequires(this, \'' + path + '\');return false;">查看引用</a></span><a class="link" href="' + getModuleExampleUrl(path) + '">' + path + '</a></div></li>';
            }
            div.innerHTML = html || '<li>(无引用)</li>';
        });


        //Demo.jsonp(Demo.Configs.apiPath + 'dplfilemanager.njs', {
        //    action: 'getrefs',
        //    path: path,
        //    type: ({
        //        'using': '',
        //        'imports': 'css',
        //        'include': 'js',
        //        '-using': '',
        //        '-imports': 'css',
        //        '-include': 'js'
        //    })[type] || ''
        //}, function (data) {
        //    source = div.after('<ul class="refs"></ul>');
        //    var html = '';
            
        //});


    },

    toggleMore: function () {
        var more = Dom.get('step3_advance');

        if (Dom.isHidden(more)) {
            Dom.show(more);
            Dom.get('step3_toggleMore').innerHTML = '<span class="toggle-arrow">▾</span> 折叠更多选项';
        } else {
            Dom.hide(more);
            Dom.get('step3_toggleMore').innerHTML = '<span class="toggle-arrow">▸</span> 展开更多选项';
        }
    },

    build: function () {


        UI.addModule(false);

        UI.updateBuildFile();
        UI.step(4);

        Dom.hide(Dom.get('step4_done'));

        ModuleBuilder.build({

            file:  UI.currentBuildFile,

            log: function (info) {
                console.info(info);
                Dom.get('step4_tip').innerHTML = Demo.Utils.encodeHTML(info);
            },

            //error: function (error) {
            //    Dom.get('step4_error').innerHTML += Demo.Utils.encodeHTML(error);
            //},

            complete: function () {
                a = this
                Dom.show(Dom.get('step4_done'));

                var jsStream = new StringStream();
                var cssStream = new StringStream();

                this.writeJs(jsStream);
                this.writeCss(cssStream);

                jsStream.end();
                cssStream.end();

                setValue('step4_js', jsStream.toString());
				
                setValue('step4_css', cssStream.toString());

                var imagesFrom = [];
                var imagesTo = [];

                for (var images in this.assets) {
                	imagesFrom.push(this.assets[images].from);
                	imagesTo.push(this.assets[images].relative);
                }

                setValue('step4_imagesFrom', imagesFrom.join('\r\n'));

                setValue('step4_imagesTo', imagesTo.join('\r\n'));

                this.log("打包成功 !");

                function setValue(id, value) {
                	Dom.get(id).value = value;
                	Dom.get(id).style.display = Dom.prev(Dom.get(id)).style.display = value ? '' : 'none';
                }
            }
        });

    }

};

function getModuleExampleUrl(module) {
    return Demo.baseUrl + Demo.Configs.examples + module;
}

Dom.ready(UI.init);
