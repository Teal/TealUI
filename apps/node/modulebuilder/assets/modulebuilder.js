/**
 * @fileOverview 模块打包工具。
 * @author xuld
 */

//#region BuildFile

function BuildFile() {
	this.includes = [];
	this.excludes = [];

	this.compress = false;
	this.addAssert = false;

	this.path = '';
	this.js = '';
	this.css = '';
	this.assets = '';
	this.src = '';
	this.dependencySyntax = 'boot';
	this.uniqueBuildFiles = '';
	this.parseMacro = false;
	this.defines = '';
	this.prependComments = '/*********************************************************\n' +
                           ' * This file is created by a tool at {time}\n' +
                           ' ********************************************************/\n\n' +
                           '{modules}\n';
	this.prependModuleComments = '/*********************************************************\n' +
                                 ' * {module}\n' +
                                 ' ********************************************************/\n';

	this.lineBreak = "\r\n";
	this.moduleBasePath = "";

	this.relativeImages = "";
}

BuildFile.prototype.load = function (content) {

	var me = this,
		first = -1;

	var lines = content.split(/\r?\n/), match, macro, args;

	for(var i = 0; i < lines.length; i++) {
		if (match = /^\s*\/[\/\*]\s*#(\w+)\s+(.*)$/.exec(lines[i])) {

			if (first === -1) {
				first = i;
			}

			macro = match[1];

			args = match[2];

			var fromLine = i;

			// 如果结尾是 \， 则继续解析。
			while(/\\$/.test(args) && i + 1 < lines.length){
				args = args.substr(0, args.length - 1) + '\r\n' + lines[++i].replace(/^\s*\/[\/\*]\s*#?/, "");
			}

			if(processMarco(macro, args)){
				lines.splice(fromLine, i - fromLine + 1);

				i = fromLine - 1;
			} 

		}
	}

	if (first === -1) {
		this.prefix = "";
		this.postfix = content;
	} else {
		this.prefix = lines.slice(0, first).join(this.lineBreak);
		this.postfix = lines.slice(first).join(this.lineBreak);
	}

	function processMarco(macro, args) {
		switch (macro) {
			case 'include':
			case 'import':
			case 'imports':
				me.includes.push(args);
				break;

			case 'exclude':
			case 'included':
				me.excludes.push(args);
				break;

			case 'define':
				var m = /^\s*(\w+)\s+/.exec(args);
				args = args.substr(m[0].length);

				if (!args || args === "true") {
					args = true;
				} else if(args === "false"){
					args = false;
				}

				me[m[1]] = args;
				break;

			default:
				return false;
		}

		return true;
	}

};

BuildFile.prototype.save = function () {

	var contents = [], rest = [], defaultBuilds = new BuildFile();

	this.includes.forEach(function (value) {
		if (/\.css$/.test(value)) {
			contents.push("//#import " + value);
		} else {
			rest.push("//#include " + value);
		}
	});

	contents.push.apply(contents, rest);

	this.excludes.forEach(function (value) {
		contents.push("//#exclude " + value);
	});

	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			switch (key) {
				case "includes":
				case "excludes":
				case "lineBreak":
				case "prefix":
				case "postfix":
			    case "isNew":
			    case "path":
					break;
				default:
					var value = this[key];

					// 不写入默认的配置。
					if (value !== defaultBuilds[key]) {

						if (typeof value === 'string') {
							value = value.replace(/(\r?\n)/g, "\\$1//#");
						}
						contents.push("//#define " + key + " " + value);

					}
					break;
			}
		}
	}

	return (this.prefix || "") + contents.join(this.lineBreak) + (this.postfix || "");
};

//#endregion

//#region Stream

function Stream() {

}

Stream.prototype.write = Stream.prototype.end = function () {

};

//#endregion

//#region StringStream

function StringStream() {
	this._values = [];
}

StringStream.prototype = new Stream();

StringStream.prototype.write = function (value) {
	this._values.push(value);
};

StringStream.prototype.end = function () {
	this._value = this._values.join('');
};

StringStream.prototype.valueOf = StringStream.prototype.toString = function () {
	return this._value;
};

//#endregion

//#region ModuleBuilder

var Path = Path || require('path');
var ModuleBuilder = typeof exports === 'object' ? exports : {};

ModuleBuilder.BuildFile = BuildFile;


// 模块基础路径。
ModuleBuilder.moduleBasePath = "";

//#region 载入存档

/**
 * 载入指定的配置文件。
 */
ModuleBuilder.load = function (buildFilePath, callback) {
    
	ModuleBuilder.loadContent(buildFilePath, function (error, content) {
		if (error) {
			return;
		}
		
		var buildFile = new BuildFile();
		buildFile.load(content);

		buildFile.path = buildFilePath;
		callback(buildFile);

	});

};

