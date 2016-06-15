/**
 * 表示一个升级的 TypeScript 编译器。
 */
var ts = require("typescript");
var transpiler_1 = require("./transpiler");
// 重写 createProgram 函数以添加转换。
var createProgram = ts.createProgram;
ts.createProgram = function (rootNames, options, host, oldProgram) {
    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;
    // 编译。
    var program = createProgram.apply(this, arguments);
    // 语法转换。
    return transpiler_1.transpile(program, options);
};
module.exports = ts;
//# sourceMappingURL=compiler.js.map