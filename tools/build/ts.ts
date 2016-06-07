
import * as ts from "typescript";

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
export class TypeScriptCompiler {

    /**
     * 存储当前正在解析的程序。
     */
    private _program: ts.Program;

    /**
     * 存储当前使用的语义分析器。
     */
    private _checker: ts.TypeChecker;

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
    compile(fileNames: string[], options: ts.CompilerOptions = {}, host?: ts.CompilerHost, oldProgram?: ts.Program) {
        this._program = ts.createProgram(fileNames, options, host, oldProgram);
        this._checker = this._program.getTypeChecker();

        for (const sourceFile of this._program.getSourceFiles()) {
            if (sourceFile.fileName.indexOf('.d.ts') < 0)
                this.translate(sourceFile);
        }
    }

    /**
     * 转换现有的语法树。
     * @param sourceFile 要转换的源码。
     */
    private translate(sourceFile: ts.SourceFile) {
        ts.forEachChild(sourceFile, node => {
            console.log("->", this._checker.getTypeAtLocation(node));
        });
    }

    private visitFunction(node: ts.FunctionLikeDeclaration) {
        node.type
    }

    ///**
    // * 解析指定的程序中所有文档。
    // * @param program 要解析的程序。
    // */
    //parse(program: ts.Program) {
    //    this._program = program;
    //    this._result = [];

    //    for (let sourceFile of program.getSourceFiles()) {
    //        if (sourceFile.fileName.indexOf('.d.ts') < 0)
    //            this._result.push(this.parseDoc(sourceFile));
    //    }

    //    return this._result;
    //}

    //parseDoc(sourceFile: ts.SourceFile) {
    //    result = {
    //        fileName: sourceFile.fileName,
    //        docs: []
    //    };
    //    visitNode(sourceFile);
    //    return result;
    //}

    ///**
    // * 判断指定节点是否已导出。
    // * @param node 要判断的节点。
    // */
    //private isNodeExported(node: ts.Node) {
    //    return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    //}

    //private visitNode(node: ts.Node) {
    //    if (!isNodeExported(node)) {
    //        return;
    //    }

    //    switch (node.kind) {
    //        case ts.SyntaxKind.ClassDeclaration:
    //            visitClass(node as ts.ClassDeclaration);
    //            break;
    //        case ts.SyntaxKind.ModuleDeclaration:
    //            break;
    //        case ts.SyntaxKind.SourceFile:
    //            ts.forEachChild(node, visitNode);
    //            break;
    //    }

    //}

    //private visitClass(node: ts.ClassDeclaration) {
    //    getDocAt(node.name);
    //}

    ///**
    // * 获取指定节点的文档。
    // * @param node 要获取的文档。
    // */
    //private getDocAt(node: ts.Node) {
    //    let symbol = checker.getSymbolAtLocation(node);

    //    result.docs.push({
    //        name: symbol.getName(),
    //        documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
    //        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
    //    });

    //}

}

let c = new TypeScriptCompiler();

c.compile([require.resolve("./t.ts")]);

