/**
 * @fileOverview Node 端用于接收所有功能请求的模块。
 * @author xuld
 */

/**
 * 文档文件的扩展名。
 */
const docExtName = '.html';

/**
 * 存放模板列表路径的地址。
 */
const templatePath = '../templates';

var Path = require('path'),
	IO = require('utilskit/io'),
	FS = require('fs'),
    Doc = require('../../../assets/doc/doc.js');

var reModuleInfo = new RegExp('(<meta\\s+name\\s*=\\s*([\'\"])' + Doc.Configs.moduleInfo + '\\2\\s+content\\s*=\\s*([\'\"]))(.*?)(\\3\\s*\\/?>)', 'i');

response.contentType = 'text/html';

switch (request.queryString['cmd']) {
    case 'updatemodulelist':
        updateModuleList();
        //redirect(context);
        break;
    case 'createmodule':
        var html = createModule(request.queryString.path, request.queryString.tpl, request.queryString.title);
        context.response.write(html);
        break;
    case 'deletemodule':
        deleteModule(request.queryString.path);
        //redirect(context);
        break;
    case 'updatemodule':
        var moduleInfo = {
            status: request.queryString.status
        };

        if (request.queryString.support) {
            if (request.queryString.support.length !== require('../../demo/demo.js').Configs.support.length) {
                moduleInfo.support = request.queryString.support.join("|");
            } else {
                moduleInfo.support = '';
            }
        }

        if (request.queryString.ignore) {
            moduleInfo.ignore = request.queryString.hide == "on";
        }

        updateModuleInfo(request.queryString.path, request.queryString.title, moduleInfo);
        //redirect(context);
        break;
    case 'getlist':
        var list = getModuleList(request.queryString.type || require('../../demo/demo.js').Configs.src);
        writeJsonp(context, list);
        break;
    default:
        redirect(context);
        break;

}

response.end();



function writeJsonp(context, data) {

    data = JSON.stringify(data);

    if (context.request.queryString.callback) {
        context.response.write(context.request.queryString.callback + '(' + data + ')');
    } else {
        context.response.write(data);
    }

}