ModuleBuilder.loadContent = typeof exports === "object" ? function (fullPath, callback) {
	require("fs").readFile(fullPath, "utf-8", function (error, content) {

		if (content) {
			content = content.replace(/^\uFEFF/, '');
		}

		callback(error, content);

	});
} : function (fullPath, callback) {

	Ajax.get(fullPath, function (content) {
		callback(null, content);
	}, function (message, xhrObject) {
		callback(new Error(message));
	});

};

//#endregion

//#region 编译生成

/**
 * 开始打包操作。
 */
ModuleBuilder.build = function (options) {

	var buildContext = {

		// 正在编译的文件。
		file: null,

		// 已经处理过的模块。
		parsedModules: {},

		// 文件源码缓存。
		contents: {},

		// 最终得到的 js 依赖项。
		js: {},
		
		// 最终得到的 css 依赖项。
		css: {},
		
		// 最终得到的资源依赖项。
		assets: {},

		start: function () {
			this.log("正在打包...");
		},

		log: function (message) {
			if(typeof console !== 'undefined' && console.log) {
				console.log(message);
			}
		},

		error: function (message) {
			if(typeof console !== 'undefined' && console.error) {
				console.error(message);
			}
		},

		complete: function (buildContext) {
			this.log("打包成功!");
		}

	};

	for(var key in options) {
		buildContext[key] = options[key];
	}

	if (!buildContext.file.relativeImages && buildContext.file.css && buildContext.file.assets) {
	    buildContext.file.relativeImages = Path.relative(Path.dirname(buildContext.file.css), buildContext.file.assets).replace(/\\/g, '/');
	}

	buildContext.start();
	
	ModuleBuilder._parseModules(buildContext, buildContext.file.excludes, buildContext.file.path, null, true);
	ModuleBuilder._parseModules(buildContext, buildContext.file.includes, buildContext.file.path, function () {

		// 排除重复模块。
		if (buildContext.file.uniqueBuildFiles) {
			ModuleBuilder._excludeBuildFiles(buildContext, buildContext.file.uniqueBuildFiles.split(';'), function () {
				buildContext.complete(buildContext);
			});
		} else {
			buildContext.complete(buildContext);
		}

	});

};

ModuleBuilder._parseModules = function (buildContext, modules, preModulePath, callback, exclude) {

	var i = 0;

	function step() {

		if (i < modules.length) {
			ModuleBuilder._parseModule(buildContext, modules[i++], preModulePath, step, exclude);
		} else if (callback) {
			callback();
		}

	}

	step();

};

ModuleBuilder._parseModule = function (buildContext, modulePath, preModulePath, callback, exclude) {

	var moduleType = ModuleBuilder.getModuleType(modulePath);

	// 如果一个模块没有指定模块类型，则同时解析对应的 js 和 css 模块。
	if (!moduleType) {
		ModuleBuilder._parseModule(buildContext, modulePath + ".css", preModulePath, function () {
			ModuleBuilder._parseModule(buildContext, modulePath + ".js", preModulePath, callback, exclude);
		}, exclude);
		return;
	}

	callback = callback || function(){};

	// 获取模块的完整路径。
	var fullPath = ModuleBuilder.getFullPath(modulePath, preModulePath, buildContext.file.moduleBasePath);

	// 如果模块已经解析过，则不再解析。
	if (buildContext.parsedModules[fullPath]) {
		buildContext.parsedModules[fullPath].push(preModulePath);
		callback();
		return;
	}
	
	// 标记模块已经解析了。
	buildContext.parsedModules[fullPath] = [preModulePath];

	// 如果是需要排除模块，则删除之前添加的全部模块。
	if (exclude) {

		// 删除已经添加的不需要的模块。
		delete buildContext.js[fullPath];
		delete buildContext.css[fullPath];
		delete buildContext.assets[fullPath];

		callback();
		return;
	}

	// 开始正式解析模块。
	buildContext.log("正在分析 " + modulePath + " ...");

	switch (moduleType) {

		case ".js":

			ModuleBuilder.loadContentWithCache(buildContext, fullPath, function (error, content) {
				if (error) {
					callback();
					return;
				}

				// 解析宏。
				if (buildContext.file.parseMacro) {
					var defines = {};
					(buildContext.file.defines || "").split(';').forEach(function (value) {
						defines[value] = true;
					});

					try {
						content = ModuleBuilder.resolveMacro(content, defines);
					} catch (e) {
						buildContext.error("解析宏错误: " + e.message + "(" + modulePath + ")");
					}
				}

				// 解析 js 依赖项。
				var r = ModuleBuilder.resolveJsRequires(content, buildContext.file);
				ModuleBuilder._parseModules(buildContext, r.excludes, modulePath, null, true);
				ModuleBuilder._parseModules(buildContext, r.includes, modulePath, function () {
					buildContext.js[fullPath] = {
						pre: preModulePath,
						path: modulePath,
						fullPath: fullPath,
						content: r.content
					};

					callback();
				});

			});

			break;

		case ".css":

			ModuleBuilder.loadContentWithCache(buildContext, fullPath, function (error, content) {
				if (error) {
					callback();
					return;
				}

				var r = ModuleBuilder.resolveCssRequires(content, modulePath, fullPath, buildContext.assets, buildContext.file);

				ModuleBuilder._parseModules(buildContext, r.imports, modulePath, function () {
					buildContext.css[fullPath] = {
						pre: preModulePath,
						path: modulePath,
						fullPath: fullPath,
						content: r.content
					};
					callback();
				});

			});

			break;

		case ".less":
		case ".sass":
		case ".styue":
		case ".coffee":

		// 其它模块类型不支持解析。
		default:
			callback();
			break;

	}

};

