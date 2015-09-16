var xfly = require('xfly');

var baseUrl = __dirname;

var commonRules = [{
	src: "*.less",
	process: require("xfly-less"),
	dest: "$1.css"
}, {
	src: "*.es",
	process: require("xfly-es6"),
	dest: "$1.js"
}];

// 打包发布项目。
exports.dist = function(){
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
exports.watch = function(){
	xfly.watch({	
		src: baseUrl,
		rules: commonRules
	});
};

// 启动服务器。
exports.server = function(){
	xfly.startServer({	
		src: baseUrl,
        url: require('doc/doc.js').serverUrl,
		rules: commonRules
	});
};
