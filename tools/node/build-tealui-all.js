var xfly = require('xfly');

xfly.srcPath = __dirname + "/../";

xfly.src("*.es").pipe(require("xfly/plugins/es6")());
xfly.src("*.less").pipe(require("xfly/plugins/less")());
xfly.src("*.md").pipe(require("xfly/plugins/markdown")());

xfly.src("../dist/teal-all.config.js")
	.pipe(require("xfly/plugins/requirex")())
	.dest("../dist/teal-all.js", "../dist/teal-all.css");

xfly.task('build', function () {
	xfly.build();
});

xfly.task('watch', function () {
	xfly.watch();
});

xfly.task('default', function () {
	xfly.startServer(require('../doc/doc.js').serverUrl);
});
