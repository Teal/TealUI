/**
 * 转换指定的程序。
 * @param program 要转换的程序。
 * @param options 转换的选项。
 */
function transpile(program, options) {
    var checker = program.getTypeChecker();
    // 处理每个源文件。
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        visitSourceFile(sourceFile);
    }
    /**
     * 处理一个文件。
     * @param sourceFile 要处理的文件。
     */
    function visitSourceFile(sourceFile) {
        sourceFile;
        debugger;
    }
    return program;
}
exports.transpile = transpile;
//# sourceMappingURL=translator.js.map