function redirect(context, url) {

    url = url || context.request.queryString.postback;

    if (url) {

        if (!/^http:/.test(url)) {
            url = url.replace(/^file:\/\/\//, '').replace(/\\/g, "/");
            var Demo = require('../../demo/demo.js');
            url = url.replace(Demo.basePath.replace(/\\/g, "/"), Demo.Configs.serverBaseUrl);
            context.response.redirect(url);

        } else {
            context.response.redirect(url);
        }

    }

}

/**
 * 新建一个模块。
 * @param {String} path 组件的路径。如 styles/core/base
 * @param {String} tpl 组件的模板。如 js 或 css 或 cssjs
 * @param {String} [title] 组件的描述名。默认使用 *path* 作为描述 。
 */
function createModule(path, tpl, title) {

    // 忽略空参数。
    if (!path) {
        return Path.resolve(Doc.basePath, Doc.Configs.folders.demos.path);
    }

    // 确定模块文件路径。
    var tplFolder = Path.resolve(__dirname, templatePath);
    var tplFile = Path.resolve(tplFolder, tpl + docExtName);
    if (!IO.existsFile(tplFile)) {
        tplName = 'cssjs';
        tplFile = Path.resolve(tplFolder, tplName + docExtName);
        if (!IO.existsFile(tplFile)) {
            return Path.resolve(Doc.basePath, Doc.Configs.folders.demos.path, path + docExtName);
        }
    }

    // 确定目标文件路径。
    var targetPath = Path.resolve(Doc.basePath, Doc.Configs.folders.demos.path, path + Path.extname(tplFile));
    var basePathRelative = Path.relative(Path.dirname(targetPath), Doc.basePath).replace(/\\/g, "/");

    // 读取模板内容。
    var content = IO.readFile(tplFile);

    // 如果存在 tpl.* ，则复制 tpl.* 。
    content = content.replace(/~/g, basePathRelative).replace(/tpl\.\w+/g, function (file) {
        var fromPath = Path.resolve(tplFolder, file);
        if (!IO.exists(fromPath)) {
            fromPath = fromPath.replace(/\.css$/, '.less');
            if (!IO.exists(fromPath)) {
                return file;
            }
        }

        var toName = Doc.Configs.folders.sources.path + "/" + path + Path.extname(file);
        var toPath = Path.resolve(Doc.basePath, Doc.Configs.folders.sources.path + "/" + path + Path.extname(fromPath));

        if (!IO.exists(toPath)) {
            IO.copyFile(fromPath, toPath);
        }

        return basePathRelative + "/" + toName;
    });

    content = content.replace(/<title>.*?<\/title>/, "<title>" + (title || path) + "</title>");

    // 写入文件。
    if (!IO.exists(targetPath)) {
        IO.writeFile(targetPath, content, Doc.Configs.encoding);
    }

    updateModuleList();

    return targetPath;

}

/**
 * 删除一个组件文件。
 * @param {String} module 组件的模块。
 * @param {String} category 组件的分类。
 * @param {String} name 组件的名字。
 */
function deleteModule(path) {

    // 忽略空参数。
    if (!path) {
        return;
    }

    deleteFileByName(Path.resolve(Doc.basePath, Doc.Configs.folders.demos.path, path));
    deleteFileByName(Path.resolve(Doc.basePath, Doc.Configs.folders.sources.path, path));

    updateModuleList();

};

/**
 * 更新指定的列表缓存文件。
 */
function updateModuleList() {

    // 获取用于获取拼音的函数。
    var getPinYin = getPinYinFn();

    /**
     * 获取指定文件夹内的所有 HTML 文件。
     */
    function getAllHtmlFiles(folder, level, parentPath, parent, specail) {
        var files = FS.readdirSync(folder),
            result = [];

        for (var i = 0, file; file = files[i]; i++) {

            var fullPath = folder + Path.sep + file,
                moduleInfo;

            // 如果是文件夹递归搜索。
            if (FS.statSync(fullPath).isDirectory()) {

                // 不处理特殊文件夹。
                if (/^(node_|templates$|test$|_|\.)/.test(file)) {
                    continue;
                }

                moduleInfo = {
                    parent: parent,
                    title: file,
                    level: 0
                };

                moduleInfo.children = getAllHtmlFiles(fullPath, level + 1, parentPath + file + '/', moduleInfo, specail);

                if (!moduleInfo.children.length) {
                    continue;
                }

                // 只处理 HTML 文件。
            } else if (Path.extname(file) === docExtName) {

                moduleInfo = getModuleInfo(fullPath);
                moduleInfo.title = moduleInfo.title || file;

                // 由子节点设置父节点属性。
                for (var key in moduleInfo) {
                    if (/^parent-/.test(key)) {
                        var pt = parent,
                            pk = key.substr("parent-".length);

                        while (/^parent-/.test(pk) && pt.parent) {
                            pk = pk.substr("parent-".length);
                            pt = pt.parent;
                        }

                        pt[pk] = moduleInfo[key];
                        delete moduleInfo[key];
                    }
                }

            } else {
                continue;
            }

            if (moduleInfo.ignore === "true" || moduleInfo.ignore === "1") {
                continue;
            }

            if (moduleInfo.order && moduleInfo.order !== "^") {
                moduleInfo.order = parentPath + moduleInfo.order;
            }

            moduleInfo.path = parentPath + file;
            moduleInfo.name = parentPath + file.replace(/\..*$/, '');

            moduleInfo.titlePinYin = getPinYin(moduleInfo.title, false, ' ').toLowerCase();
            if (moduleInfo.keywords) {
                moduleInfo.keywordsPinYin = getPinYin(moduleInfo.keywords, false, ' ').toLowerCase();
            }
            if (moduleInfo.contents) {
                moduleInfo.contentsPinYin = getPinYin(moduleInfo.contents, false, ' ').toLowerCase();
            }
            result.push(moduleInfo);

        }

        return sort(result);

    }

    /**
     * 解析一个 HTML 文件内指定的组件信息。
     * @param {String} filePath 文件路径。
     */
    function getModuleInfo(filePath) {
        var content = IO.readFile(filePath, Doc.Configs.encoding);
        var match = reModuleInfo.exec(content);
        var moduleInfo = match && Doc.Utility.parseModuleInfo(match[4]) || {};
        moduleInfo.title = (/(<title[^\>]*?>)(.*?)(<\/title>)/i.exec(content) || [])[2];
        moduleInfo.author = (/<meta\s+name\s*=\s*"author"\s+content=\s*"([^"]*)"\s*>/i.exec(content) || [])[1] || '';
        moduleInfo.keywords = (/<meta\s+name\s*=\s*"keywords"\s+content=\s*"([^"]*)"\s*>/i.exec(content) || [])[1] || '';
        moduleInfo.contents = [];
        content.replace(/<h(2)>(.*?)<\/h\1>/g, function (h2, _, c) {
            c = c.replace(/<[^>]*>/g, '');
            c = c.replace('源码: ', ' ');
            moduleInfo.contents.push(c);
        });
        moduleInfo.contents = moduleInfo.contents.join(',');
        return moduleInfo;
    }

    function sort(list) {

        function processOne(item) {

            // 将其从数组中删除，表示元素已处理。
            list.splice(list.indexOf(item), 1);

            // 置顶模块。
            if (item.order === '^') {
                newList.unshift(item);
                return;
            }

            // 插入到前置项后面。
            if (item.order) {

                // 确保前置项已经被插入到列表。
                for (var i = 0; i < list.length; i++) {
                    if (list[i].name === item.order) {
                        processOne(list[i]);
                        break;
                    }
                }

                // 插入到前置项后面。
                for (var i = newList.length - 1; i >= 0; i--) {
                    if (newList[i].name === item.order) {
                        newList.splice(i + 1, 0, item);
                        return;
                    }
                }
            }

            // 如果没有合理位置则插入到末尾。
            newList.push(item);
        }

        var newList = [];

        while (list.length) {
            processOne(list[0]);
        }

        return newList;

    }

    function walkList(parent, result) {
        var level = 0;
        for (var i = 0; i < parent.length; i++) {
            result[parent[i].path] = parent[i];
            if (parent[i].children) {
                parent[i].childCount = parent[i].children.length;
                parent[i].level = walkList(parent[i].children, result) + 1;
                level = Math.max(level, parent[i].level);
            }
            delete parent[i].parent;
            delete parent[i].children;
        }
        delete result["index.html"];
        return level;
    }

    var demos = getAllHtmlFiles(Doc.basePath + Doc.Configs.folders.demos.path, 0, ''),
        docs = getAllHtmlFiles(Doc.basePath + Doc.Configs.folders.docs.path, 0, ''),
        tools = getAllHtmlFiles(Doc.basePath + Doc.Configs.folders.tools.path, 0, '', true),
        finalList = {
            demos: {},
            docs: {},
            tools: {},
        };

    walkList(demos, finalList.demos);
    walkList(docs, finalList.docs);
    walkList(tools, finalList.tools);

    context.response.contentType = 'text/html;charset=utf-8'
    context.response.write(JSON.stringify(finalList));

    IO.writeFile(Path.resolve(Doc.basePath, Doc.Configs.indexPath), 'Doc.initList(' + JSON.stringify(finalList) + ');', Doc.Configs.encoding);
};

