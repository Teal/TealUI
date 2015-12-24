function globalShim(paths) {
    paths = paths || [process.execPath.replace(/([\/\\])[^\/\\]*$/, '$1node_modules')];
    var Module = module.constructor;
    if (!Module._resolveLookupPaths) {
        throw new Error("globalShim is currently not supported for Nodejs " + process.version);
    }
    Module.__resolveLookupPaths = Module._resolveLookupPaths;
    Module._resolveLookupPaths = function (request, parent) {
        var result = Module.__resolveLookupPaths(request, parent);
        var start = request.substring(0, 2);
        if (start !== './' && start !== '..') {
            result[1].push.apply(result[1], paths);
        }
        return result;
    };
}

globalShim();

var xfly = require('xfly');

var baseUrl = __dirname;

var commonRules = [];

// 打包发布项目。
exports.dist = function () {
    xfly.build({
        src: baseUrl,
        rules: commonRules.concat([
			{
			    src: "/dist/*.config.js",
			    process: require("xfly-require"),
			    dest: ["/dist/$1.js", "/dist/$1.css", "../dist/"]
			}
        ])
    });
};

// 监听文件生成。
exports.watch = function () {
    xfly.watch({
        src: baseUrl,
        rules: commonRules
    });
};

// 启动服务器。
exports.server = function () {
    xfly.startServer({
        src: baseUrl,
        url: require('doc/doc.js').serverUrl,
        rules: commonRules
    });
};

// 支持命令行任务。
xfly.cmd();