
var Path = require('path'),
	IO = require('utilskit/io'),
	FS = require('fs'),
    Doc = require('../doc/doc.js');

/**
 * 文档文件的扩展名。
 */
const docExtName = '.html';

var reModuleInfo = new RegExp('(<meta\\s+name\\s*=\\s*([\'\"])' + Doc.moduleInfo + '\\2\\s+content\\s*=\\s*([\'\"]))(.*?)(\\3\\s*\\/?>)', 'i');

/**
 * 更新指定的列表缓存文件。
 */
function generateModuleList() {

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
        var content = IO.readFile(filePath, Doc.encoding);
        var match = reModuleInfo.exec(content);
        var moduleInfo = match && Doc.parseModuleInfo(match[4]) || {};
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
            var item = parent[i];
            result[item.path] = item;
            if (item.children) {
                item.childCount = item.children.length;
                item.level = walkList(item.children, result) + 1;
                level = Math.max(level, item.level);
            }
            delete item.order;
            delete item.parent;
            delete item.children;
            delete item.path;
            if (!item.keywords) {
                delete item.keywords;
            }
            if (item.status === "done") {
                delete item.status;
            }
        }
        delete result["index.html"];
        return level;
    }

    var src = getAllHtmlFiles(Doc.basePath + "src", 0, ''),
        docs = getAllHtmlFiles(Doc.basePath + "docs", 0, ''),
        assets = getAllHtmlFiles(Doc.basePath + "assets", 0, '', true),
        finalList = {
            src: {},
            docs: {},
            assets: {},
        };

    walkList(src, finalList.src);
    walkList(docs, finalList.docs);
    walkList(assets, finalList.assets);

    return finalList;
};

function getPinYinFn() {
    if (!this.getPinYin) {
        try {
            var src = IO.readFile(Path.resolve(Doc.basePath, 'src/utility/text/pinYin.js'));
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

var finalList = generateModuleList();

context.response.contentType = 'text/javascript;charset=utf-8';
context.response.write('Doc.moduleList = ' + JSON.stringify(finalList));

IO.writeFile(Path.resolve(Doc.basePath, Doc.indexPath), 'Doc.moduleList = ' + JSON.stringify(finalList), Doc.encoding);

context.response.end();