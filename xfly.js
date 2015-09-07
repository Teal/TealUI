var xfly = require('xfly');

var baseUrl = __dirname;

xfly.task('build-tealui-all', function () {
    xfly.build({
        src: baseUrl + "/dist/teal-all.config.js",
        rules: [
            {
                src: "dist/teal-all.config.js",
                dest: "dist/teal-all.js",
                process: require('xfly-require'),
                resources: "../dist/resources",
                images: "../dist/images",
                fonts: "../dist/fonts",
                js: "../dist/teal-all.js",
                css: "../dist/teal-all.css"
            }
        ]
    });
});

xfly.task('server', function () {
    xfly.startServer({
        src: baseUrl,
        url: require('doc/doc.js').serverUrl,
        rules: [
            {
                match: "*.css",
                process: function(context) {
                    

                   // 


                }
            }
        ]
    });
});

// 原始需求：
// .ES, .LESS 等实时编译
// 编译整个项目：先实时编译，然后重载路径并发布。

xfly.srcPath = __dirname + "/../";

xfly.src("*.es").pipe(require("xfly/plugins/es6")());
xfly.src("*.less").pipe(require("xfly/plugins/less")());
xfly.src("*.md").pipe(require("xfly/plugins/markdown")());

xfly.task('build', function () {
    xfly.build();
});

// xfly.task('release', function () {
// 	xfly.src("*.js").pipe(require("xfly/plugins/inline-css")()).pipe(require("xfly/plugins/compressjs")());
// 	xfly.src("*.css").pipe(require("xfly/plugins/inline-js")()).pipe(require("xfly/plugins/compresscss")());
// 	xfly.src("*.html").pipe(require("xfly/plugins/inline-html")());
// 	xfly.build();
// });

xfly.task('watch', function () {
    xfly.watch();
});

xfly.task('server', function () {
    xfly.startServer(require('../doc/doc.js').serverUrl);
});

xfly.task('default', 'server');