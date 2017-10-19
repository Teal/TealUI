/**
 * @fileOverview 同步模块加载器。
 * @author xuld
 */

/**
 * 快速导入一个脚本、样式或 HTML 片段。
 * @param {String} modulePath 要载入的模块路径，模块路径相对于当前文件路径。
 * @param {Boolean} [async=false] 指示是否异步载入模块。
 */
function include(modulePath, async) {

    // 检查扩展名。如果未写扩展名，则同时载入对应的 JS 和 CSS。
    var pathParts = /^(.*)\.(.*)$/.exec(modulePath);
    if (!pathParts) {
        include(modulePath + ".css");
        include(modulePath + ".js");
        return;
    }

    // 获取当前相对基路径。
    var basePath = include._basePath;
    if (!basePath) {
        basePath = document.getElementsByTagName("script");
        basePath = basePath[basePath.length - 1].src;
    }

    // 转换模块路径为绝对路径。
    var link = document.createElement("a");
    link.href = basePath.replace(/\/[^\/]*$/, '/' + modulePath);
    modulePath = link.href;

    // 判断是否重复加载。
    include._loaded = include._loaded || {};
    if (modulePath in include._loaded) {
        return;
    }

    include._loaded[modulePath] = true;

    // 判断是否存在同名脚本或样式。
    if (/^(js|css)$/i.test(pathParts[2])) {
        var js = pathParts[2].length < 3;
        var nodes = document.getElementsByTagName(js ? "script" : "link");

        for (var i = 0; nodes[i]; i++) {
            if (nodes[i][js ? 'src' : 'href'] === modulePath) {
                return;
            }
        }
    }

    // 读取 CSS 文件。
    if (/^css$/i.test(pathParts[2])) {
        var link = document.getElementsByTagName("HEAD")[0].appendChild(document.createElement('link'));
        link.href = modulePath;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        return;
    }

    var sourceCode;

    // 同步读取数据。
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", modulePath, !!async);
    xmlHttp.send(null);

    function isErrorStatus(status) {
        return (status < 200 || status >= 300) && status !== 304 && status !== 1223;
    }

    if (async) {
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && !isErrorStatus(xmlHttp.status)) {
                var sourceCode = xmlHttp.responseText;
            }
        };
    }

    var status = xmlHttp.status;

    // 检查相应状态。
    if (isErrorStatus(status)) {
        return;
    }

    // 读取源码。
    var sourceCode = xmlHttp.responseText;
    if (/^js/i.test(pathParts[2])) {
        var oldPath = include._basePath;
        include._basePath = modulePath;
        try {
            if (window.execScript) {
                window.execScript(sourceCode);
            } else {
                window["eval"].call(window, sourceCode);
            }
        } finally {
            include._basePath = oldPath;
        }
    } else {
        document.write(sourceCode);
    }
}

/**
 * 支持 include.js?a.js 用法。
 */
