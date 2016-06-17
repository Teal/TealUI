/**
 * 表示一个 TypeScript 语法树转换器。
 */
import * as ts from "typescript";

/**
 * 表示转换的选项。
 */
export interface TranspileOptions {

}

/**
 * 转换指定的程序。
 * @param program 要转换的程序。
 * @param options 转换的选项。
 */
export function transpile(program: ts.Program, options: TranspileOptions) {

    const checker = program.getTypeChecker();

    // 处理每个源文件。
    for (const sourceFile of program.getSourceFiles()) {
        visitSourceFile(sourceFile);
    }

    /**
     * 处理一个文件。
     * @param sourceFile 要处理的文件。
     */
    function visitSourceFile(sourceFile: ts.SourceFile) {

        const sourceFileComment = getJsDocCommentOfSourceFile(sourceFile);

        console.log(sourceFileComment.tags.map(t => sourceFile.text.substring(t.pos, t.end)).join("####"))

        //c.forEach(p)

        //function p(c) {
        //    try {
        //        var ccc = ts.parseIsolatedJSDocComment(sourceFile.text, c.pos, c.end)
        //        debugger
        //    } catch (e) {
        //        console.log(" $$$", ccc);
        //    }

        //    console.log("| ", sourceFile.text.substring(c.pos, c.end));
        //}

    }

    /**
     * 获取文件的首个注释。
     * @param sourceFile
     */
    function getJsDocCommentOfSourceFile(sourceFile: ts.SourceFile) {
        const comments: ts.CommentRange[] = (ts as any).getJsDocComments(sourceFile, sourceFile);
        if (!comments.length) return;
        const comment = comments[0];
        if (!comment.hasTrailingNewLine) return;
        return parseJsDoc(sourceFile.text, comment.pos, comment.end);
    }

    /**
     * 解析 JS 文档注释。
     * @param text
     * @param pos
     * @param end
     */
    function parseJsDoc(text: string, pos: number, end: number): ts.JSDocComment {
        return (ts as any).parseIsolatedJSDocComment(text, pos, end).jsDocComment;
    }

    // 更新注释。
    (ts as any).writeCommentRange = (text: string, lineMap: number[], writer: any, comment: ts.CommentRange, newLine: string) => {
        console.log("输出注释:" + text.substring(comment.pos, comment.end));
    };

    return program;
}

// #region 解析文档注释

const defaultTagName = "summary";

/**
 * 表示一个已解析的 JS 文档注释。
 */
