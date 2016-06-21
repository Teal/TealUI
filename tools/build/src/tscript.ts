/**
 * @fileOverview TypeScript 编译器
 * @descrition 编译 TypeScript，生成高性能的 JavaScript 和 API 文档数据。
 */

import * as ts from "typescript";

/**
 * 表示一个 TypeScript 语法转换器。
 */
class Transpiler {

    // #region 接口

    /**
     * 获取正在转换的程序。
     */
    program: ts.Program;

    /**
     * 获取正在解析的选项。
     */
    options: TranspilerOptions;

    /**
     * 获取正在使用的类型转换器。
     */
    private checker: ts.TypeChecker;

    /**
     * 获取当前正在处理的文件。
     */
    private sourceFile: ts.SourceFile;

    /**
     * 获取当前文件的文档。
     */
    private doc: JsDoc;

    /**
     * 转换指定的程序。
     * @param program 要转换的程序。
     * @param options 转换的选项。
     */
    transpile(program: ts.Program, options: TranspilerOptions) {
        this.program = program;
        this.options = options;
        this.checker = program.getTypeChecker();

        // 处理每个源文件。
        for (const sourceFile of program.getSourceFiles()) {
            this.transpileModule(sourceFile);
        }

    }

    /**
     * 转换指定的模块。
     * @param sourceFile
     */
    private transpileModule(sourceFile: ts.SourceFile) {
        this.sourceFile = sourceFile;

        if (this.options.doc) {
            this.doc = {
                members: [],
                imports: []
            } as JsDoc;

            // 获取属于当前文档的文档注释。
            const sourceFileComment = this.getJsDocCommentOfSourceFile();
            if (sourceFileComment) {
                this.doc.title = sourceFileComment.file;
                this.doc.keywords = sourceFileComment.keywords;
                this.doc.author = sourceFileComment.author;
                this.doc.description = sourceFileComment.description || sourceFileComment.summary;
                this.doc.state = sourceFileComment.state;
                this.doc.platform = sourceFileComment.platform.split(/\s*,\s*/);
                this.doc.viewport = sourceFileComment.viewport;
            }

        }

        // 解析每个成员。
        mapChild(sourceFile, (node: ts.Node) => {

            return node;
        });

    }

    /**
     * 获取文件的首个注释。
     * @param sourceFile
     */
    private getJsDocCommentOfSourceFile() {
        const comments: ts.CommentRange[] = (ts as any).getJsDocComments(this.sourceFile, this.sourceFile);
        if (!comments.length) return;
        const comment = comments[0];
        if (!comment.hasTrailingNewLine) return;
        return this.parseJsDoc(comment.pos, comment.end);
    }

    // #endregion

    // #region 节点遍历

    // #endregion

    // #region 解析文档注释

    /**
     * 解析指定区间的文档注释。
     * @param pos 注释的起始位置。
     * @param end 注释的结束位置。
     */
    private parseJsDoc(pos: number, end: number) {
        let result = {} as ParsedJsDocComment;

        const parsed = (ts as any).parseIsolatedJSDocComment(this.sourceFile.text, pos, end);

        // 保留解析的注释。
        if (parsed.diagnostics) {
            result.diagnostics.push(...parsed.diagnostics);
        }

        // 解析标签。
        if (parsed.jsDocComment) {
            // TODO: 处理 parsed.jsDocComment.tags，调用 parseJsDocTag
        }

        return result;

        //const defaultTagName = "summary";

    }

