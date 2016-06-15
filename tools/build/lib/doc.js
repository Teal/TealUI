/**
 * @fileOverview 解析 md 文档。
 */
var Marked = require("marked");
module.exports = function md(file, options) {
    file.extension = ".html";
    var content = file.content;
    // 预处理特殊指令。
    // 编译 markdown。
    content = Marked(content, options);
    // 保存。
    file.content = content;
};
//# sourceMappingURL=doc.js.map