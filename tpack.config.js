var tpack = require("tpack");

tpack.srcPath = "src/_bak";
tpack.destPath = "src/_bak2";

tpack.src("*.html").pipe(function (file) {
    file.content = require("to-markdown")(file.content, { gfm: true });
}).dest("$1.md");
tpack.src("*.js").dest("$1.ts");

//// 设置文件夹。
//tpack.srcPath = "src";
//tpack.destPath = "dest";

//// 设置全局忽略的路径。
//tpack.loadIgnore(".gitignore");
//tpack.ignore(".*", "_*", "$*", "*~", "tpack*");

//// 所有任务都需要先执行以下预编译的规则。
//tpack.src("*.scss", "*.sass").pipe(require("tpack-node-sass")).dest("$1.css");
//tpack.src("*.less").pipe(require("tpack-less")).pipe(require("tpack-autoprefixer")).dest("$1.css");
//tpack.src("*.es", "*.es6", "*.jsx").pipe(require("tpack-babel")).dest("$1.js");
//tpack.src("*.coffee").pipe(require("tpack-coffee-script")).dest("$1.js");
//tpack.src("*.md").pipe(require("tpack-node-markdown")).dest("$1.html");

//// 为 HTML 追加时间戳、内联，为 JS 打包 require 。
//tpack.src("*.html", "*.htm", "*.js", "*.css").pipe(require("tpack-assets"), {
//    resolveUrl: tpack.cmd !== "server"
//});

//// 压缩 CSS 和 JS。
//if (tpack.cmd === "build") {
//    tpack.src("*.css").pipe(require('tpack-clean-css'));
//    tpack.src("*.js").pipe(require('tpack-uglify-js'));
//}

//tpack.run();