/**
 * 更新一个组件信息。
 * @param {String} module 组件的模块。
 * @param {String} category 组件的分类。
 * @param {String} title 组件的描述名。如果不需要更改，则置为 null 。
 * @param {Object} moduleInfo 组件的属性。如果不需要更改，则置为 null 。
 */
function updateModuleInfo(htmlPath, title, moduleInfo) {

    // 忽略空参数。
    if (!htmlPath) {
        return;
    }

    htmlPath = Path.resolve(Doc.Configs.basePath, htmlPath);

    if (!IO.exists(htmlPath)) {
        return;
    }

    var content = IO.readFile(htmlPath, Doc.Configs.encoding);

    // 找到 <head>。
    var head = (/<head>([\s\S]*?)<\/head>/.exec(content) || [0, content])[1],
        oldHead = head;

    // 描述存入 <title> 标签。
    if (title) {
        if (moduleInfo && ('title' in moduleInfo)) {
            moduleInfo.title = title;
        } else {
            var titleMatch = /(<title[^\>]*?>)(.*?)(<\/title>)/.exec(head);
            if (!titleMatch) {
                head = '<title>' + title + '</title>' + head;
            } else {
                head = head.replace(titleMatch[0], titleMatch[1] + title + titleMatch[3]);
            }
        }
    }

    // moduleInfo 存入 meta 标签。
    if (moduleInfo) {
        var metaMatch = reModuleInfo.exec(head);

        if (metaMatch) {
            var oldModuleInfo = Doc.Module.parseModuleInfo(metaMatch[4]);
            require('utilskit/helpers').extend(oldModuleInfo, moduleInfo);
            moduleInfo = oldModuleInfo;
        }

        // 简化数据。
        if (!moduleInfo.support) {
            delete moduleInfo.support;
        }

        if (moduleInfo.status === "ok") {
            delete moduleInfo.status;
        }

        moduleInfo = Doc.Module.stringifyModuleInfo(moduleInfo);

        if (metaMatch) {
            head = head.replace(metaMatch[0], moduleInfo ? metaMatch[1] + moduleInfo + metaMatch[5] : "");
        } else if (moduleInfo) {
            var titleMatch = /(\s*)(<title[^\>]*?>.*?<\/title>)/m.exec(head);
            if (titleMatch) {
                head = head.replace(titleMatch[0], titleMatch[1] + '<meta name="' + Doc.Configs.moduleInfo + '" content="' + moduleInfo + '\">' + titleMatch[0]);
            } else {
                head = '<meta name="' + Doc.Configs.moduleInfo + '" content="' + moduleInfo + '\">' + head;
            }
        }

    }

    content = content.replace(oldHead, head);

    IO.writeFile(htmlPath, content, Doc.Configs.encoding);

    updateModuleList();
};

function getPinYinFn() {
    if (!this.getPinYin) {
        try {
            var src = IO.readFile(Path.resolve(Doc.basePath + "/" + Doc.Configs.folders.sources.path + '/utility/text/pinYin.js'));
            eval(src);
            this.getPinYin = getPinYin;
        } catch (e) { }
    }
    return this.getPinYin;
}

function getFileByName(path) {
    var folder = Path.dirname(path);
    var name = Path.basename(path, ".html");
    var files = FS.readdirSync(folder);
    for (var i = 0; i < files.length; i++) {
        if (files[i] === name + Path.extname(files[i])) {
            return Path.resolve(folder, files[i]);
        }
    }
}

function deleteFileByName(path) {
    var folder = Path.dirname(path);
    var name = Path.basename(path, ".html");
    var files = FS.readdirSync(folder);
    for (var i = 0; i < files.length; i++) {
        if (files[i] === name + Path.extname(files[i])) {
            IO.deleteFile(Path.resolve(folder, files[i]));
        }
    }
}
