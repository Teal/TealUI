/**
 * 载入一个模块。
 * @param {string | string[]} path 要载入的模块路径。
 * @param {Function} [callback] 模块载入后的回调函数。
 * @return 返回模块的导出项。
 */
function require(path, callback) {
    if (typeof path === "string") {
        var exports = require._ensure(require.toUrl(path), callback).exports;
        return exports != null && exports.__esModule && exports.default !== undefined ? exports.default : exports;
    }
    require._load({
        deps: path,
        factory: callback,
        callbacks: []
    });
}
/**
 * 解析指定模块的实际地址。
 * @param {string} path 要解析的模块路径。
 * @param {string} [base] 解析的基路径。
 * @return 返回已解析的模块实际地址。
 */
require.toUrl = function (path, base) {
    path = require.alias[path] || path;
    if (path == "_") {
        return null;
    }
    var anchor = require._anchor || (require._anchor = document.createElement("a"));
    anchor.href = /(^|:\/)\//.test(path) ? path : (path.charCodeAt(0) === 46 /*.*/ ? base ? base + "/../" + path : path : require.baseUrl + path.replace(/^([^\/]+)\/([^\/\.]+)$/, "$1/$2/$2")).replace(/(^|\/)([^\/\.]+)$/i, "$1$2" + (/^typo\//i.test(path) ? ".css" : ".js")).replace(/\.(sc|le)ss$/i, ".css").replace(/\.(jsx|tsx?)$/i, ".js");
    return anchor.href;
};
/**
 * 模块别名列表。
 */
require.alias = { __proto__: null };
/**
 * 获取当前正在执行的脚本的绝对路径。
 * @return 返回绝对路径。
 */
require.getCurrentScript = function () {
    var currentScript = document.currentScript || require._currentScript;
    if (!currentScript) {
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length; --i >= 0;) {
            currentScript = scripts[i];
            if (currentScript.src) {
                break;
            }
        }
    }
    return currentScript.src;
};
/**
 * 所有模块的基路径。
 */
require.baseUrl = require.getCurrentScript().replace(/\/[^\/]*([?#].*)?$/, "/");
/**
 * 请求模块时在地址后追加的参数。
 */
require.urlArgs = "";
require._ensure = function (url, callback) {
    if (!url) {
        callback && callback();
        return {};
    }
    var module = require.modules[url];
    if (!module) {
        module = {};
        var actualUrl = url + require.urlArgs;
        if (/\.css(\?|$)/i.test(url)) {
            require.css(actualUrl);
            callback && callback();
        }
        else {
            module.callbacks = [callback];
            require.js(actualUrl, function () {
                require._load(module, url);
            });
        }
        require.modules[url] = module;
    }
    else if (module.callbacks) {
        module.callbacks.push(callback);
    }
    else if (!module.factory) {
        callback && callback(module.exports);
    }
    else {
        module.callbacks = [callback];
        require._load(module, url);
    }
    return module;
};
require.modules = {};
require.css = function (path) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    (document.head || document.getElementsByTagName("head")[0] || document.body || document.documentElement).appendChild(link);
};
require.js = function (path, callback) {
    if (require._currentScript) {
        require._pendingJs.push({ path: path, callback: callback });
        return;
    }
    var script = document.createElement("script");
    script.async = true;
    script.onload = script.onreadystatechange = function () {
        var readyState = script.readyState;
        if (readyState == undefined || readyState == "loaded" || readyState == "complete") {
            script.onload = script.onreadystatechange = null;
            callback && callback();
            if (require._currentScript) {
                delete require._currentScript;
                var js = require._pendingJs.shift();
                if (js) {
                    require.js(js.path, js.callback);
                }
            }
        }
    };
    script.src = path;
    var scripts = document.getElementsByTagName("script");
    var last = scripts[scripts.length - 1];
    last.parentNode.insertBefore(script, last.nextSibling);
    if (!("currentScript" in document)) {
        require._currentScript = script;
        require._pendingJs = require._pendingJs || [];
    }
};
require._load = function (module, url) {
    var pending = 1;
    var depModules = [];
    var resolve = function () {
        if (--pending < 1) {
            var factory = module.factory;
            if (factory) {
                delete module.factory;
                for (var i = 0; i < depModules.length; i++) {
                    depModules[i] = depModules[i].exports;
                }
                var exports = factory.apply(void 0, depModules);
                if (exports != undefined) {
                    module.exports = exports;
                }
            }
            for (var _i = 0, _a = module.callbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback && callback(module.exports);
            }
            delete module.callbacks;
        }
    };
    if (module.deps) {
        for (var _i = 0, _a = module.deps; _i < _a.length; _i++) {
            var dep = _a[_i];
            depModules.push(dep == "require" ? {
                exports: function (path) { return require(path, url); }
            } : dep == "exports" ? module : (pending++, require._ensure(require.toUrl(dep, url), resolve)));
        }
    }
    resolve();
};
/**
 * 定义一个模块。
 * @param {string} [path] 模块的路径。
 * @param {string[]} [deps] 模块的依赖项。
 * @param {Function} factory 模块的内容。
 * @return 返回定义的模块。
 */
function define(path, deps, factory) {
    if (typeof path == "function") {
        deps = path;
        path = [];
    }
    if (typeof deps == "function") {
        factory = deps;
        if (typeof path == "string") {
            deps = [];
        }
        else {
            deps = path;
            path = require.getCurrentScript();
        }
    }
    path = require.toUrl(path);
    var module = require.modules[path] || (require.modules[path] = {});
    module.deps = deps;
    module.factory = factory;
    module.exports = {};
    return module;
}
define.amd = {
    provider: "TealUI"
};
//# sourceMappingURL=require.js.map