ModuleBuilder.loadContentWithCache = function (buildContext, fullPath, callback) {

	var contents = buildContext.contents[fullPath];

	if (contents) {
		callback(contents[0], contents[1]);
	} else {
		ModuleBuilder.loadContent(fullPath, function (error, content) {
			buildContext.contents[fullPath] = [error, content];
			callback(error, content);
		});

	}
};

ModuleBuilder.getModuleType = function (modulePath) {
	return Path.extname(modulePath);
};

// 返回模块的完整路径。
// 在浏览器端，返回 http://localhost/src/module.js
// 在 node 端，返回 E:/file/src/module.js
ModuleBuilder.getFullPath = function (modulePath, preModulePath, basePath) {

	modulePath = modulePath.replace(/\\|\/\//g, "/");

	// If modulePath is relative path. Concat modulePath with basePath.
	if (modulePath.charAt(0) === '.') {
		modulePath = preModulePath + "/" + modulePath;
	} else if (!/:\/\//.test(modulePath)) {
		modulePath = (basePath || ModuleBuilder.moduleBasePath) + "/" + modulePath;
	}

	// Remove "/./" in path
	modulePath = modulePath.replace(/\/(\.\/)+/g, "/");

	// Remove "/../" in path
	while (/\/[^\/]+\/\.\.\//.test(modulePath)) {
		modulePath = modulePath.replace(/\/[^\/]+\/\.\.\//, "/");
	}

	return modulePath;
};

// 解析宏。
ModuleBuilder.resolveMacro = function (content, define) {

	var m = /^\/\/\/\s*#(\w+)(.*?)$/m;

	var r = [];

	while (content) {
		var value = m.exec(content);

		if (!value) {
			r.push([content, 0, 0]);
			break;
		}

		// 保留匹配部分的左边字符串。
		r.push([content.substring(0, value.index), 0, 0]);

		r.push(value);

		// 截取匹配部分的右边字符串。
		content = content.substring(value.index + value[0].length);
	}

	var codes = ['var $out="",$t;'];

	r.forEach(function (value, index) {

		if (!value[1]) {
			codes.push('$out+=$r[' + index + '][0];');
			return;
		}

		var v = value[2].trim();

		switch (value[1]) {

			case 'if':
				codes.push('if(' + v.replace(/\b([a-z_$]+)\b/ig, "$d.$1") + '){');
				break;

			case 'else':
				codes.push('}else{');
				break;

			case 'elsif':
				codes.push('}else if(' + v.replace(/\b([a-z_$]+)\b/g, "$d.$1") + '){');
				break;

			case 'endif':
			case 'endregion':
				codes.push('}');
				break;

			case 'define':
				var space = v.search(/\s/);
				if (space === -1) {
					codes.push('if(!(' + v + ' in $d))$d.' + v + "=true;");
				} else {
					codes.push('$d.' + v.substr(0, space) + "=" + v.substr(space) + ";");
				}
				break;

			case 'undef':
				codes.push('delete $d.' + v + ";");
				break;

			case 'ifdef':
				codes.push('if(' + v + ' in $d){');
				break;

			case 'ifndef':
				codes.push('if(!(' + v + ' in $d)){');
				break;

			case 'region':
				codes.push('if($d.' + v + ' !== false){');
				break;

			case 'rem':
				break;

			default:
				codes.push('$out+=$r[' + index + '][0];');
				break;
		}

	});

	codes.push('return $out;');

	var fn = new Function("$r", "$d", codes.join(''));

	return fn(r, define);
};

ModuleBuilder.resolveJsRequires = function (content, buildFile) {

	var r = {
		includes: [],
		excludes: [],
		content: content
	};

	switch (buildFile.dependencySyntax) {
		case "boot":
			r.content = content.replace(/^(\s*)\/[\/\*]\s*#(\w+)\s+(.*)$/gm, function (all, indent, macro, args) {
				switch (macro) {
					case 'include':
					case 'import':
					case 'imports':
						r.includes.push(args);
						break;

					case 'exclude':
					case 'included':
						r.excludes.push(args);
						break;
					case 'assert':
						if (buildFile.addAssert)
							return indent + ModuleBuilder._replaceAssert(args);
						break;
					case 'deprected':
						if (buildFile.addAssert)
							return indent + 'if(window.console && console.warn) console.warn("' + (args.replace(/\"/g, "\\\"") || "This function is deprected.") + '")';
						break;
				}

				return all;
			});
			break;

		//case "amd":
		//    content.replace(/define\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
		//        modules.push(args);

		//        return all;
		//    });

		//case "cmd":
		//	content.replace(/require\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
		//		modules.push(args);

		//		return all;
		//	});
		//	break;

		//case "yui":
		//	content.replace(/YUI().use\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
		//		modules.push(args);

		//		return all;
		//	});
		//	break;

		//case "kissy":
		//	content.replace(/KISSY.use\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
		//		modules.push(args);

		//		return all;
		//	});
		//	break;


	}


	return r;
};

ModuleBuilder._replaceAssert = function (args) {

	// args = exp @fun(args): message

	var at = args.indexOf('@'),
		expr = at < 0 ? args : args.substr(0, at),
		defaultMessage = expr,
		message = at > 0 ? args.substr(at + 1) : "Assertion fails";

	// value:type check
	if ((at = /^(.+):\s*(\w+)(\??)\s*$/.exec(expr)) && at[2] in typeAsserts) {
		expr = (at[3] ? at[1] + ' == null || ' : at[1] + ' != null && ') + typeAsserts[at[2]].replace(/\$/g, at[1]);
		defaultMessage = at[1] + ' should be a(an) ' + at[2] + (at[3] ? ' or undefined.' : '.');
	}

	if (message.indexOf(':') < 0) {
		message += ': ' + defaultMessage;
	}

	return 'if(!(' + (expr || 1) + ') && window.console && console.error) console.error("' + message.replace(/\"/g, "\\\"") + '");';
},

ModuleBuilder.resolveCssRequires = function (content, modulePath, fullPath, assets, buildFile) {
	
	var r = {
		imports: [],
		assets: assets,
		content: content
	};

	r.content = content.replace(/(@import\s+)?(url\s*\(\s*(['"]?))(.+)(\3\s*\))/ig, function (all, isImport, q1, _, imgUrl, q2) {

		// 不处理绝对位置。
		if (imgUrl.indexOf(':') >= 0) {
			return all;
		}

		if(isImport) {
			r.imports.push(ModuleBuilder.parseRelativePath(modulePath, imgUrl));
			return all;
		}

		// 源图片的原始物理路径。
		var fromPath = ModuleBuilder.parseRelativePath(fullPath, imgUrl);

		var asset = r.assets[fromPath];

		// 如果这个路径没有拷贝过。
		if (!asset) {

			// 源图片的文件名。
			var name = ModuleBuilder._concatPath(Path.dirname(modulePath), Path.basename(imgUrl));

			r.assets[fromPath] = asset = {
				pres: [],
				name: name,
				from: fromPath,
				relative: ModuleBuilder._concatPath(buildFile.relativeImages, name),
				to: ModuleBuilder._concatPath(buildFile.assets, name)
			};
		}

		asset.pres.push(modulePath);

		return q1 + asset.relative + q2  ;
	});

	return r;

};

ModuleBuilder.parseRelativePath = function (basePath, relativePath) {
	var protocol = /^\w+:\/\/[^\\]*?(\/|$)/.exec(basePath);
	if(protocol) {
		basePath = basePath.substr(protocol[0].length);
	}
	basePath = Path.resolve(Path.dirname(basePath), relativePath).replace(/\\/g, "/");
	return protocol ? protocol[0] + basePath : basePath;
};

ModuleBuilder._concatPath = function (pathA, pathB) {
	return pathB.charAt(0) === '/' ? (/\/$/.test(pathA) ? pathA + pathB.substr(1) : (pathA + pathB)) : (/\/$/.test(pathA) ? pathA + pathB : (pathA + "/" + pathB));
};

ModuleBuilder._excludeBuildFiles = function (buildContext, files, callback) {

	var i = 0, me = this;

	function step() {

		if (i < files.length) {
			ModuleBuilder.load(ModuleBuilder.parseRelativePath(buildContext.file.path, files[i]), function (buildFile) {
				ModuleBuilder.build({

					file: buildFile,

					contents: buildContext.contents,

					start: emptyFn,

					complete: function (result) {

						for (var fullPath in result.js) {
							delete buildContext.js[fullPath];
						}

						for (var fullPath in result.css) {
							delete buildContext.css[fullPath];
						}

						for (var fullPath in result.assets) {
							delete buildContext.assets[fullPath];
						}

						step();
					}

				});
			});

		} else if (callback) {
			callback();
		}

	}


	function emptyFn() {

	}


	step();

};

//#endregion

//#region 产出输出

ModuleBuilder.writeJs = function (result, writer) {

	for (var hasModule in result.js) {

		result.log("正在生成 js 代码...");

		var comment = result.file.prependComments;

		if (comment) {

			if (comment.indexOf("{time}") >= 0) {
				comment = comment.replace("{time}", ModuleBuilder._getNow());
			}

			if (comment.indexOf("{source}") >= 0) {
				comment = comment.replace("{source}", result.file.path || "");
			}

			if (comment.indexOf("{modules}") >= 0) {
				var list = [];
				for (var i in result.js) {
					list.push("//#included " + result.js[i].path);
				}
				for (var i in result.css) {
					list.push("//#included " + result.css[i].path);
				}

				list.sort();
				comment = comment.replace("{modules}", list.join(result.file.lineBreak));
			}

			comment = comment.replace(/\r?\n/g, result.file.lineBreak);

			writer.write(comment);
			writer.write(result.file.lineBreak);

		}

		comment = result.file.prependModuleComments;

		if (comment) {
			comment = comment.replace(/\r?\n/g, result.file.lineBreak);
		}

		for (var i in result.js) {
			if (comment) {
				writer.write(comment.replace("{module}", result.js[i].path));
			}

			var content = result.js[i].content;

			if (result.file.compress) {
				content = ModuleBuilder._compressJs(content);
			}

			writer.write(content);
		}

		break;
	}

};

ModuleBuilder.writeCss = function (result, writer) {

	for (var hasModule in result.css) {

		result.log("正在生成 css 代码...");

		var comment = result.file.prependComments;

		if (comment) {

			if (comment.indexOf("{time}") >= 0) {
				comment = comment.replace("{time}", ModuleBuilder._getNow());
			}

			if (comment.indexOf("{source}") >= 0) {
				comment = comment.replace("{source}", result.file.path || "");
			}

			comment = comment.replace("{modules}", "");

			comment = comment.replace(/\r?\n/g, result.file.lineBreak);

			writer.write(comment);
			writer.write(result.file.lineBreak);

		}

		comment = result.file.prependModuleComments;

		if (comment) {
			comment = comment.replace(/\r?\n/g, result.file.lineBreak);
		}

		for (var i in result.css) {
			if (comment) {
				writer.write(result.file.lineBreak);
				writer.write(comment.replace("{module}", result.css[i].path));
				writer.write(result.file.lineBreak);
			}

			var content = result.css[i].content;

			if (result.file.compress) {
				content = ModuleBuilder._compressCss(content);
			}

			writer.write(content);
		}

		break;
	}


};

ModuleBuilder._getNow = function () {
	var d = new Date();
	d = [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes()];

	if (d[d.length - 1] < 10) {
		d[d.length - 1] = '0' + d[d.length - 1];
	}

	if (d[d.length - 3] < 10) {
		d[d.length - 3] = '0' + d[d.length - 3];
	}

	return d.join('');
};

ModuleBuilder._compressCss = function (code) {
	
	if(typeof cssmin !== 'function') {
		cssmin = require('cssmin/cssmin').cssmin;
	}
	
	return cssmin(code);
};

ModuleBuilder._compressJs = function (value) {
	
	if(typeof parse !== 'function') {
		parse = require('uglify-js').parse;
		Compressor = require('uglify-js').Compressor;
	}
	
	
	
	var ast = parse(value);
	ast.figure_out_scope();
	// https://github.com/mishoo/UglifyJS2#compressor-options
	
	var compressor = Compressor();
	
	compressor.options.warnings = false;
	
	ast.transform(compressor);
	ast.figure_out_scope();
	ast.compute_char_frequency();
	ast.mangle_names();
	return ast.print_to_string();
};

//#endregion

//#endregion
