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
    Doc = require('../../../assets/doc.js');

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

};

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
function updateModuleList(folderName) {

    // 不提供参数则更新全部文件夹。
    if (!folderName) {
        for (var folderName in Doc.Configs.folders) {
            updateModuleList(folderName);
        }
        return;
    }

    var getPinYin = getPinYinFn();

    // 区分是否是源码。
    var isSrc = folderName === 'sources';
    var folder = Path.resolve(Doc.basePath, Doc.Configs.folders[folderName].path);

    var moduleList = [];

    // 只扫描前两层文件夹。
    var folders = FS.readdirSync(folder);
    for (var i = 0; i < folders.length; i++) {
        var folderPath = folder + Path.sep + folders[i];
        if (FS.statSync(folderPath).isDirectory()) {
            var categoryInfo = {
                title: folders[i],
                path: folders[i],
                name: folders[i].replace(/\..*$/, ''),
                children: [], toString: function () { return this.name }
            };

            var files = FS.readdirSync(folderPath);
            for (var j = 0; j < files.length; j++) {
                var filePath = folderPath + Path.sep + files[j];
                if (FS.statSync(filePath).isFile()) {

                    var moduleInfo;

                    if (isSrc) {

                        moduleInfo = {};

                    } else {

                        if (Path.extname(filePath) !== docExtName) {
                            continue;
                        }

                        // 读取模块信息。忽略强制忽略的模块。
                        moduleInfo = getModuleInfo(filePath, files[j]);

                    }

                    // 由子节点设置父节点属性。
                    for (var key in moduleInfo) {
                        if (/^parent-/.test(key)) {
                            categoryInfo[key.substr("parent-".length)] = moduleInfo[key];
                            delete moduleInfo[key];
                        }
                    }

                    moduleInfo.path = folders[i] + '/' + files[j];
                    moduleInfo.name = files[j].replace(/\..*$/, '');

                    if (moduleInfo.ignore === "true" || moduleInfo.ignore === "1") {
                        continue;
                    }

                    if (getPinYin) {
                        moduleInfo.titlePinYin = getPinYin(moduleInfo.title, ' ').toLowerCase();
                        if (moduleInfo.tags) {
                            moduleInfo.tags += ';' + getPinYin(moduleInfo.tags).toLowerCase() + getPinYin(moduleInfo.tags, true).toLowerCase();
                        }
                    }

                    // 添加到当前模块。
                    categoryInfo.children.push(moduleInfo);

                }
            }

            // 隐藏分类信息。
            if (categoryInfo.ignore === "true" || categoryInfo.ignore === "1") {
                continue;
            }

            if (getPinYin) {
                categoryInfo.titlePinYin = getPinYin(categoryInfo.title, ' ').toLowerCase();
                if (categoryInfo.tags) {
                    categoryInfo.tags += ';' + getPinYin(categoryInfo.tags).toLowerCase() + getPinYin(categoryInfo.tags, true).toLowerCase();
                }
            }

            if (categoryInfo.children.length) {
                categoryInfo.children = sortArray(categoryInfo.children);
                moduleList.push(categoryInfo);
            }

        }
    }
    moduleList = sortArray(moduleList);

    context.response.contentType = 'text/html;charset=utf-8'
    folderName === 'demos' && context.response.write(JSON.stringify(moduleList))
    IO.writeFile(Path.resolve(Doc.basePath, Doc.Configs.listsPath, Doc.Configs.folders[folderName].path + '.js'), 'Doc.Page.initList(' + JSON.stringify(moduleList) + ');', Doc.Configs.encoding);

    function sortArray(list) {
        var newList = [];

        while (list.length) {
            processOne(list[0]);
        }

        return newList;

        function processOne(item) {

            // 将其从数组中删除，表示元素已处理。
            list.splice(list.indexOf(item), 1);

            // 置顶模块。
            if (item.order ? item.order === '^' : item['parent-order']) {
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

    }

};

/**
 * 解析一个 HTML 文件内指定的组件信息。
 * @param {String} filePath 文件路径。
 */
function getModuleInfo(filePath, modulePath) {
    var content = IO.readFile(filePath, Doc.Configs.encoding);
    var match = reModuleInfo.exec(content);
    var moduleInfo = match && Doc.ModuleInfo.parse(match[4]) || {};
    moduleInfo.title = (/(<title[^\>]*?>)(.*?)(<\/title>)/i.exec(content) || [])[2] || modulePath;
    return moduleInfo;
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
        var src = IO.readFile(Path.resolve(Doc.basePath + "/" + Doc.Configs.folders.sources.path + '/utility/pinYin.js'));
        eval(src);
        this.getPinYin = getPinYin;
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
