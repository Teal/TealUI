
//#region BuildFile

function BuildFile() {
    this.includes = [];
    this.excludes = [];

    this.compress = false;
    this.removeAssert = false;
    this.removeConsole = false;

    this.path = '';
    this.js = '';
    this.css = '';
    this.images = '';
    this.src = '';
    this.dependencySyntax = 'boot';
    this.uniqueBuildFiles = '';
    this.parseMacro = false;
    this.defines = '';
    this.prependComments = '/*********************************************************\r\n' +
                           ' * This file is created by a tool at {time}\r\n' +
                           ' ********************************************************/\r\n\r\n' +
                           '{modules}\r\n';
    this.prependModuleComments = '\r\n/*********************************************************\r\n' +
                                 ' * {module}\r\n' +
                                 ' ********************************************************/\r\n\r\n';

    this.lineBreak = "\r\n";
    this.basePath = "";

    this.relativeImages = "images/";
}

//#endregion

//#region Stream

function Stream() {

}

Stream.prototype.write = function () {

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

function ModuleBuilder(buildFile) {

    this.file = buildFile;

}

ModuleBuilder.prototype = {

    file: null,

    start: function () {
        console.info("正在打包...");
    },

    log: function (message) {
        console.log(message);
    },

    info: function (message) {
        console.info(message);
    },

    error: function (message) {
        console.info(message);
    },

    complete: function () {
        console.info("打包成功!");
    },

    getFullPath: function (modulePath, preModulePath) {

        modulePath = modulePath.replace(/\\|\/\//g, "/");

        // If modulePath is relative path. Concat modulePath with basePath.
        if (modulePath.charAt(0) === '.') {
            modulePath = preModulePath + "/" + modulePath;
        } else if (!/:\/\//.test(modulePath)) {
            modulePath = this.file.basePath + "/" + modulePath;
        }

        // Remove "/./" in path
        modulePath = modulePath.replace(/\/(\.\/)+/g, "/");

        // Remove "/../" in path
        while (/\/[^\/]+\/\.\.\//.test(modulePath)) {
            modulePath = modulePath.replace(/\/[^\/]+\/\.\.\//, "/");
        }

        return modulePath;
    },

    concatPath: function (pathA, pathB) {
    	return pathB.charAt(0) === '/' ? (/\/$/.test(pathA) ? pathA + pathB.substr(1) : (pathA + pathB)) : (/\/$/.test(pathA) ? pathA + pathB : (pathA + "/" + pathB));
    },

    loadContent: function (fullPath, callback) {
        Ajax.send({
            url: fullPath,
            error: function (message, xhrObject) {
                callback(new Error(message));
            },
            success: function (content) {
                callback(null, content);
            }
        });
    },

    getModuleType: function (modulePath) {
    	return Path.extname(modulePath);
    },

    /**
	 * 解析一个 DPL 所依赖的 DPL 项。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {Object} 返回格式如： {js: [path1, path2], css: [path1, path2]}
	 */
    resolveJsRequires: function (content, modulePath, fullPath) {

        var me = this;
        var modules = [];

        switch (this.file.dependencySyntax) {
            case "boot":
                content.replace(/^(\s*)\/[\/\*]\s*#(\w+)\s+(.*)$/gm, function (all, indent, macro, args) {
                    switch (macro) {
                        case 'include':
                            modules.push(args);
                            break;

                        case 'exclude':
                        case 'included':
                            me.parseModule(args, modulePath, null, true);
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

            case "cmd":
                content.replace(/require\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
                    modules.push(args);

                    return all;
                });
                break;

            case "yui":
                content.replace(/YUI().use\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
                    modules.push(args);

                    return all;
                });
                break;

            case "kissy":
                content.replace(/KISSY.use\s*\(\s*(['"])(\w+)\1\s*\)$/g, function (all, indent, macro, args) {
                    modules.push(args);

                    return all;
                });
                break;


        }


        return modules;


    },

    resolveCssRequires: function (content, modulePath, fullPath) {

        var me = this;
        var modules = [];

        content = content.replace(/@import\s+url\s*\(\s*(['"]?)(.+)\1\s*\)/g, function (all, indent, importPath, args) {
        	var path = Path.resolve(Path.dirname(fullPath), importPath);
            modules.push(path);
        });

        var moduleFolder = Path.dirname(modulePath);
        var cssFolder = Path.dirname(fullPath);
		
        modules.content = content.replace(/url\s*\((['""]?)(.*)\1\)/ig, function (all, c1, imgUrl, c3) {

        	// 不处理绝对位置。
        	if (imgUrl.indexOf(':') >= 0)
        		return all;

        	// 源图片的原始物理路径。
        	var fromPath = me.concatPath(cssFolder, imgUrl);

        	// 源图片的文件名。
        	var name = me.concatPath(moduleFolder, Path.basename(imgUrl))

        	var toPath = me.file.images;

        	var asset = me.assets[fromPath];

        	// 如果这个路径没有拷贝过。
        	if (!asset) {
        		me.assets[fromPath] = asset = {
        			pres: [],
        			from: fromPath,
        			relative: me.concatPath(me.file.relativeImages.replace(/\\/g, "/"), name),
        			to: me.concatPath(me.file.images, name)
        		};
			}
        	
        	asset.pres.push(modulePath);

        	return "url(" + asset.relative + ")";
        });

        return modules;

    },

    /**
     * 初始化整个对象。
     */
    init: function (buildFile) {
        
        //this.dplList = ModuleManager.getModuleList('src');

        //this.cacheJsFileName = {};

        //this.cacheCssFileName = {};

        //this.cacheJsRefs = {};

        //this.cacheCssRefs = {};

        //this.cacheJsContent = {};

        //this.cacheCssContent = {};

        //this.cacheRequires = {};

    },

    parseModule: function (modulePath, preModulePath, callback, exclude) {

        var me = this, moduleType = this.getModuleType(modulePath);

        if (!moduleType) {
            this.parseModule(modulePath + ".css", preModulePath, function () {
                me.parseModule(modulePath + ".js", preModulePath, callback, exclude);
            }, exclude);
            return;
        }

        var fullPath = this.getFullPath(modulePath, preModulePath);

        if (this.parsedModules[fullPath]) {

            if (callback) {
                callback();
            }

            return;
        }

        if (!exclude) {
            this.log("正在分析 " + modulePath + " ...");
        }

        this.parsedModules[fullPath] = moduleType;

        if (exclude) {

            if (callback) {
                callback();
            }

            return;
        }

        var me = this;

        switch (moduleType) {

            case ".js":

                this.loadContent(fullPath, function (error, content) {
                    if (error) {
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                    var modules = me.resolveJsRequires(content, modulePath, fullPath);

                    me.parseModules(modules, modulePath, function () {
                        me.js.push({
                            pre: preModulePath,
                            path: modulePath,
                            fullPath: fullPath,
                            content: modules.content || content
                        });

                        if (callback) {
                            callback();
                        }
                    });

                });

                break;

            case ".css":

                this.loadContent(fullPath, function (error, content) {
                    if (error) {
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                    var modules = me.resolveCssRequires(content, modulePath, fullPath);

                    me.parseModules(modules, modulePath, function () {
                        me.css.push({
                            pre: preModulePath,
                            path: modulePath,
                            fullPath: fullPath,
                            content: modules.content || content
                        });

                        if (callback) {
                            callback();
                        }
                    });

                });

                break;

            default:

                if (callback) {
                    callback();
                }

        }

    },

    parseModules: function (modules, preModulePath, callback, exclude) {

        var i = 0, me = this;

        function step() {

            if (i < modules.length) {
                me.parseModule(modules[i++], preModulePath, step, exclude);
            } else if (callback) {
                callback();
            }

        }


        step();

    },

    /**
     * 开始打包操作。
     */
    build: function () {

        var me = this;

        this.parsedModules = {};

        this.js = [];
        this.css = [];
        this.assets = {};

        this.start();
        this.parseModules(this.file.excludes, this.file.path, null, true);
        this.parseModules(this.file.includes, this.file.path, function () {
            me.complete();
        });

    },

    writeJs: function (writer) {

        if (!this.js.length) {
            return;
        }

        this.log("正在生成 js 代码...");

        var comment = this.file.prependComments;

        if (comment) {

            if (comment.indexOf("{time}") >= 0) {
                var d = new Date();
                comment = comment.replace("{time}", [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes()].join(''));
            }

            if (comment.indexOf("{source}") >= 0) {
                comment = comment.replace("{source}", this.file.path || "");
            }

            if (comment.indexOf("{modules}") >= 0) {
                var list = [];
                for (var i = 0; i < this.js.length; i++) {
                    list.push("//#included " + this.js[i].path);
                }
                for (var i = 0; i < this.css.length; i++) {
                    list.push("//#included " + this.css[i].path);
                }
                comment = comment.replace("{modules}", list.join(this.file.lineBreak));
            }

            writer.write(comment);

        }

        for (var i = 0; i < this.js.length; i++) {
            if (this.file.prependModuleComments) {
                writer.write(this.file.prependModuleComments.replace("{module}", this.js[i].path));
            }

            writer.write(this.js[i].content);
        }

    },

    writeCss: function (writer) {

        if (!this.css.length) {
            return;
        }

        this.log("正在生成 css 代码...");

        var comment = this.file.prependComments;

        if (comment) {

            if (comment.indexOf("{time}") >= 0) {
                var d = new Date();
                comment = comment.replace("{time}", [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes()].join(''));
            }

            if (comment.indexOf("{source}") >= 0) {
                comment = comment.replace("{source}", this.file.path || "");
            }

            comment = comment.replace("{modules}", "");

            writer.write(comment);

        }

        for (var i = 0; i < this.css.length; i++) {
            if (this.file.prependModuleComments) {
                writer.write(this.file.prependModuleComments.replace("{module}", this.css[i].path));
            }

            writer.write(this.css[i].content);
        }

    }

};

ModuleBuilder.build = function (options) {

    var b = new ModuleBuilder();

    for (var key in options) {
        b[key] = options[key];
    }

    b.build();

    return b;

};

//#endregion