export interface ParsedJsDocComment {

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

function parseJsDoc() {

}

/**
 * 从源文件的文档注释标签截取信息。
 * @param tagName 标签名。
 * @param argument 标签参数，即从当前标签结束到下一个标签之间的文本。
 * @param tag 文档标签。
 * @param result 存放解析结果的对象。
 */
function parseJsDocTag(tagName: string, argument: string, tag: ts.JSDocTag, result: ParsedJsDocComment) {
    switch (tagName) {

        // 标识符
        case "extends": // (synonyms: @extends)  Indicate that a symbol inherits from, ands adds to, a parent symbol.
        case "name": // Document the name of an object.
        case "namespace": // Document a namespace object.
        case "fires":// (synonyms: @emits)  Describe the events this method may fire.
        case "alias": // Treat a member as if it had a different name.
        case "memberOf": // This symbol belongs to a parent symbol.
            if (result[tagName]) reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
            result[tagName] = argument;
            break;
        case "memberof":
            return parseJsDocTag("memberOf", argument, tag, result);
        case "emits":
            return parseJsDocTag("fires", argument, tag, result);
        case "extend":
            return parseJsDocTag("extends", argument, tag, result);

        // 单行文本
        case "author": // Identify the author of an item.
        case "copyright": // Document some copyright information.
        case "license": // Identify the license that applies to this code.
            if (result[tagName]) reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
            result[tagName] = argument;
            break;
        case "augments":
            return parseJsDocTag("extends", argument, tag, result);
        case "module": // Document a JavaScript module.
            return parseJsDocTag("namespace", argument, tag, result);
        // 多行文本
        case "classdesc": // Use the following text to describe the entire class.
        case "summary": // A shorter version of the full description.
        case "description": // (synonyms: @desc) Describe a symbol.
        case "file"://(synonyms: @fileoverview, @overview)  Describe a file.
            result[tagName] = (result[tagName] ? result[tagName] + "\n" : "") + argument;
            break;
        case "desc":
            return parseJsDocTag("description", argument, tag, result);
        case "fileoverview":
        case "fileOverview":
        case "overview":
            return parseJsDocTag("file", argument, tag, result);

        // 多个文本
        case "see": // Refer to some other documentation for more information.
        case "todo": // Document tasks to be completed.
        case "requires": // This file requires a JavaScript module.
            result[tagName] = result[tagName] || [];
            result[tagName].push(argument);
            break;

        // 布尔型标签
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
            if (result[tagName]) reportDocError(result, tag, `Duplicate tag: @${tagName}. The specific member has been marked as ${tagName}.`);
            if (argument) reportDocError(result, tag, `Tag @${tagName} has no parameters.`);
            result[tagName] = true;
            break;
        case "inner": // Document an inner object.
            return parseJsDocTag("internal", argument, tag, result);

        // 可选名字的布尔型标签
        case "function": // (synonyms: @func, @method)  Describe a function or method.
        case "property": // (synonyms: @prop)   Document a property of an object.
        case "class": //  (synonyms: @constructor) This function is intended to be called with the "new" keyword.
        case "interface": // This symbol is an interface that others can implement
        case "enum": // Document a collection of related properties.
        case "const": // (synonyms: @const)  Document an object as a constant.
        case "event": // Document an event.
        case "member": // (synonyms: @var) Document a member.
            if (argument) result.name = argument;
            argument[argument] = true;
            break;
        case "func":
        case "method":
            return parseJsDocTag("function", argument, tag, result);
        case "prop":
            return parseJsDocTag("property", argument, tag, result);
        case "constructs": // This function member will be the constructor for the previous class.
        case "constructor":
            return parseJsDocTag("class", argument, tag, result);
        case "constant":
            return parseJsDocTag("const", argument, tag, result);
        case "var":
            return parseJsDocTag("member", argument, tag, result);

        // 代码
        case "default": //  (synonyms: @defaultvalue)  Document the default value.
        case "example": // Provide an example of how to use a documented item.
            argument[argument] = result;
            break;
        case "defaultvalue":
            return parseJsDocTag("default", argument, tag, result);

        // 类型标签
        case "returns": // (synonyms: @return) Document the return value of a function.
            // todo
            break;
        case "return":
            return parseJsDocTag("returns", argument, tag, result);

        case "type": // Document the type of an object.
            // todo
            break;

        case "typedef": // Document a custom type.
            // todo
            break;

        case "this": // What does the 'this' keyword refer to here?
            // todo
            break;

        case "implements": // This symbol implements an interface.
            break;

        // 版本
        case "deprecated": // Document that this is no longer the preferred way.
        case "version": // Documents the version number of an item.
        case "since": // When was this feature added?
            if (result[tagName]) reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
            result[tagName] = argument;
            break;

        // 其它标签
        case "access": //  Specify the access level of this member (private, public, or protected).
            switch (argument) {
                case "private":
                case "protected":
                case "public":
                case "internal":
                    if (result[argument]) {
                        reportDocError(result, tag, `Duplicate tag: @${tagName}. The specific member has been marked as ${argument}.`);
                    }
                    result[tagName] = true;
                    break;
                default:
                    reportDocError(result, tag, `Invalid argument of tag @${tagName}: '${argument}'. Supported values are: 'private', 'protected', 'public', 'internal'.`);
                    break;
            }
            break;

        case "borrows": // This object uses something from another object.
        case "callback": // Document a callback function.
        case "exports": // Identify the member that is exported by a JavaScript module.
        case "external"://(synonyms: @host)  Identifies an external class, namespace, or module.
        case "global": // Document a global object.
        case "inheritdoc": // Indicate that a symbol should inherit its parent's documentation.
        case "instance": // Document an instance member..
        case "kind": // What kind of symbol is this?
        case "lends": // Document properties on an object literal as if they belonged to a symbol with a given name.
        case "listens": // List the events that a symbol listens for.
        case "mixes": // This object mixes in all the members from another object.
        case "mixin": // Document a mixin object.
        case "param": //(synonyms: @arg, @argument)  Document the parameter to a function.
        case "throws": //(synonyms: @exception) Describe what errors could be thrown.
        case "tutorial": // Insert a link to an included tutorial file.
        case "variation": // Distinguish different objects with the same name.
    }
}

function reportDocError(result: ParsedJsDocComment, node: ts.Node, message: string) {
    result.diagnostics.push({
        file: node.getSourceFile(),
        start: node.pos,
        length: node.end - node.pos,
        messageText: message,
        category: ts.DiagnosticCategory.Warning,
        code: -1
    });
}

// #endregion