    /**
     * 从源文件的文档注释标签截取信息。
     * @param tagName 标签名。
     * @param argument 标签参数，即从当前标签结束到下一个标签之间的文本。
     * @param tag 文档标签。
     * @param result 存放解析结果的对象。
     */
    private parseJsDocTag(tagName: string, argument: string, tag: ts.JSDocTag, result: ParsedJsDocComment) {
        switch (tagName.toLowerCase()) {

            // 类型名
            case "augments":
            case "extend":
                return this.parseJsDocTag("extends", argument, tag, result);
            case "module": // Document a JavaScript module.
                return this.parseJsDocTag("namespace", argument, tag, result);
            case "lends": // Document properties on an object literal as if they belonged to a symbol with a given name.
                return this.parseJsDocTag("memberof", argument, tag, result);
            case "extends": // (synonyms: @extends)  Indicate that a symbol inherits from, ands adds to, a parent symbol.
            case "namespace": // Document a namespace object.
            case "memberof": // This symbol belongs to a parent symbol.
                if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
                // TODO：解析 argument 为类型。
                result[tagName] = argument;
                break;

            // 允许重复的类型名
            case "implements": // This symbol implements an interface.
            case "borrows": // This object uses something from another object.
                // TODO：解析 argument 为类型。
                result[tagName] = result[tagName] || [];
                result[tagName].push(argument);
                break;

            // 成员名
            case "emits":
                return this.parseJsDocTag("fires", argument, tag, result);
            case "name": // Document the name of an object.
            case "fires":// (synonyms: @emits)  Describe the events this method may fire.
            case "alias": // Treat a member as if it had a different name.
                if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
                // TODO：解析 argument 为名字。
                result[tagName] = argument;
                break;

            // 单行文本

            // 允许重复的单行文本
            case "author": // Identify the author of an item.
            case "copyright": // Document some copyright information.
            case "license": // Identify the license that applies to this code.
                result[tagName] = (result[tagName] ? result[tagName] + "," : "") + argument;
                break;

            // 多行文本
            case "desc":
                return this.parseJsDocTag("description", argument, tag, result);
            case "fileoverview":
            case "fileOverview":
            case "overview":
                return this.parseJsDocTag("file", argument, tag, result);
            case "classdesc": // Use the following text to describe the entire class.
            case "summary": // A shorter version of the full description.
            case "description": // (synonyms: @desc) Describe a symbol.
            case "file"://(synonyms: @fileoverview, @overview)  Describe a file.
            case "todo": // Document tasks to be completed.
                result[tagName] = (result[tagName] ? result[tagName] + "\n" : "") + argument;
                break;

            // 地址
            case "see": // Refer to some other documentation for more information.
            case "requires": // This file requires a JavaScript module.
            case "throws": //(synonyms: @exception) Describe what errors could be thrown.
                result[tagName] = result[tagName] || [];
                // TODO: 解析特殊的地址
                result[tagName].push(argument);
                break;

            // 布尔型标签
            case "inner": // Document an inner object.
                return this.parseJsDocTag("internal", argument, tag, result);
            case "host": // Document an inner object.
                return this.parseJsDocTag("external", argument, tag, result);
            case "abstract": // This member must be implemented by the inheritor.
            case "virtual": // This member must be overridden by the inheritor.
            case "override": // Indicate that a symbol overrides its parent.
            case "readonly": // This symbol is meant to be read- only.
            case "private": // This symbol is meant to be private.
            case "protected": // This symbol is meant to be protected.
            case "public": // This symbol is meant to be public.
            case "internal": // This symbol is meant to be internal.
            case "static": // Document a static member.
            case "ignore": // Omit a symbol from the documentation.
            case "external"://(synonyms: @host)  Identifies an external class, namespace, or module.
            case "inheritdoc": // Indicate that a symbol should inherit its parent's documentation.
                if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tagName}. The specific member has been marked as ${tagName}.`);
                if (argument) this.reportDocError(result, tag, `Tag @${tagName} has no parameters.`);
                result[tagName] = true;
                break;

            // 可选名字的布尔型标签
            case "func":
            case "method":
                return this.parseJsDocTag("function", argument, tag, result);
            case "prop":
                return this.parseJsDocTag("property", argument, tag, result);
            case "constructs": // This function member will be the constructor for the previous class.
            case "constructor":
                return this.parseJsDocTag("class", argument, tag, result);
            case "constant":
                return this.parseJsDocTag("const", argument, tag, result);
            case "var":
                return this.parseJsDocTag("member", argument, tag, result);
            case "function": // (synonyms: @func, @method)  Describe a function or method.
            case "property": // (synonyms: @prop)   Document a property of an object.
            case "class": //  (synonyms: @constructor) This function is intended to be called with the "new" keyword.
            case "interface": // This symbol is an interface that others can implement
            case "enum": // Document a collection of related properties.
            case "const": // (synonyms: @const)  Document an object as a constant.
            case "member": // (synonyms: @var) Document a member.
            case "callback": // Document a callback function.
            case "event": // Document an event.
            case "config": // Document a config.
            case "exports": // Identify the member that is exported by a JavaScript module.
            case "instance": // Document an instance member..
            case "global": // Document a global object.
                // TODO：解析 argument 为名字。
                if (argument) result.name = argument;
                argument[argument] = true;
                break;

            // 代码
            case "default": //  (synonyms: @defaultvalue)  Document the default value.
            case "example": // Provide an example of how to use a documented item.
                argument[argument] = result;
                break;
            case "defaultvalue":
                return this.parseJsDocTag("default", argument, tag, result);

            // 版本
            case "deprecated": // Document that this is no longer the preferred way.
            case "version": // Documents the version number of an item.
            case "since": // When was this feature added?
                if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
                // TODO：解析版本号
                result[tagName] = argument;
                break;

            // 特定标签
            case "return":
                return this.parseJsDocTag("returns", argument, tag, result);
            case "returns": // (synonyms: @return) Document the return value of a function.
                // todo
                break;

            case "type": // Document the type of an object.
            case "this": // What does the 'this' keyword refer to here?
                // todo
                break;

            case "typedef": // Document a custom type.
                // todo
                break;

            case "arg":
            case "argument":
                return this.parseJsDocTag("param", argument, tag, result);
            case "param": //(synonyms: @arg, @argument)  Document the parameter to a function.
                // todo
                break;

            case "access": //  Specify the access level of this member (private, public, or protected).
                switch (argument) {
                    case "private":
                    case "protected":
                    case "public":
                    case "internal":
                        return this.parseJsDocTag(argument, null, tag, result);
                    default:
                        this.reportDocError(result, tag, `Invalid argument of tag @${tagName}: '${argument}'. Supported values are: 'private', 'protected', 'public', 'internal'.`);
                        break;
                }
                break;

            case "kind": // What kind of symbol is this?
                switch (argument) {
                    case "func":
                    case "method":
                    case "prop":
                    case "constructs": // This function member will be the constructor for the previous class.
                    case "constructor":
                    case "constant":
                    case "var":
                    case "function": // (synonyms: @func, @method)  Describe a function or method.
                    case "property": // (synonyms: @prop)   Document a property of an object.
                    case "class": //  (synonyms: @constructor) This function is intended to be called with the "new" keyword.
                    case "interface": // This symbol is an interface that others can implement
                    case "enum": // Document a collection of related properties.
                    case "const": // (synonyms: @const)  Document an object as a constant.
                    case "member": // (synonyms: @var) Document a member.
                    case "callback": // Document a callback function.
                    case "event": // Document an event.
                    case "config": // Document a config.
                    case "exports": // Identify the member that is exported by a JavaScript module.
                    case "instance": // Document an instance member..
                        return this.parseJsDocTag(argument, null, tag, result);
                    default:
                        this.reportDocError(result, tag, `Invalid argument of tag @${tagName}: '${argument}'.`);
                        break;
                }

            case "listens": // List the events that a symbol listens for.
            case "mixes": // This object mixes in all the members from another object.
            case "mixin": // Document a mixin object.
            case "tutorial": // Insert a link to an included tutorial file.
            case "variation": // Distinguish different objects with the same name.
            default:
                this.reportDocError(result, tag, `Unknown tag @${tagName}.`);
                break;
        }
    }

    /**
     * 报告一个文档错误。
     * @param result 目标文档注释。
     * @param node 源节点。
     * @param message 错误内容。
     */
    private reportDocError(result: ParsedJsDocComment, node: ts.Node, message: string) {
        result.diagnostics.push({
            file: this.sourceFile,
            start: node.pos,
            length: node.end - node.pos,
            messageText: message,
            category: ts.DiagnosticCategory.Warning,
            code: -1
        });
    }

    // #endregion

}

/**
 * 表示转换的选项。
 */
interface TranspilerOptions extends ts.CompilerOptions {

    /**
     * 生成的文档路径。如果未提供则不生成文档。
     */
    doc: string;

}

/**
 * 表示一个 JS 文档。
 */
interface JsDoc {

    /**
     * 获取当前文档的标题。
     */
    title: string;

    /**
     * 获取当前文档的关键字。
     */
    keywords: string;

    /**
     * 获取当前文档的作者。
     */
    author: string;

    /**
     * 获取当前文档的详细说明。
     */
    description: string;

    /**
     * 获取当前文档的状态。
     */
    state: string;

    /**
     * 获取当前文档的平台。
     */
    platform: string[];

    /**
     * 获取当前文档的视图。
     */
    viewport: string;

    /**
     * 获取当前文档的所有成员。
     */
    members: ParsedJsDocComment[];

    /**
     * 获取当前文档的所有导入模块。
     */
    imports: any[];

}

/**
 * 表示一个已解析的 JS 文档注释。
 */
interface ParsedJsDocComment {

    // #region 注释属性

    /**
     * 注释在源文件的起始位置。
     */
    pos: number;

    /**
     * 注释在源文件的结束位置。
     */
    end: number;

    /**
     * 解析此注释时产生的错误提示。
     */
    diagnostics: ts.Diagnostic[];

    // #endregion 修饰符

    // #region 描述

    /**
     * 获取注释的概述部分。
     */
    summary: string;

    /**
     * 参考。
     */
    see: string[];

    todo: string[];

    requires: string[];

    /**
     * 协议。
     */
    license: string;

    // #endregion 修饰符

    // #region 命名空间

    /**
     * 当前标记的成员名。
     */
    name: string;

    /**
     * 当前标记的命名空间。
     */
    namespace: string;

    classdesc: string;

    // #endregion 修饰符

    // #region 修饰符

    /**
     * 判断是否标记为 abstract。
     */
    abstract: boolean;

    /**
     * 判断是否标记为 virtual。
     */
    virtual: boolean;

    /**
     * 判断是否标记为 override。
     */
    override: boolean;

    /**
     * 判断是否标记为 private。
     */
    private: boolean;

    /**
     * 判断是否标记为 protected。
     */
    protected: boolean;

    /**
     * 判断是否标记为 public。
     */
    public: boolean;

    /**
     * 判断是否标记为 internal。
     */
    internal: boolean;

    /**
     * 判断是否标记为 static。
     */
    static: boolean;

    // #endregion

}

// #region 节点遍历

/**
 * 表示 mapChild 的回调。
 * @param node
 */
declare function MapCallback<T extends ts.Node>(node: T): T;

/**
 * 遍历一个节点并执行更新操作。
 * @param node 要遍历的父节点。
 * @param callback 回调函数。函数返回用于更新的节点，如果函数返回 null，说明删除当前节点。
 */
function mapChild(node: ts.Node, callback: typeof MapCallback) {
    if (!node) return;
    switch (node.kind) {
        case ts.SyntaxKind.QualifiedName:
            (<ts.QualifiedName>node).left = callback((<ts.QualifiedName>node).left);
            (<ts.QualifiedName>node).right = callback((<ts.QualifiedName>node).right);
            return;
        case ts.SyntaxKind.TypeParameter:
            (<ts.TypeParameterDeclaration>node).name = callback((<ts.TypeParameterDeclaration>node).name);
            (<ts.TypeParameterDeclaration>node).constraint = callback((<ts.TypeParameterDeclaration>node).constraint);
            (<ts.TypeParameterDeclaration>node).expression = callback((<ts.TypeParameterDeclaration>node).expression);
            return;
        case ts.SyntaxKind.ShorthandPropertyAssignment:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ShorthandPropertyAssignment>node).name = callback((<ts.ShorthandPropertyAssignment>node).name);
            (<ts.ShorthandPropertyAssignment>node).questionToken = callback((<ts.ShorthandPropertyAssignment>node).questionToken);
            (<ts.ShorthandPropertyAssignment>node).equalsToken = callback((<ts.ShorthandPropertyAssignment>node).equalsToken);
            (<ts.ShorthandPropertyAssignment>node).objectAssignmentInitializer = callback((<ts.ShorthandPropertyAssignment>node).objectAssignmentInitializer);
            return;
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.BindingElement:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.VariableLikeDeclaration>node).propertyName = callback((<ts.VariableLikeDeclaration>node).propertyName);
            (<ts.VariableLikeDeclaration>node).dotDotDotToken = callback((<ts.VariableLikeDeclaration>node).dotDotDotToken);
            (<ts.VariableLikeDeclaration>node).name = callback((<ts.VariableLikeDeclaration>node).name);
            (<ts.VariableLikeDeclaration>node).questionToken = callback((<ts.VariableLikeDeclaration>node).questionToken);
            (<ts.VariableLikeDeclaration>node).type = callback((<ts.VariableLikeDeclaration>node).type);
            (<ts.VariableLikeDeclaration>node).initializer = callback((<ts.VariableLikeDeclaration>node).initializer);
            return;
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.IndexSignature:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            mapArray((<ts.SignatureDeclaration>node).typeParameters, callback);
            mapArray((<ts.SignatureDeclaration>node).parameters, callback);
            (<ts.SignatureDeclaration>node).type = callback((<ts.SignatureDeclaration>node).type);
            return;
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ArrowFunction:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.FunctionLikeDeclaration>node).asteriskToken = (<ts.FunctionLikeDeclaration>node).asteriskToken && callback((<ts.FunctionLikeDeclaration>node).asteriskToken);
            (<ts.FunctionLikeDeclaration>node).name = callback((<ts.FunctionLikeDeclaration>node).name);
            (<ts.FunctionLikeDeclaration>node).questionToken = (<ts.FunctionLikeDeclaration>node).questionToken && callback((<ts.FunctionLikeDeclaration>node).questionToken);
            mapArray((<ts.FunctionLikeDeclaration>node).typeParameters, callback);
            mapArray((<ts.FunctionLikeDeclaration>node).parameters, callback);
            (<ts.FunctionLikeDeclaration>node).type = (<ts.FunctionLikeDeclaration>node).type && callback((<ts.FunctionLikeDeclaration>node).type);
            (<ts.ArrowFunction>node).equalsGreaterThanToken = (<ts.ArrowFunction>node).equalsGreaterThanToken && callback((<ts.ArrowFunction>node).equalsGreaterThanToken);
            (<ts.FunctionLikeDeclaration>node).body = (<ts.FunctionLikeDeclaration>node).body && callback((<ts.FunctionLikeDeclaration>node).body);
            return;
        case ts.SyntaxKind.TypeReference:
            (<ts.TypeReferenceNode>node).typeName = callback((<ts.TypeReferenceNode>node).typeName);
            mapArray((<ts.TypeReferenceNode>node).typeArguments, callback);
            return;
        case ts.SyntaxKind.TypePredicate:
            (<ts.TypePredicateNode>node).parameterName = callback((<ts.TypePredicateNode>node).parameterName);
            (<ts.TypePredicateNode>node).type = callback((<ts.TypePredicateNode>node).type);
            return;
        case ts.SyntaxKind.TypeQuery:
            (<ts.TypeQueryNode>node).exprName = callback((<ts.TypeQueryNode>node).exprName);
            return;
        case ts.SyntaxKind.TypeLiteral:
            mapArray((<ts.TypeLiteralNode>node).members, callback);
            return;
        case ts.SyntaxKind.ArrayType:
            (<ts.ArrayTypeNode>node).elementType = callback((<ts.ArrayTypeNode>node).elementType);
            return;
        case ts.SyntaxKind.TupleType:
            mapArray((<ts.TupleTypeNode>node).elementTypes, callback);
            return;
        case ts.SyntaxKind.UnionType:
        case ts.SyntaxKind.IntersectionType:
            mapArray((<ts.UnionOrIntersectionTypeNode>node).types, callback);
            return;
        case ts.SyntaxKind.ParenthesizedType:
            (<ts.ParenthesizedTypeNode>node).type = callback((<ts.ParenthesizedTypeNode>node).type);
            return;
        case ts.SyntaxKind.ObjectBindingPattern:
        case ts.SyntaxKind.ArrayBindingPattern:
            mapArray((<ts.BindingPattern>node).elements, callback);
            return;
        case ts.SyntaxKind.ArrayLiteralExpression:
            mapArray((<ts.ArrayLiteralExpression>node).elements, callback);
            return;
        case ts.SyntaxKind.ObjectLiteralExpression:
            mapArray((<ts.ObjectLiteralExpression>node).properties, callback);
            return;
        case ts.SyntaxKind.PropertyAccessExpression:
            (<ts.PropertyAccessExpression>node).expression = callback((<ts.PropertyAccessExpression>node).expression);
            (<ts.PropertyAccessExpression>node).dotToken = callback((<ts.PropertyAccessExpression>node).dotToken);
            (<ts.PropertyAccessExpression>node).name = callback((<ts.PropertyAccessExpression>node).name);
            return;
        case ts.SyntaxKind.ElementAccessExpression:
            (<ts.ElementAccessExpression>node).expression = callback((<ts.ElementAccessExpression>node).expression);
            (<ts.ElementAccessExpression>node).argumentExpression = callback((<ts.ElementAccessExpression>node).argumentExpression);
            return;
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
            (<ts.CallExpression>node).expression = callback((<ts.CallExpression>node).expression);
            mapArray((<ts.CallExpression>node).typeArguments, callback);
            mapArray((<ts.CallExpression>node).arguments, callback);
            return;
        case ts.SyntaxKind.TaggedTemplateExpression:
            (<ts.TaggedTemplateExpression>node).tag = callback((<ts.TaggedTemplateExpression>node).tag);
            (<ts.TaggedTemplateExpression>node).template = callback((<ts.TaggedTemplateExpression>node).template);
            return;
        case ts.SyntaxKind.TypeAssertionExpression:
            (<ts.TypeAssertion>node).type = callback((<ts.TypeAssertion>node).type);
            (<ts.TypeAssertion>node).expression = callback((<ts.TypeAssertion>node).expression);
            return;
        case ts.SyntaxKind.ParenthesizedExpression:
            (<ts.ParenthesizedExpression>node).expression = callback((<ts.ParenthesizedExpression>node).expression);
            return;
        case ts.SyntaxKind.DeleteExpression:
            (<ts.DeleteExpression>node).expression = callback((<ts.DeleteExpression>node).expression);
            return;
        case ts.SyntaxKind.TypeOfExpression:
            (<ts.TypeOfExpression>node).expression = callback((<ts.TypeOfExpression>node).expression);
            return;
        case ts.SyntaxKind.VoidExpression:
            (<ts.VoidExpression>node).expression = callback((<ts.VoidExpression>node).expression);
            return;
        case ts.SyntaxKind.PrefixUnaryExpression:
            (<ts.PrefixUnaryExpression>node).operand = callback((<ts.PrefixUnaryExpression>node).operand);
            return;
        case ts.SyntaxKind.YieldExpression:
            (<ts.YieldExpression>node).asteriskToken = callback((<ts.YieldExpression>node).asteriskToken);
            (<ts.YieldExpression>node).expression = callback((<ts.YieldExpression>node).expression);
            return;
        case ts.SyntaxKind.AwaitExpression:
            (<ts.AwaitExpression>node).expression = callback((<ts.AwaitExpression>node).expression);
            return;
        case ts.SyntaxKind.PostfixUnaryExpression:
            (<ts.PostfixUnaryExpression>node).operand = callback((<ts.PostfixUnaryExpression>node).operand);
            return;
        case ts.SyntaxKind.BinaryExpression:
            (<ts.BinaryExpression>node).left = callback((<ts.BinaryExpression>node).left);
            (<ts.BinaryExpression>node).operatorToken = callback((<ts.BinaryExpression>node).operatorToken);
            (<ts.BinaryExpression>node).right = callback((<ts.BinaryExpression>node).right);
            return;
        case ts.SyntaxKind.AsExpression:
            (<ts.AsExpression>node).expression = callback((<ts.AsExpression>node).expression);
            (<ts.AsExpression>node).type = callback((<ts.AsExpression>node).type);
            return;
        case ts.SyntaxKind.ConditionalExpression:
            (<ts.ConditionalExpression>node).condition = callback((<ts.ConditionalExpression>node).condition);
            (<ts.ConditionalExpression>node).questionToken = callback((<ts.ConditionalExpression>node).questionToken);
            (<ts.ConditionalExpression>node).whenTrue = callback((<ts.ConditionalExpression>node).whenTrue);
            (<ts.ConditionalExpression>node).colonToken = callback((<ts.ConditionalExpression>node).colonToken);
            (<ts.ConditionalExpression>node).whenFalse = callback((<ts.ConditionalExpression>node).whenFalse);
            return;
        case ts.SyntaxKind.SpreadElementExpression:
            (<ts.SpreadElementExpression>node).expression = callback((<ts.SpreadElementExpression>node).expression);
            return;
        case ts.SyntaxKind.Block:
        case ts.SyntaxKind.ModuleBlock:
            mapArray((<ts.Block>node).statements, callback);
            return;
        case ts.SyntaxKind.SourceFile:
            mapArray((<ts.SourceFile>node).statements, callback);
            (<ts.SourceFile>node).endOfFileToken = callback((<ts.SourceFile>node).endOfFileToken);
            return;
        case ts.SyntaxKind.VariableStatement:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.VariableStatement>node).declarationList = callback((<ts.VariableStatement>node).declarationList);
            return;
        case ts.SyntaxKind.VariableDeclarationList:
            mapArray((<ts.VariableDeclarationList>node).declarations, callback);
            return;
        case ts.SyntaxKind.ExpressionStatement:
            (<ts.ExpressionStatement>node).expression = callback((<ts.ExpressionStatement>node).expression);
            return;
        case ts.SyntaxKind.IfStatement:
            (<ts.IfStatement>node).expression = callback((<ts.IfStatement>node).expression);
            (<ts.IfStatement>node).thenStatement = callback((<ts.IfStatement>node).thenStatement);
            (<ts.IfStatement>node).elseStatement = callback((<ts.IfStatement>node).elseStatement);
            return;
        case ts.SyntaxKind.DoStatement:
            (<ts.DoStatement>node).statement = callback((<ts.DoStatement>node).statement);
            (<ts.DoStatement>node).expression = callback((<ts.DoStatement>node).expression);
            return;
        case ts.SyntaxKind.WhileStatement:
            (<ts.WhileStatement>node).expression = callback((<ts.WhileStatement>node).expression);
            (<ts.WhileStatement>node).statement = callback((<ts.WhileStatement>node).statement);
            return;
        case ts.SyntaxKind.ForStatement:
            (<ts.ForStatement>node).initializer = callback((<ts.ForStatement>node).initializer);
            (<ts.ForStatement>node).condition = callback((<ts.ForStatement>node).condition);
            (<ts.ForStatement>node).incrementor = callback((<ts.ForStatement>node).incrementor);
            (<ts.ForStatement>node).statement = callback((<ts.ForStatement>node).statement);
            return;
        case ts.SyntaxKind.ForInStatement:
            (<ts.ForInStatement>node).initializer = callback((<ts.ForInStatement>node).initializer);
            (<ts.ForInStatement>node).expression = callback((<ts.ForInStatement>node).expression);
            (<ts.ForInStatement>node).statement = callback((<ts.ForInStatement>node).statement);
            return;
        case ts.SyntaxKind.ForOfStatement:
            (<ts.ForOfStatement>node).initializer = callback((<ts.ForOfStatement>node).initializer);
            (<ts.ForOfStatement>node).expression = callback((<ts.ForOfStatement>node).expression);
            (<ts.ForOfStatement>node).statement = callback((<ts.ForOfStatement>node).statement);
            return;
        case ts.SyntaxKind.ContinueStatement:
        case ts.SyntaxKind.BreakStatement:
            (<ts.BreakOrContinueStatement>node).label = callback((<ts.BreakOrContinueStatement>node).label);
            return;
        case ts.SyntaxKind.ReturnStatement:
            (<ts.ReturnStatement>node).expression = callback((<ts.ReturnStatement>node).expression);
            return;
        case ts.SyntaxKind.WithStatement:
            (<ts.WithStatement>node).expression = callback((<ts.WithStatement>node).expression);
            (<ts.WithStatement>node).statement = callback((<ts.WithStatement>node).statement);
            return;
        case ts.SyntaxKind.SwitchStatement:
            (<ts.SwitchStatement>node).expression = callback((<ts.SwitchStatement>node).expression);
            (<ts.SwitchStatement>node).caseBlock = callback((<ts.SwitchStatement>node).caseBlock);
            return;
        case ts.SyntaxKind.CaseBlock:
            mapArray((<ts.CaseBlock>node).clauses, callback);
            return;
        case ts.SyntaxKind.CaseClause:
            (<ts.CaseClause>node).expression = callback((<ts.CaseClause>node).expression);
            mapArray((<ts.CaseClause>node).statements, callback);
            return;
        case ts.SyntaxKind.DefaultClause:
            mapArray((<ts.DefaultClause>node).statements, callback);
            return;
        case ts.SyntaxKind.LabeledStatement:
            (<ts.LabeledStatement>node).label = callback((<ts.LabeledStatement>node).label);
            (<ts.LabeledStatement>node).statement = callback((<ts.LabeledStatement>node).statement);
            return;
        case ts.SyntaxKind.ThrowStatement:
            (<ts.ThrowStatement>node).expression = callback((<ts.ThrowStatement>node).expression);
            return;
        case ts.SyntaxKind.TryStatement:
            (<ts.TryStatement>node).tryBlock = callback((<ts.TryStatement>node).tryBlock);
            (<ts.TryStatement>node).catchClause = callback((<ts.TryStatement>node).catchClause);
            (<ts.TryStatement>node).finallyBlock = callback((<ts.TryStatement>node).finallyBlock);
            return;
        case ts.SyntaxKind.CatchClause:
            (<ts.CatchClause>node).variableDeclaration = callback((<ts.CatchClause>node).variableDeclaration);
            (<ts.CatchClause>node).block = callback((<ts.CatchClause>node).block);
            return;
        case ts.SyntaxKind.Decorator:
            (<ts.Decorator>node).expression = callback((<ts.Decorator>node).expression);
            return;
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ClassLikeDeclaration>node).name = callback((<ts.ClassLikeDeclaration>node).name);
            mapArray((<ts.ClassLikeDeclaration>node).typeParameters, callback);
            mapArray((<ts.ClassLikeDeclaration>node).heritageClauses, callback);
            mapArray((<ts.ClassLikeDeclaration>node).members, callback);
            return;
        case ts.SyntaxKind.InterfaceDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.InterfaceDeclaration>node).name = callback((<ts.InterfaceDeclaration>node).name);
            mapArray((<ts.InterfaceDeclaration>node).typeParameters, callback);
            mapArray((<ts.ClassDeclaration>node).heritageClauses, callback);
            mapArray((<ts.InterfaceDeclaration>node).members, callback);
            return;
        case ts.SyntaxKind.TypeAliasDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.TypeAliasDeclaration>node).name = callback((<ts.TypeAliasDeclaration>node).name);
            mapArray((<ts.TypeAliasDeclaration>node).typeParameters, callback);
            (<ts.TypeAliasDeclaration>node).type = callback((<ts.TypeAliasDeclaration>node).type);
            return;
        case ts.SyntaxKind.EnumDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.EnumDeclaration>node).name = callback((<ts.EnumDeclaration>node).name);
            mapArray((<ts.EnumDeclaration>node).members, callback);
            return;
        case ts.SyntaxKind.EnumMember:
            (<ts.EnumMember>node).name = callback((<ts.EnumMember>node).name);
            (<ts.EnumMember>node).initializer = callback((<ts.EnumMember>node).initializer);
            return;
        case ts.SyntaxKind.ModuleDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ModuleDeclaration>node).name = callback((<ts.ModuleDeclaration>node).name);
            (<ts.ModuleDeclaration>node).body = callback((<ts.ModuleDeclaration>node).body);
            return;
        case ts.SyntaxKind.ImportEqualsDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ImportEqualsDeclaration>node).name = callback((<ts.ImportEqualsDeclaration>node).name);
            (<ts.ImportEqualsDeclaration>node).moduleReference = callback((<ts.ImportEqualsDeclaration>node).moduleReference);
            return;
        case ts.SyntaxKind.ImportDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ImportDeclaration>node).importClause = callback((<ts.ImportDeclaration>node).importClause);
            (<ts.ImportDeclaration>node).moduleSpecifier = callback((<ts.ImportDeclaration>node).moduleSpecifier);
            return;
        case ts.SyntaxKind.ImportClause:
            (<ts.ImportClause>node).name = callback((<ts.ImportClause>node).name);
            (<ts.ImportClause>node).namedBindings = callback((<ts.ImportClause>node).namedBindings);
            return;

        case ts.SyntaxKind.NamespaceImport:
            (<ts.NamespaceImport>node).name = callback((<ts.NamespaceImport>node).name);
            return;
        case ts.SyntaxKind.NamedImports:
        case ts.SyntaxKind.NamedExports:
            mapArray((<ts.NamedImportsOrExports>node).elements, callback);
            return;
        case ts.SyntaxKind.ExportDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ExportDeclaration>node).exportClause = callback((<ts.ExportDeclaration>node).exportClause);
            (<ts.ExportDeclaration>node).moduleSpecifier = callback((<ts.ExportDeclaration>node).moduleSpecifier);
            return;
        case ts.SyntaxKind.ImportSpecifier:
        case ts.SyntaxKind.ExportSpecifier:
            (<ts.ImportOrExportSpecifier>node).propertyName = callback((<ts.ImportOrExportSpecifier>node).propertyName);
            (<ts.ImportOrExportSpecifier>node).name = callback((<ts.ImportOrExportSpecifier>node).name);
            return;
        case ts.SyntaxKind.ExportAssignment:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            (<ts.ExportAssignment>node).expression = callback((<ts.ExportAssignment>node).expression);
            return;
        case ts.SyntaxKind.TemplateExpression:
            mapArray((<ts.TemplateExpression>node).templateSpans, callback);
            (<ts.TemplateExpression>node).head = callback((<ts.TemplateExpression>node).head);
            return;
        case ts.SyntaxKind.TemplateSpan:
            (<ts.TemplateSpan>node).expression = callback((<ts.TemplateSpan>node).expression);
            (<ts.TemplateSpan>node).literal = callback((<ts.TemplateSpan>node).literal);
            return;
        case ts.SyntaxKind.ComputedPropertyName:
            (<ts.ComputedPropertyName>node).expression = callback((<ts.ComputedPropertyName>node).expression);
            return;
        case ts.SyntaxKind.HeritageClause:
            mapArray((<ts.HeritageClause>node).types, callback);
            return;
        case ts.SyntaxKind.ExpressionWithTypeArguments:
            (<ts.ExpressionWithTypeArguments>node).expression = callback((<ts.ExpressionWithTypeArguments>node).expression);
            mapArray((<ts.ExpressionWithTypeArguments>node).typeArguments, callback);
            return;
        case ts.SyntaxKind.ExternalModuleReference:
            (<ts.ExternalModuleReference>node).expression = callback((<ts.ExternalModuleReference>node).expression);
            return;
        case ts.SyntaxKind.MissingDeclaration:
            mapArray(node.decorators, callback);
            return;

        case ts.SyntaxKind.JsxElement:
            (<ts.JsxElement>node).openingElement = callback((<ts.JsxElement>node).openingElement);
            mapArray((<ts.JsxElement>node).children, callback);
            (<ts.JsxElement>node).closingElement = callback((<ts.JsxElement>node).closingElement);
            return;
        case ts.SyntaxKind.JsxSelfClosingElement:
        case ts.SyntaxKind.JsxOpeningElement:
            (<ts.JsxOpeningLikeElement>node).tagName = callback((<ts.JsxOpeningLikeElement>node).tagName);
            mapArray((<ts.JsxOpeningLikeElement>node).attributes, callback);
            return;
        case ts.SyntaxKind.JsxAttribute:
            (<ts.JsxAttribute>node).name = callback((<ts.JsxAttribute>node).name);
            (<ts.JsxAttribute>node).initializer = callback((<ts.JsxAttribute>node).initializer);
            return;
        case ts.SyntaxKind.JsxSpreadAttribute:
            (<ts.JsxSpreadAttribute>node).expression = callback((<ts.JsxSpreadAttribute>node).expression);
            return;
        case ts.SyntaxKind.JsxExpression:
            (<ts.JsxExpression>node).expression = callback((<ts.JsxExpression>node).expression);
            return;
        case ts.SyntaxKind.JsxClosingElement:
            (<ts.JsxClosingElement>node).tagName = callback((<ts.JsxClosingElement>node).tagName);
            return;

        case ts.SyntaxKind.JSDocTypeExpression:
            (<ts.JSDocTypeExpression>node).type = callback((<ts.JSDocTypeExpression>node).type);
            return;
        case ts.SyntaxKind.JSDocUnionType:
            mapArray((<ts.JSDocUnionType>node).types, callback);
            return;
        case ts.SyntaxKind.JSDocTupleType:
            mapArray((<ts.JSDocTupleType>node).types, callback);
            return;
        case ts.SyntaxKind.JSDocArrayType:
            (<ts.JSDocArrayType>node).elementType = callback((<ts.JSDocArrayType>node).elementType);
            return;
        case ts.SyntaxKind.JSDocNonNullableType:
            (<ts.JSDocNonNullableType>node).type = callback((<ts.JSDocNonNullableType>node).type);
            return;
        case ts.SyntaxKind.JSDocNullableType:
            (<ts.JSDocNullableType>node).type = callback((<ts.JSDocNullableType>node).type);
            return;
        case ts.SyntaxKind.JSDocRecordType:
            mapArray((<ts.JSDocRecordType>node).members, callback);
            return;
        case ts.SyntaxKind.JSDocTypeReference:
            (<ts.JSDocTypeReference>node).name = callback((<ts.JSDocTypeReference>node).name);
            mapArray((<ts.JSDocTypeReference>node).typeArguments, callback);
            return;
        case ts.SyntaxKind.JSDocOptionalType:
            (<ts.JSDocOptionalType>node).type = callback((<ts.JSDocOptionalType>node).type);
            return;
        case ts.SyntaxKind.JSDocFunctionType:
            mapArray((<ts.JSDocFunctionType>node).parameters, callback);
            (<ts.JSDocFunctionType>node).type = callback((<ts.JSDocFunctionType>node).type);
            return;
        case ts.SyntaxKind.JSDocVariadicType:
            (<ts.JSDocVariadicType>node).type = callback((<ts.JSDocVariadicType>node).type);
            return;
        case ts.SyntaxKind.JSDocConstructorType:
            (<ts.JSDocConstructorType>node).type = callback((<ts.JSDocConstructorType>node).type);
            return;
        case ts.SyntaxKind.JSDocThisType:
            (<ts.JSDocThisType>node).type = callback((<ts.JSDocThisType>node).type);
            return;
        case ts.SyntaxKind.JSDocRecordMember:
            (<ts.JSDocRecordMember>node).name = callback((<ts.JSDocRecordMember>node).name);
            (<ts.JSDocRecordMember>node).type = callback((<ts.JSDocRecordMember>node).type);
            return;
        case ts.SyntaxKind.JSDocComment:
            mapArray((<ts.JSDocComment>node).tags, callback);
            return;
        case ts.SyntaxKind.JSDocParameterTag:
            (<ts.JSDocParameterTag>node).preParameterName = callback((<ts.JSDocParameterTag>node).preParameterName);
            (<ts.JSDocParameterTag>node).typeExpression = callback((<ts.JSDocParameterTag>node).typeExpression);
            (<ts.JSDocParameterTag>node).postParameterName = callback((<ts.JSDocParameterTag>node).postParameterName);
            return;
        case ts.SyntaxKind.JSDocReturnTag:
            (<ts.JSDocReturnTag>node).typeExpression = callback((<ts.JSDocReturnTag>node).typeExpression);
            return;
        case ts.SyntaxKind.JSDocTypeTag:
            (<ts.JSDocTypeTag>node).typeExpression = callback((<ts.JSDocTypeTag>node).typeExpression);
            return;
        case ts.SyntaxKind.JSDocTemplateTag:
            mapArray((<ts.JSDocTemplateTag>node).typeParameters, callback);
            return;
    }
}

/**
 * 遍历一个节点并执行更新操作。
 * @param nodes 要遍历的父节点。
 * @param callback 回调函数。函数返回用于更新的节点，如果函数返回 null，说明删除当前节点。
 */
function mapArray<T extends ts.Node>(nodes: ts.NodeArray<T>, callback: typeof MapCallback) {
    if (!nodes) return;
    for (let i = 0; i < nodes.length; i++) {
        nodes[i] = callback(nodes[i]);
        if (nodes[i] == null) {
            nodes.splice(i--, 1);
        }
    }
}

// #endregion

// #region 更改系统 API

// 全局统一使用的转换器。
const transpiler = new Transpiler();

// 更改创建程序的方式。
const createProgram = ts.createProgram;
ts.createProgram = function (rootNames: string[], options: ts.CompilerOptions, host?: ts.CompilerHost, oldProgram?: ts.Program) {

    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;

    // 编译。
    const program: ts.Program = createProgram.apply(this, arguments);

    // 转换。
    transpiler.transpile(program, options);

    // 语法转换。
    return program;
};

// 更新注释。
const writeCommentRange = (ts as any).writeCommentRange;
(ts as any).writeCommentRange = function (text: string, lineMap: number[], writer: any, comment: ts.CommentRange, newLine: string) {
    // console.log("输出注释:" + text.substring(comment.pos, comment.end));
    return writeCommentRange.apply(this, arguments);
};

export = ts;

// #endregion
