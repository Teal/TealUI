
var UI = {

	//#region 公共

	// 当前页面。
	currentStep: 1,

	// 当前在编辑的打包方案文件。
	currentBuildFile: null,

	// 是否使用 xfly 进行操作，而不是在客户端处理。
	usingXFly: true,

	// 模块提示用的数据。
	_suggestData: null,

	// 初始化全部逻辑。
	init: function () {

		// 只显示第一个面板。
		Dom.query('.panel').hide();
		Dom.show(Dom.get('step' + UI.currentStep));
		UI.step(1);

		ModuleBuilder.moduleBasePath = Demo.baseUrl + Demo.Configs.src;

	},

	// 切换到不同的页面。
	step: function (value) {

		var me = this;

		// 根据不同的步骤进行初始化。
		switch (value) {
			case 1:

				// 如果使用 xfly, 先测试是否可以正常地连接到服务器。
				if (UI.usingXFly) {

					// 等待服务器正常回调后，设置值为 true。
					UI.usingXFly = false;
					Ajax.jsonp(Demo.Configs.serverBaseUrl + Demo.Configs.apps + "/node/modulebuilder/server/api.njs?action=recentbuildfiles", function (data) {
						UI.usingXFly = true;
						me._showBuildFileListHtml('step1_buildfilelist', '已保存的打包方案', data);
					});
				}

				break;

			case 2:

				// 显示打开历史。
				var data = window.localStorage && localStorage.moduleBuilderOpenList;

				me._showBuildFileListHtml('step2_buildfilelist', '最近的打包方案', data && data.split(';'), true);

				break;

			case 3:
				UI._showBuildFile();

				// 初始化 UI 界面。
				if (!UI._suggestData) {

					var r = UI._suggestData = {};

					for (var key in ModuleList.src) {

						var type = ModuleList.src[key];

						if (type === ".js") {
							key = key.substr(0, key.length - 3);
						} else if (type === ".css") {
							key = key.substr(0, key.length - 4);
						} else {
							continue;
						}

						if (r[key]) {
							r[key] = ".js+.css";
						} else {
							r[key] = type;
						}
					}

					var suggest = new Suggest(Dom.get('step3_module'));

					suggest.getSuggestItems = function (text) {
						var r = [];

						if (!text) {
						    for (var key in UI._suggestData) {
						        if (UI.currentBuildFile.includes.indexOf(key) < 0 && UI.currentBuildFile.excludes.indexOf(key)) {
						            r.push(key);
						        }
							}
						} else if (/\.$/.test(text)) {
							r.push(text.substr(0, text.length - 1), text + "js", text + "css");
						} else {
						    for (var key in UI._suggestData) {
						        if (UI.currentBuildFile.includes.indexOf(key) < 0 && UI.currentBuildFile.excludes.indexOf(key)) {
						            if (key.indexOf(text) === 0) {
						                r.push("<strong>" + text + "</strong>" + key.substr(text.length));
						            } else if (key.indexOf("/" + text) >= 0) {
						                r.push(key.replace("/" + text, "/<strong>" + text + "</strong>"));
						            }
						        }
							}
						}

						return r;
					};


					Dom.keyNav(Dom.get('step3_module'), {
						enter: function () {
							if (suggest.isDropDownHidden()) {
								UI.addModule();
							}
						}
					});

				}

				break;

		}

		// 从左到右渐变。
		if (UI.currentStep < value) {
			Dom.show(Dom.get('step' + value));
			Dom.animate(Dom.get('container'), { marginLeft: '0--' + Dom.get('step' + UI.currentStep).offsetWidth }, -1, function () {
				Dom.get('container').style.marginLeft = 0;
				Dom.hide(Dom.get('step' + UI.currentStep));
				UI.currentStep = value;
			});
		} else if (UI.currentStep > value) {
			Dom.show(Dom.get('step' + value));
			Dom.animate(Dom.get('container'), { marginLeft: '-' + Dom.get('step' + UI.currentStep).offsetWidth + '-0' }, -1, function () {
				Dom.hide(Dom.get('step' + UI.currentStep));
				UI.currentStep = value;
			});
		}
	},

	// 根据模块列表生成 HTML 模板。
	_showBuildFileListHtml: function (id, title, data, fromOpenList) {

		id = Dom.get(id);

		if (data && data.length) {

			id.style.display = 'block';

			var r = ['<div class="hint">' + title + '  ────────────────────────────────────────────</div>'];

			for (var i = 0; i < data.length; i++) {

				var path = data[i],
                    name = path;

				if (!fromOpenList) {
					path = Demo.baseUrl + path;
					name = Path.basename(name, ".js");
				}

				path = path.replace(/\\/g, "/");


				r.push('<div class="line" onmouseover="this.className += \' line-hover\'" onmouseout="this.className = this.className.replace(\' line-hover\', \'\');"><nav class="demo demo-toolbar"><a href="javascript://打开此打包方案" onclick="UI.openBuildFile(\'' + path + '\',' + fromOpenList + ');return false;">打开</a> | <a class="demo-viewsource-toggle" href="javascript://删除此打包方案" onclick="UI.deleteBuildFile(\'' + path + '\',' + fromOpenList + '); return false;">删除</a> | <a href="javascript://复制此打包方案" onclick="UI.copyBuildFile(\'' + path + '\',' + fromOpenList + ');return false;">复制</a> |  <a class="demo-viewsource-toggle" href="javascript://根据此打包方案重新生成" onclick="UI.buildBuildFile(\'' + path + '\',' + fromOpenList + '); return false;">生成</a></nav><a class="link" href="javascript://打开此打包方案" onclick="UI.openBuildFile(\'' + path + '\',' + fromOpenList + ');return false;">' + name + '</a></div>');
			}

			id.innerHTML = r.join('');
		} else {
			id.style.display = 'none';

		}

	},

	//#endregion

	//#region 第一二步

	// 创建新的打包方案。
	createNewBuildFile: function () {

		// 如果之前已经新建过，则不再新建。
		if (UI.currentBuildFile && UI.currentBuildFile.isNew) {
			UI.step(3);
			return;
		}

		// 创建新的打包方案。
		UI.currentBuildFile = new BuildFile();
		UI.currentBuildFile.isNew = true;
		UI.step(3);
	},

	// 打开其他打包方案。
	openOtherBuildFile: function () {
		UI.step(2);
	},

	// 打开指定的打包方案。
	openBuildFile: function (buildFilePath) {
	    UI._loadBuildFile(buildFilePath, function (buildFile) {
			UI.currentBuildFile = buildFile;
			UI.step(3);
		});
	},

	// 删除指定的打包方案。
	deleteBuildFile: function (buildFilePath, fromOpenList) {

		if (fromOpenList) {



			var data = window.localStorage && localStorage.moduleBuilderOpenList;
			if (data = data && data.split(';')) {
				var p = data.indexOf(buildFilePath);
				if (p >= 0) {
					data.splice(p, 1);
				}

				localStorage.moduleBuilderOpenList = data.join(';');
				UI.step(2);
			}
		} else {

			if (!confirm("确认删除打包方案文件 " + buildFilePath + " 吗?"))
				return;

			UI._jsonpNode('deletebuildfile', {
				path: buildFilePath,
			}, function () {
				UI.step(1);
			});
		}
	},

	_loadBuildFile: function (buildFilePath, callback) {

        // 绝对路径，基于服务器打开。
	    if (buildFilePath.indexOf(':') >= 0 && buildFilePath.indexOf(location.protocol + '//' + location.host + '/') !== 0) {

	        if (!UI.usingXFly) {
	            UI._alertOpenXFlyError();
	        } else {
	            UI._jsonpNode('read', {
	                path: buildFilePath
	            }, function (content) {

	                var buildFile = new BuildFile();
	                buildFile.load(content);

	                buildFile.path = buildFilePath;
	                callback(buildFile);

	            });
	        }

	    } else {
	        ModuleBuilder.load(buildFilePath, callback);
	    }

	},

	// 复制指定的打包方案。
	copyBuildFile: function (buildFilePath) {
	    UI._loadBuildFile(buildFilePath, function (buildFile) {
			UI.currentBuildFile = buildFile;

			buildFile.js = buildFile.css = buildFile.assets = buildFile.path = "";

			UI.step(3);
		});
	},

	// 编译指定的打包方案。
	buildBuildFile: function (buildFilePath) {
	    UI._loadBuildFile(buildFilePath, function (buildFile) {
			UI.currentBuildFile = buildFile;
			UI._buildInternal();
		});
	},

	_alertOpenXFlyError: function () {
		if (navigator.userAgent.indexOf("Windows") >= 0) {
			alert("错误: 需要先启动本地代理服务器才能读写本地文件。\r\n启动方法: 双击打开\"[库根目录]/apps/startserver.cmd\", 并不要关闭窗口。");
		} else {
			alert("错误: 需要先启动本地代理服务器才能读写本地文件。\r\n启动方法: 请先安装 nodejs, 然后启动\"[库根目录]/apps/startserver。\"");
		}
	},

	_jsonpNode: function (action, data, callback) {
		Ajax.jsonp(Demo.Configs.serverBaseUrl + Demo.Configs.apps + "/node/modulebuilder/server/api.njs?action=" + action, data, callback, UI._alertOpenXFlyError);
	},

	// 打开新输入的打包方案。
	openBuildFileOf: function () {
		UI._openOrBuildBuildFileOf(UI.openBuildFile);
	},

	// 编译新输入的打包方案。
	buildBuildFileOf: function () {
		UI._openOrBuildBuildFileOf(UI.buildBuildFile);
	},

	_openOrBuildBuildFileOf: function (callback) {
		UI._checkValue('step2_url', function (buildFilePath) {

			if (/^\w+\//.test(buildFilePath)) {
				buildFilePath = "/" + buildFilePath;
			}

			if (window.localStorage) {
				var data = (localStorage.moduleBuilderOpenList || "").split(';');
				if (data.indexOf(buildFilePath) < 0) {
					data.push(buildFilePath);
					localStorage.moduleBuilderOpenList = data.join(';');
				}
			}

			callback(buildFilePath);
		});
	},

	_checkValue: function (id, callback) {
		id = Dom.get(id);
		
		var value = id.value.trim();

		if (value) {
			Dom.removeClass(id, 'x-textbox-error');
			callback(value);
		} else {
			Dom.addClass(Dom.get(id), 'x-textbox-error');
		}
	},

	//#endregion

	//#region 第三步

	_showBuildFile: function () {

		UI._showModuleList();

		var buildFile = UI.currentBuildFile;
		buildFile.path = buildFile.path.replace(Demo.baseUrl, "");

		Dom.get('step3_compress').checked = buildFile.compress;
		Dom.get('step3_addAssert').checked = buildFile.addAssert;

		Dom.get('step3_buildfile').value = buildFile.path;
		Dom.get('step3_js').value = buildFile.js;
		Dom.get('step3_css').value = buildFile.css;
		Dom.get('step3_assets').value = buildFile.assets;
		Dom.get('step3_dependencySyntax').value = buildFile.dependencySyntax;
		Dom.get('step3_uniqueBuildFiles').value = buildFile.uniqueBuildFiles;
		Dom.get('step3_parseMacro').checked = buildFile.parseMacro;
		Dom.get('step3_defines').value = buildFile.defines;
		Dom.get('step3_prependComments').value = buildFile.prependComments;
		Dom.get('step3_prependModuleComments').value = buildFile.prependModuleComments;

	},

	_showModuleList: function () {
		var buildFile = UI.currentBuildFile;
		var html = '';

		add("includes", "", "");
		add("excludes", "<del>", "</del>");

		Dom.get('step3_modulelist').innerHTML = html;
		Dom.get('step_clearModules').style.display = html ? '' : 'none';

		function add(includeOrExclude, prefix, postfix) {

			for (var i = 0, all = buildFile[includeOrExclude]; i < all.length; i++) {
				html += '<div class="line" onmouseover="this.className += \' line-hover\'" onmouseout="this.className = this.className.replace(\' line-hover\', \'\');"><nav class="demo demo-toolbar"><a onclick="UI.viewSource(this, \'' + all[i] + '\');return false;" href="javascript://查看当前模块对应的源文件">源文件</a> | <a onclick="UI.viewRequires(this, \'' + all[i] + '\');return false;" href="javascript://查看当前模块依赖的模块">查看依赖</a>';

				if (i > 0)
					html += ' | <a href="javascript://上移生成的位置" onclick="UI.moveModule(\'' + includeOrExclude + '\', ' + i + ', false); return false;">上移</a>';

				if (i < all.length - 1)
					html += ' | <a href="javascript://下移生成的位置" onclick="UI.moveModule(\'' + includeOrExclude + '\', ' + i + ', true);">下移</a>';


				html += ' | <a onclick="UI.deleteModule(\'' + includeOrExclude + '\', ' + i + '); return false;" href="javascript://删除此行">删除</a></nav>';
				html += '<a class="link link-url" href="' + UI._getModuleExampleUrl(all[i]) + '" target="_blank">' + prefix + all[i] + postfix + '</a></div>';
			}

		}

	},

	_updateBuildFile: function () {
		var buildFile = UI.currentBuildFile;

		buildFile.compress = Dom.get('step3_compress').checked;
		buildFile.addAssert = Dom.get('step3_addAssert').checked;

		buildFile.path = Dom.get('step3_buildfile').value;
		buildFile.js = Dom.get('step3_js').value;
		buildFile.css = Dom.get('step3_css').value;
		buildFile.assets = Dom.get('step3_assets').value;
		buildFile.dependencySyntax = Dom.get('step3_dependencySyntax').value;
		buildFile.uniqueBuildFiles = Dom.get('step3_uniqueBuildFiles').value;
		buildFile.parseMacro = Dom.get('step3_parseMacro').checked;
		buildFile.defines = Dom.get('step3_defines').value;
		buildFile.prependComments = Dom.get('step3_prependComments').value;
		buildFile.prependModuleComments = Dom.get('step3_prependModuleComments').value;
	},

	_getModuleExampleUrl: function (module) {
		return Demo.baseUrl + Demo.Configs.examples + "/" + module.replace(/\.\w+$/, "") + ".html";
	},

	addModule: function (showErrorMessage) {
		UI._checkValue('step3_module', function (value) {
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
			UI._showModuleList();

			Dom.get('step3_module').value = '';
		});
	},

	removeModule: function (showErrorMessage) {
		UI._checkValue('step3_module', function (value) {

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
			UI._showModuleList();

			Dom.get('step3_module').value = '';

		});
	},

	clearModules: function () {
		if (confirm('确定清空列表吗?')) {
			UI.currentBuildFile.includes.length = UI.currentBuildFile.excludes.length = 0;
			UI._showModuleList();
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

		UI._showModuleList();
	},

	deleteModule: function (includeOrExclude, id) {
		UI.currentBuildFile[includeOrExclude].splice(id, 1);

		UI._showModuleList();
	},

	viewSource: function (node, module) {
		var div = node.parentNode.parentNode;

		if (div.nextSibling && Dom.hasClass(div.nextSibling, 'source')) {
			Dom.toggle(div.nextSibling);
			return;
		}

		if (div.nextSibling && div.nextSibling.tagName === 'UL' && div.nextSibling.nextSibling && Dom.hasClass(div.nextSibling.nextSibling, 'source')) {
			Dom.toggle(div.nextSibling.nextSibling);
			return;
		}

		UI._getSource(module, function (data) {
			div = Dom.after(div, '<ul class="source x-bubble"></ul>');
			var html = '';
			for (var path in data) {
				html += '<li><a href="' + Demo.baseUrl + Demo.Configs.src + '/' + path + '" class="x-hint" target="_blank">' + Demo.Utils.encodeHTML(data[path]) + '</a></li>';
			}
			div.innerHTML = html || '<li>(无源码)</li>';
		});
	},

	viewRequires: function (node, module) {
		var div = node.parentNode.parentNode;

		if (div.nextSibling && Dom.hasClass(div.nextSibling, 'refs')) {
			Dom.toggle(div.nextSibling);
			return;
		}

		if (div.nextSibling && div.nextSibling.tagName === 'UL' && div.nextSibling.nextSibling && Dom.hasClass(div.nextSibling.nextSibling, 'refs')) {
			Dom.toggle(div.nextSibling.nextSibling);
			return;
		}

		UI._getRequires(module, function (data) {
			div = Dom.after(div, '<ul class="refs"></ul>');
			var html = '';
			for (var path in data) {
				html += '<li><div class="line" onmouseover="this.className += \' line-hover\'" onmouseout="this.className = this.className.replace(\' line-hover\', \'\');"><span class="demo demo-toolbar"><a class="demo" href="javascript://查看关联的源文件" onclick="UI.viewSource(this, \'' + path + '\');return false;">源文件</a> | <a class="demo" href="javascript://查看当前模块依赖的项" onclick="UI.viewRequires(this, \'' + path + '\');return false;">查看依赖</a></span><a class="link" href="' + UI._getModuleExampleUrl(path) + '">' + path + '</a></div></li>';
			}
			div.innerHTML = html || '<li>(无依赖)</li>';
		});

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

	// 获取某个的模块源码。
	_getSource: function (modulePath, callback) {
		UI._updateBuildFile();

		var file = UI.currentBuildFile;

		var r = {};
		var type = ModuleBuilder.getModuleType(modulePath);
		if (type) {
			checkFile(modulePath, function () {
				callback(r);
			});
		} else {
			checkFile(modulePath + ".js", function () {
				checkFile(modulePath + ".css", function () {
					callback(r);
				});
			});
		}

		function checkFile(modulePath, callback) {
			var fullPath = ModuleBuilder.getFullPath(modulePath, file.path, file.moduleBasePath);
			ModuleBuilder.loadContent(fullPath, function (error, content) {
				if (!error) {
					r[modulePath] = fullPath;
				}

				callback();
			});
		}

	},

	// 获取某个的模块引用项。
	_getRequires: function (modulePath, callback) {
		UI._updateBuildFile();

		var file = UI.currentBuildFile;
		var r = {};
		var type = ModuleBuilder.getModuleType(modulePath);
		if (type) {
			checkFile(modulePath, function () {
				callback(r);
			});
		} else {
			checkFile(modulePath + ".js", function () {
				checkFile(modulePath + ".css", function () {
					callback(r);
				});
			});
		}

		function checkFile(modulePath, callback) {
			var fullPath = ModuleBuilder.getFullPath(modulePath, file.path, file.moduleBasePath);
			ModuleBuilder.loadContent(fullPath, function (error, content) {
				if (!error) {
					var type = ModuleBuilder.getModuleType(modulePath);
					var rq;

					if (type == ".js") {
						rq = ModuleBuilder.resolveJsRequires(content, file).includes;
					} else if (type == ".css") {
						rq = ModuleBuilder.resolveCssRequires(content, modulePath, fullPath, {}, file).imports;
					}


					if (rq) {
						rq.each(function (item) {
							r[item] = modulePath;
						});
					}

				}

				callback();
			});
		}

	},

	//#endregion

	//#region 第四步

	build: function () {

		// 帮助用户点击添加。
		if (Dom.get('step3_module').value) {
			UI.addModule();
		}

		if (!UI.currentBuildFile.includes.length) {
			alert("请先添加需要打包的模块");
			return;
		}

		UI._updateBuildFile();
		UI._buildInternal();

	},

	preview: function () {

		// 帮助用户点击添加。
		if (Dom.get('step3_module').value) {
			UI.addModule();
		}

		if (!UI.currentBuildFile.includes.length) {
			alert("请先添加需要打包的模块");
			return;
		}

		UI._updateBuildFile();

		UI.step(4);

		var form = Dom.get('step4_result');
		Dom.hide(Dom.get('step4_done'));
		Dom.hide(Dom.get('step4_form'));
		Dom.show(form);

		ModuleBuilder.build({

			file: UI.currentBuildFile,

			log: function (info) {
				//  console.info(info);
				Dom.get('step4_tip').innerHTML = Demo.Utils.encodeHTML(info);
			},

			error: function (error) {
				Dom.get('step4_error').innerHTML += Demo.Utils.encodeHTML(error);
			},

			complete: function (result) {

				result.log("正在合并代码...");

				Dom.show(Dom.get('step4_done'));
				
				var r = [];
				
				for(var key in result.css) {
					r.push('<link rel="stylesheet" type="text/css" href="' + Demo.baseUrl + Demo.Configs.src + '/' + result.css[key].path + '">');
				}
				
				for(var key in result.js) {
					r.push('<script type="text/javascript" src="' + Demo.baseUrl + Demo.Configs.src + '/' + result.js[key].path + '"></script>');
				}

				UI._showResultForm('step4_js', '');
				UI._showResultForm('step4_css', '');
				UI._showResultForm('step4_assets', '');
				UI._showResultForm('step4_html', r.join('\r\n'));	

				result.log("分析依赖完成!");		
	
			}

		});


	},
	
	save: function (){
		
		UI._updateBuildFile();
		UI.step(4);

		if (!UI.usingXFly) {
			UI._alertOpenXFlyError();
		} else {
			UI._postNode('save');
		}
		
	},
	
	_postNode: function (action, data){
	
		var form = Dom.get('step4_form');
		Dom.hide(Dom.get('step4_result'));
		Dom.show(form);

		form.innerHTML = '<iframe src="about:blank" frameborder="0" style="width:100%" height="200px"></iframe>';

		form = form.firstChild;

		var doc = form.contentDocument;

		doc.open();
		doc.write('<form id="form" method="post" action="' + Demo.Configs.serverBaseUrl + Demo.Configs.apps + '/node/modulebuilder/server/api.njs?action=' + action + '" style="visibility:hidden;"><textarea id="data" name="data"></textarea></form>');
		doc.close();

		doc.getElementById('data').value = JSON.stringify(UI.currentBuildFile);
		doc.getElementById('form').submit();
		
	},

	// 开始打包。
	_buildInternal: function () {
		
		UI.step(4);

		var needXFly = UI.currentBuildFile.js || UI.currentBuildFile.css || UI.currentBuildFile.assets || UI.currentBuildFile.path;

		if (needXFly && !UI.usingXFly) {
			UI._alertOpenXFlyError();
			needXFly = false;
		}

		// 基于服务器生成。
		if (needXFly) {
			UI._postNode('build');
		} else {

			var form = Dom.get('step4_result');
			Dom.hide(Dom.get('step4_done'));
			Dom.hide(Dom.get('step4_form'));
			Dom.show(form);

			ModuleBuilder.build({

				file: UI.currentBuildFile,

				log: function (info) {
					//  console.info(info);
					Dom.get('step4_tip').innerHTML = Demo.Utils.encodeHTML(info);
				},

				error: function (error) {
					Dom.get('step4_error').innerHTML += Demo.Utils.encodeHTML(error);
				},

				complete: function (result) {

					result.log("正在合并代码...");
					UI._showResultForm('step4_html', '');

					setTimeout(function () {

						Dom.show(Dom.get('step4_done'));

						var jsStream = new StringStream();
						var cssStream = new StringStream();

						ModuleBuilder.writeJs(result,   jsStream);

						setTimeout(function () {
							jsStream.end();
							UI._showResultForm('step4_js', jsStream.toString());

							ModuleBuilder.writeCss(result,   cssStream);
							cssStream.end();
							UI._showResultForm('step4_css', cssStream.toString());

							setTimeout(function () {
								var assets = [];

								for (var images in result.assets) {
									assets.push(result.assets[images].relative);
								}

								UI._showResultForm('step4_assets', assets.join('\r\n'));

								result.log("打包成功 !");

							}, 0);

						}, 0);

					}, 0);

				}

			});

		}

	},

	_showResultForm: function (id, value) {
		Dom.get(id).value = value;
		Dom.get(id).style.display = Dom.prev(Dom.get(id)).style.display = value ? '' : 'none';
	}

	//#endregion

};

Dom.ready(UI.init);
