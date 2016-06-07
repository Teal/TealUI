"use strict";
var ts = require("typescript");
/**
 * 表示一个 TypeScript 编译器扩展。
 * - 完整支持 `.ts` 和 `ES7` 语法。
 * - 比官方的 TypeScript 生成更精简的代码。
 * - 支持打包 `import` 指令。
 * - 支持删除无用的 `export` 代码。
 * - 支持文档生成。
 * - 支持生成可全局使用的模块。
 * - 支持生成兼容 IE6 的模块。
 */
var TypeScriptCompiler = (function () {
    function TypeScriptCompiler() {
    }
    ///**
    // * 存储文档解析的结果。
    // */
    //private _result: ParseDocResult[];
    /**
     * 编译指定的文件。
     * @param fileNames
     * @param options
     * @param host
     * @param oldProgram
     */
    TypeScriptCompiler.prototype.compile = function (fileNames, options, host, oldProgram) {
        if (options === void 0) { options = {}; }
        this._program = ts.createProgram(fileNames, options, host, oldProgram);
        this._checker = this._program.getTypeChecker();
        for (var _i = 0, _a = this._program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            if (sourceFile.fileName.indexOf('.d.ts') < 0)
                this.translate(sourceFile);
        }
    };
    /**
     * 转换现有的语法树。
     * @param sourceFile 要转换的源码。
     */
    TypeScriptCompiler.prototype.translate = function (sourceFile) {
        var _this = this;
        ts.forEachChild(sourceFile, function (node) {
            console.log("->", _this._checker.getTypeAtLocation(node));
        });
    };
    TypeScriptCompiler.prototype.visitFunction = function (node) {
        node.type;
    };
    return TypeScriptCompiler;
}());
exports.TypeScriptCompiler = TypeScriptCompiler;
var c = new TypeScriptCompiler();
c.compile([require.resolve("./t.ts")]);