(function () {
    /**
     * Boot.js - A synchroniaed module loader for browsers.
     */

    var bootjs = (function (window) {

        /**
         * Get the absolute url of specified script or link node.
         */
        function getAbsoluteUrl(node, attrName) {
            // Use getAttribute('src', 4) instead in IE 6-7 to get absolute url.
            return ((isStd ? node[attrName] : node.getAttribute(attrName, 4)) || "").replace(/[\?#].*$/, "");
        }

        /**
         * Get the content of the specified url synchronously.
         */
        function loadContent(url) {

            // Create new XMLHttpRequest instance(use ActiveXObject instead in IE 6-8).
            var xmlHttp = +"\v1" ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
                status;

            try {

                xmlHttp.open("GET", url, false);
                xmlHttp.send(null);
                status = xmlHttp.status;

                // Check http status.
                if ((status >= 200 && status < 300) || status == 304 || status == 1223) {
                    return xmlHttp.responseText;
                }

                status = 'Network Error(' + status + ')';

            } catch (e) {

                status = window.location.protocol === 'file:' ? "This page is using file:// protocol, use http:// instead." : e.toString();

            } finally {

                // Release memory.
                xmlHttp = null;
            }

            // Print the error if console available.
            if (window.console && console.error) {
                console.error("File Load Error: " + url + "\r\n\tMessage: " + status);
            }

            return "";

        }

        /**
         * Get the actually url of specified module path.
         */
        function toUrl(modulePath, currentPath) {

            modulePath = modulePath.replace(/\\|\/\//g, "/");

            // If modulePath is relative path. Concat modulePath with basePath.
            if (modulePath.charAt(0) === '.') {
                modulePath = currentPath + "/" + modulePath;
            } else if (!/:\/\//.test(modulePath)) {
                modulePath = bootjs.basePath + "/" + modulePath;
            }

            // Remove "/./" in path
            modulePath = modulePath.replace(/\/(\.\/)+/g, "/");

            // Remove "/../" in path
            while (/\/[^\/]+\/\.\.\//.test(modulePath)) {
                modulePath = modulePath.replace(/\/[^\/]+\/\.\.\//, "/");
            }

            return modulePath;
        }

        function loadModule(moduleUrl) {

            var requires = [],
                imports = [],
                sourceCode = loadContent(moduleUrl).replace(/^(\s*)\/[\/\*]\s*#(\w+)\s+(.*)$/gm, function (all, indent, macro, args) {
                    switch (macro) {
                        case 'include':

                            args = toUrl(args, moduleUrl);

                            // Add .js automaticly if no extension is found.
                            if (!/\.[^\/]*$/.test(args)) {
                                args += ".js";
                            }

                            // Ensure all modules are loaded once.
                            if (!(args in modules)) {
                                args = loadModule(args);
                                requires.push.apply(requires, args.requires);
                                imports.push.apply(imports, args.imports);
                            }
                            break
                        case 'import':
                        case 'imports':
                            args = toUrl(args, moduleUrl);

                            // Add .css automaticly if no extension is found.
                            if (!/\.[^\/]*$/.test(args)) {
                                args += ".css";
                            }

                            // Ensure all modules are loaded once.
                            if (!(args in modules)) {
                                imports.push(args);
                            }
                            break;
                        case 'exclude':
                        case 'included':
                            modules[toUrl(args, moduleUrl)] = false;
                            break;
                        case 'assert':
                            return indent + replaceAssert(args)
                        case 'deprected':
                            return indent + 'if(window.console && console.warn) console.warn("' + (args.replace(/\"/g, "\\\"") || "This function is deprected.") + '")';
                    }

                    return all;
                }),
                moduleInfo = {
                    url: moduleUrl,
                    requires: requires,
                    imports: imports,
                    sourceCode: sourceCode
                };

            requires.push(moduleInfo);

            modules[moduleUrl] = moduleInfo;

            return moduleInfo;
        }

        function init() {

            var currentUrl = (location.protocol + '//' + location.host + location.pathname).replace(/\/[^\/]*$/, ""), nodes, i, node, mainModule;

            nodes = document.getElementsByTagName("script");
            node = nodes[nodes.length - 1];

            bootjs.debug = node.getAttribute('data-debug') === "true";
            bootjs.basePath = node.getAttribute('data-base');
            bootjs.mainModule = node.getAttribute('data-main');

            bootjs.basePath = bootjs.basePath || getAbsoluteUrl(node, 'src').replace(/\/[^\/]*$/, "");

            nodes = document.getElementsByTagName("SCRIPT");
            for (i = 0; node = nodes[i]; i++) {
                if (node.src) {
                    modules[getAbsoluteUrl(node, "src")] = true;
                }
            }

            nodes = document.getElementsByTagName("LINK"), i;
            for (i = 0; node = nodes[i]; i++) {
                if (node.href) {
                    modules[getAbsoluteUrl(node, "href")] = true;
                }
            }

            if (bootjs.mainModule) {

                bootjs.mainModule = nodes = loadModule(toUrl(bootjs.mainModule, currentUrl));
                for (i = 0; i < nodes.imports.length; i++) {
                    node = nodes.imports[i];
                    document.write('<link rel="stylesheet" type="text/css" href="' + node + '">');
                }

                for (i = 0; i < nodes.requires.length; i++) {
                    node = nodes.requires[i];
                    document.write(bootjs.debug ? '\r\n<script type="text/javascript" src="' + node.url + '"></script>' : '\r\n<script type="text/javascript" data-src="' + node.url + '">\r\n' + node.sourceCode.replace(/<\/script>/gi, "<\\\/script>") + '\r\n</script>');
                }

            }
        }

        init();

        return bootjs;

    })(this);



})();