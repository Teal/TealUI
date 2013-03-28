/**
 * @fileOverview 用于合成组件。
 */



var System = require('./system'),
    ModuleFile = require('./dplfile'),
	Path = require('path'),
	IO = require(System.Configs.nodeModules + 'io');

/**
 * 构建 DPL 工具。
 */
var ModuleBuilder = {

    info: function(content){
        console.info(content);
    },

    infoFile: function (title, path) {
        console.info(title, path);
    },

    log: function (content) {
        console.log(content);
    },

    error: function (content) {
        console.error(content);
    },

    debug: function (content) {
        console.log(content);
    },

    end: function(){

    },

    /**
	 * 解析一个 DPL 所依赖的 DPL 项。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {Object} 返回格式如： {js: [path1, path2], css: [path1, path2]}
	 */
    resolveRefs: function (dplPath, isStyle) {

        var content = this.getSource(dplPath, isStyle),

            r = {

                css: [],

                js: []

            };

        if (content) {

            if (isStyle) {


                content.replace(/(^\s*|#)(using|imports)\b(.+)\*\/\s*$/mg, function (m, c1, type, c3) {
                    var value = c3.replace(/^[\s\("']+|[\s\)'";]+$/g, "");

                    r.css.push(value);

                    if (type === 'using')
                        r.js.push(value);

                });

            } else {

                content.replace(/(^\s*|#)(using|imports)\b(.+)$/mg, function (m, c1, type, c3) {
                    var value = c3.replace(/^[\s\("']+|[\s\)'";]+$/g, "");

                    r.css.push(value);

                    if (type === 'using')
                        r.js.push(value);

                });


            }

        }

        return r;


    },

    /**
	 * 解析一个 DPL 所依赖的 DPL 项。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {String} 返回文件路径。
	 */
    resolveFileName: function (dplPath, isStyle) {
	
		// 先找大写，再找小写...
        var info = this.dplList[dplPath] || this.dplList[dplPath.toLowerCase()] ;
        return info && info[isStyle ? 'css' : 'js'];
    },

    /**
	 * 获取一个 DPL 实际指向的文件绝对位置。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {String} 返回文件路径。
	 */
    getFullPath: function (dplPath, isStyle) {

        dplPath = this.getFileName(dplPath, isStyle);

        return dplPath && System.Configs.physicalPath + System.Configs.src + Path.sep + dplPath.replace(/\//g, Path.sep);
    },

    /**
	 * 获取一个 DPL 实际指向的文件。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {String} 返回文件路径。
	 */
    getFileName: function (dplPath, isStyle) {

        var cache = this[isStyle ? 'cacheCssFileName' : 'cacheJsFileName'];
        return dplPath in cache ? cache[dplPath] : (cache[dplPath] = this.resolveFileName(dplPath, isStyle))
    },

    /**
	 * 获取一个 DPL 所依赖的 DPL 项。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {Object} 返回格式如： {js: [path1, path2], css: [path1, path2]}
	 */
    getRefs: function (dplPath, isStyle) {

        var cache = this[isStyle ? 'cacheCssRefs' : 'cacheJsRefs'];

        if (!cache[dplPath]) {

            try{

                cache[dplPath] = this.resolveRefs(dplPath, isStyle);

            } catch (e) {
                this.error('无法读取 ' + dplPath + ' 的依赖项');

                cache[dplPath] = { css: [], js: [] };
            }

            // 如果是css文件，还需要从对应的js文件入手搜索引用项。
            if (isStyle) {

                var r = cache[dplPath].css;

                r.push.apply(r, this.getRefs(dplPath, false).css);

                // 删除自身的依赖。
                removeItem(cache[dplPath].css, dplPath);

            } else {

                // 删除自身的依赖。
                removeItem(cache[dplPath].js, dplPath);

            }


        }

        return cache[dplPath];
    },

    /**
     * 获取指定 DPL 的最终文件列表。
     */
    getList: function (dplFile) {

        // 分析引用文件。
        var data = this.getRawData(dplFile);

        var list;

        // 获取原有的数据文件。 
        if (dplFile.properties.resolveRefs) {
            list = this._createAst(data);
        } else {
            list = this._convertToAst(data);
        }
        this.applyRequires(dplFile, data);
        this.applyExcludeModules(data, list);
        this.removeNotExitsItems(list);
        return list;
    },

    /**
     * 获取指定 DPL 的最终文件列表信息。
     */
    getFinalList: function (dplFile) {
        this.init();

        return this.getList(dplFile);
    },

    ///**
	// * 根据 dplFile 获取内部文件的绝对路径。
    // * @param {ModuleFile} dplPath 当前的 DPL 路径。
    // * @param {String} fileName 文件名。
    // * @return {String} 返回文件路径。
	// */
    //getFullPath: function (dplFile, fileName) {
    //    return Path.resolve(, fileName);
    //},

    /**
	 * 获取一个 DPL 实际指向的文件的源码。
     * @param {String} dplPath 当前的 DPL 路径。
     * @param {Boolean} isStyle 当前的 DPL 为样式或脚本。
     * @return {String} 返回文件路径。
	 */
    getSource: function (dplPath, isStyle) {

        var cache = this[isStyle ? 'cacheCssContent' : 'cacheJsContent'];

        if (!('dplPath' in cache)) {

            var path = this.getFullPath(dplPath, isStyle);

            if (path) {
                
                try {
                    cache[dplPath] = IO.readFile(path, this.encoding);
                } catch (e) {
                    this.error('无法读取 ' + dplPath + ' 的源文件(' + path + ')');

                    cache[dplPath] = '';
                }
            }
        }

        return cache[dplPath];

    },

    // 获取原始的 js 和 css 列表。
    getRawData: function (dplFile) {
        var data = {
            js: [],
            css: [],
            excludeJs: [],
            excludeCss: []
        };

        for (var i = 0; i < dplFile.dpls.length; i++) {

            var dpl = dplFile.dpls[i];

            switch (dpl.type) {
                case 'using':
                    data.js.push(dpl.path);
                    data.css.push(dpl.path);
                    break;
                case 'include':
                    data.js.push(dpl.path);
                    break;
                case 'imports':
                    data.css.push(dpl.path);
                    break;
                case '-using':
                    data.excludeJs.push(dpl.path);
                    data.excludeCss.push(dpl.path);
                    break;
                case '-include':
                    data.excludeJs.push(dpl.path);
                    break;
                case '-imports':
                    data.excludeCss.push(dpl.path);
                    break;

            }

        }

        return data;
    },

    // 插入自动引入的 DPL 。
    _convertToAst: function (data) {
        var list = {
            css: [],
            js: []
        };

        for (var i = 0; i < data.js.length; i++) {
            list.js.push({
                isStyle: false,
                name: data.js[i],
                parent: [],
                children: []
            });
        }

        for (var i = 0; i < data.css.length; i++) {
            list.css.push({
                isStyle: true,
                name: data.css[i],
                parent: [],
                children: []
            });
        }

        return list;
    },

    // 遍历并添加引用。
    _createAst: function (tempObj) {
        var map = {};
        var stack = [];
        var result = [];
        var resultCss = [];
        var resultJs = [];

        tempObj.js.reverse();
        tempObj.css.reverse();

        map['.'] = {
            isStyle: false,
            name: '.',
            parent: [],
            children: [tempObj.js, tempObj.css]
        }
        stack.push(map['.']);
        while (stack.length) {
            var tempArray = stack[stack.length - 1].children;
            var bool = tempArray.length - 1;
            if (bool == -1) {
                result.push(stack.pop());
                if (result[result.length - 1].name === '.') result.pop();
                continue;
            }
            if (!tempArray[bool].length) {
                tempArray.pop();
                continue;
            }
            tempArray = tempArray[bool];
            bool = bool == 1;
            var cname = tempArray.pop();
            var cbname = cname + '.' + bool;
            var has = map[cbname];
            if (!has) {
                tempObj = this.getRefs(cname, bool);
                has = map[cbname] = {
                    isStyle: bool,
                    name: cname,
                    parent: [stack[stack.length - 1].name === '.' ? null : stack[stack.length - 1]],
                    children: [tempObj.js, tempObj.css]
                };
                stack.push(has);
            } else {
                has.parent.push(stack[stack.length - 1].name === '.' ? null : stack[stack.length - 1]);
            }
        }

        var list = {
            css: [],
            js: []
        };

        for (var i = 0; i < result.length; i++) {
            if (result[i].isStyle)
                list.css.push(result[i]);
            else
                list.js.push(result[i]);
        }
        return list;
    },

    // 应用 DPL 的排除列表。
    applyExcludeModules: function (data, list) {

        // 删除已排除的组件。
        
        for (var i = 0; i < data.excludeJs.length; i++) {
            var c = data.excludeJs[i];
            for (var j = list.js.length - 1; j >= 0; j--) {
                if (list.js[j].name === c) {
                    list.js.splice(j, 1);
                }
            }
        }

        for (var i = 0; i < data.excludeCss.length; i++) {
            var c = data.excludeCss[i];
            for (var j = list.css.length - 1; j >= 0; j--) {
                if (list.css[j].name === c) {
                    list.css.splice(j, 1);
                }
            }
        }

        return data;
    },

    // 删除不存在的错误组件。
    removeNotExitsItems: function (list) {
        for (var i = list.js.length - 1; i >= 0; i--) {
            list.js[i].path = this.getFileName(list.js[i].name, false);
            if (!list.js[i].path) {
                list.js.splice(i, 1);
            }
        }

        for (var i = list.css.length - 1; i >= 0; i--) {
            list.css[i].path = this.getFileName(list.css[i].name, true);
            if (!list.css[i].path) {
                list.css.splice(i, 1);
            }
        }

    },

    // 应用依赖项，删除被依赖的组件。
    applyRequires: function (dplFile, data) {

        // 已经被依赖过，则不进行处理。
        if(this.cacheRequires[dplFile.path]){
            return;
        }

        // 标记当前路径已经被依赖过，不重复解析。
        this.cacheRequires[dplFile.path] = true;

        if(!dplFile.requires.length){
            return;
        }

        var dplFileRootPath = Path.dirname(dplFile.path);

        for (var i = 0; i < dplFile.requires.length; i++) {
            var dplFile2 = new ModuleFile(Path.resolve(dplFileRootPath, dplFile.requires[i]));

            // 已经被依赖过，则不进行处理。
            if (this.cacheRequires[dplFile2.path]) {
                continue;
            }

            this.cacheRequires[dplFile2.path] = true;

            // 获取被依赖项的列表。
            // 被依赖的合成方案的组件列表，是此合成方案的排除列表。
            var list = this.getList(dplFile2);
            
            for (var j = 0; j < list.js.length; j++) {
                data.excludeJs.push(list.js[j].name);
            }

            for (var j = 0; j < list.css.length; j++) {
                data.excludeCss.push(list.css[j].name);
            }

        }

    },

    // 解析宏。
    resolveMacro: function (content, define) {

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


        //console.log(r);

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

        //	console.log(codes.join(''));

        var fn = new Function("$r", "$d", codes.join(''));

        return fn(r, define);
    },

    // 解析 js 文件。
    resolveJsFile: function (dplFile, content, path) {

        if (dplFile.properties.parseMacro) {
            var define = {};

            dplFile.properties.defines && dplFile.properties.defines.split(';').forEach(function (value) {
                define[value.trim()] = true;
            });
            try {
                content = this.resolveMacro(content, define);
            } catch (e) {
                this.error('解析宏错误: ' + e.message + '。 (' + path + ')');
            }
        }

        if (dplFile.properties.removeUsing) {
            content = content.replace(/^\s*using\s*\(.*?$/mg, "");
        }

        if (dplFile.properties.removeImports) {
            content = content.replace(/^\s*imports\s*\(.*?$/mg, "");
        }

        if (dplFile.properties.removeTrace) {
            content = content.replace(/^\s*trace\s*[\(\.].*?$/mg, "");
        }

        if (dplFile.properties.removeAssert) {
            content = content.replace(/^\s*assert\s*[\(\.].*?$/mg, "");
        }

        if (dplFile.properties.removeConsole) {
            content = content.replace(/^\s*console\s*\..*?$/mg, "");
        }

        return content;
    },

    // 解析 css 文件。
    resolveCssFile: function (dplFile, content, path, name) {

        //if (this.resolveLess && /\.less$/.test(path)) {
        //    if (!less)
        //        initLess(this);

        //    var parser = new less.Parser({
        //        filename: path // Specify a filename, for better error messages
        //    });

        //    var me = this;

        //    parser.parse(content, function (e, tree) {
        //        try {
        //            content = tree.toCSS({ compress: false }); // Minify CSS output
        //        } catch (e) {
        //            me.error('Less Parse Error: ' + e.message + '. (' + path + ')');
        //        }
        //    });

        //}


        if (dplFile.properties.relativeImages) {
            var cssFolder = Path.dirname(path);
            var targetName = getParentName(name);

            var me = this;

            if (!me.imageList) {
                me.imageList = {};
            }

            content = content.replace(/url\s*\((['""]?)(.*)\1\)/ig, function (all, c1, imgUrl, c3) {
                if (imgUrl.indexOf(':') >= 0)
                    return all;

                // 源图片的原始物理路径。
                var srcPath = Path.join(cssFolder, imgUrl);

                // 源图片的文件名。
                var srcName = Path.basename(imgUrl);

                // 如果这个路径没有拷贝过。
                if (!me.imageList[srcPath]) {
                    me.imageList[srcPath] = true;

                    // 不存在，则不处理图片路径。
                    if (!IO.exists(srcPath)) {
                        me.error('Can\'t Find "' + srcPath + '". (from ' + path + ')');

                        return all;
                    }

                    var destPath =  Path.join(dplFile.properties.images, targetName, srcName);
                    if (!IO.exists(destPath)) {
                        IO.copyFile(srcPath, destPath);
                    }
                }
                return "url(" + Path.join(dplFile.properties.relativeImages, targetName, srcName).replace(/\\/g, "/") + ")";
            });
        }

        return content;
    },

    // 写入文件头。
    writeGlobalHeader: function (writer, arr, lineBreak) {
        var d = new Date();
        d = [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes()].join('');
        writer.write("/*********************************************************");
        writer.write(lineBreak);
        writer.write(" * ");
        writer.write("This file is created by a tool at " + d + lineBreak);
        writer.write(" *********************************************************");
        writer.write(lineBreak);
        writer.write(" * Include: ");
        writer.write(lineBreak);
        for (var i = 0; i < arr.length; i++) {
            writer.write(" *     ");
            writer.write(arr[i].name);
            writer.write(lineBreak);
        }
        writer.write(" ********************************************************/");
        writer.write(lineBreak);
        writer.write(lineBreak);
    },

    // 写入标题。
    writeHeader: function (writer, name, lineBreak) {
        writer.write(lineBreak);
        writer.write("/*********************************************************");
        writer.write(lineBreak);
        writer.write(" * ");
        writer.write(name + lineBreak);
        writer.write(" ********************************************************/");
        writer.write(lineBreak);
    },

    // 写入正文。
    writeContent: function (writer, content) {
        writer.write(content);
    },

    // 生成目标 js 文件。
    createJsFiles: function (dplFile, js) {
        
        var writer = IO.openWrite(dplFile.properties.js, {
            flags: 'w+',
            encoding: this.encoding
        });

        this.info("生成 js 文件");

        if (dplFile.properties.addHeader)
            this.writeGlobalHeader(writer, js, dplFile.properties.lineBreak);

        js.forEach(function (file) {
            var name = file.name;
            this.log(">>> " + name);

            if (dplFile.properties.addHeader)
                this.writeHeader(writer, name, dplFile.properties.lineBreak);
            var path = this.getFullPath(file.name, file.isStyle);
            var content = this.getSource(file.name, file.isStyle);
            content = this.resolveJsFile(dplFile, content, path, name);
            this.writeContent(writer, content);
        }, this);

        writer.end()
    },

    // 生成目标 css 文件。
    createCssFiles: function (dplFile, css) {

        var writer = IO.openWrite(dplFile.properties.css, {
            flags: 'w+',
            encoding: this.encoding
        });

        this.info("生成 css 文件");

        if (dplFile.properties.addHeader)
            this.writeGlobalHeader(writer, css, dplFile.properties.lineBreak);

        css.forEach(function (file) {
            var name = file.name;
            this.log(">>> " + name);

            if (dplFile.properties.addHeader)
                this.writeHeader(writer, name, dplFile.properties.lineBreak);
            var path = this.getFullPath(file.name, file.isStyle);
            var content = this.getSource(file.name, file.isStyle);
            content = this.resolveCssFile(dplFile, content, path, name);
            this.writeContent(writer, content);
        }, this);

        writer.end();
    },

    /**
     * 初始化整个对象。
     */
    init: function () {

        var ModuleManager = require('./modulemanager');

        this.dplList = ModuleManager.getModuleList('src');

        this.cacheJsFileName = {};

        this.cacheCssFileName = {};

        this.cacheJsRefs = {};

        this.cacheCssRefs = {};

        this.cacheJsContent = {};

        this.cacheCssContent = {};

        this.cacheRequires = {};

    },

    /**
     * 编译指定的 {@link ModuleFile} 对象。
     */
    build: function (dplFile) {

        this.info("正在合成: " + dplFile.properties.title);

        this.init();

        this.encoding = dplFile.encoding;
       
        this.infoFile("合成方案: ", dplFile.path);

        var dplFileRootPath = Path.resolve(Path.dirname(dplFile.path), dplFile.properties.base || "");

        // 预处理文件路径。

        if (dplFile.properties.js) {
            dplFile.properties.js = Path.resolve(dplFileRootPath, dplFile.properties.js);
            this.infoFile("目标 js 文件: ", dplFile.properties.js);
        }

        if (dplFile.properties.css) {
            dplFile.properties.css = Path.resolve(dplFileRootPath, dplFile.properties.css);
            this.infoFile("目标 css 文件: ", dplFile.properties.css);
        }

        if (dplFile.properties.images) {
            dplFile.properties.images = Path.resolve(dplFileRootPath, dplFile.properties.images);
            dplFile.properties.relativeImages = Path.relative(Path.dirname(dplFile.properties.css), dplFile.properties.images);
            this.infoFile("目标图片文件夹: ", dplFile.properties.images);
        }

        var list = this.getList(dplFile);

        if (dplFile.properties.css) {
            this.createCssFiles(dplFile, list.css);
            this.log("\r\n");
        }

        if (dplFile.properties.js) {
            this.createJsFiles(dplFile, list.js);
            this.log("\r\n");
        }

        this.info("合成成功!");

        this.end();

    }

};


function removeItem(array, item) {
    var i = array.indexOf(item);
    while (i >= 0) {
        array.splice(i, 1);
        i = array.indexOf(item);
    }
}



function getParentName(name) {
    var i = name.lastIndexOf('.');
    if (i > 0) {
        var j = name.lastIndexOf('.', i - 1);

        if (j >= 0) {
            name = name.substr(j + 1, i - j - 1);
        }
    }
    return name.toLowerCase();
}


module.exports = ModuleBuilder;
