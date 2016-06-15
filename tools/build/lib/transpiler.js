/**
 * 表示一个 TypeScript 语法树转换器。
 */
var ts = require("typescript");
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
        var sourceFileComment = getJsDocCommentOfSourceFile(sourceFile);
        console.log(sourceFileComment.tags.map(function (t) { return sourceFile.text.substring(t.pos, t.end); }).join("####"));
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
    function getJsDocCommentOfSourceFile(sourceFile) {
        var comments = ts.getJsDocComments(sourceFile, sourceFile);
        if (!comments.length)
            return;
        var comment = comments[0];
        if (!comment.hasTrailingNewLine)
            return;
        return parseJsDoc(sourceFile.text, comment.pos, comment.end);
    }
    /**
     * 解析 JS 文档注释。
     * @param text
     * @param pos
     * @param end
     */
    function parseJsDoc(text, pos, end) {
        return ts.parseIsolatedJSDocComment(text, pos, end).jsDocComment;
    }
    // 更新注释。
    ts.writeCommentRange = function (text, lineMap, writer, comment, newLine) {
        console.log("输出注释:" + text.substring(comment.pos, comment.end));
    };
    return program;
}
exports.transpile = transpile;
// #region 解析文档注释
var defaultTagName = "summary";
function parseJsDoc() {
}
/**
 * 从源文件的标签语句截取信息。
 * @param tag 原始标签内容。
 * @param rest 从当前标签结束到下一个标签之间的文本。
 * @param result 存放解析结果的对象。
 */
function readJsDocTag(tag, rest, result) {
    var tagName = tag.tagName.text;
    switch (tagName) {
        // #region 修饰符
        case "abstract": // This member must be implemented by the inheritor.
        case "virtual": // This member must be overridden by the inheritor.
        case "override": // Indicate that a symbol overrides its parent.
        case "readonly": // This symbol is meant to be read- only.
        case "private": // This symbol is meant to be private.
        case "protected": // This symbol is meant to be protected.
        case "public": // This symbol is meant to be public.
        case "internal": // This symbol is meant to be internal.
        case "static":
            if (result[tagName]) {
                result.diagnostics.push({
                    file: tag.getSourceFile(),
                    start: tag.pos,
                    length: tag.end - tag.pos,
                    messageText: "Duplicate tag: @" + tagName,
                    category: ts.DiagnosticCategory.Warning,
                    code: -1
                });
            }
            result[tagName] = true;
            break;
        case "access":
            switch (rest) {
                case "private":
                case "protected":
                case "public":
                case "internal":
                    if (result[tagName]) {
                        result.diagnostics.push({
                            file: tag.getSourceFile(),
                            start: tag.pos,
                            length: tag.end - tag.pos,
                            messageText: "Duplicate tag: @" + tagName,
                            category: ts.DiagnosticCategory.Warning,
                            code: -1
                        });
                    }
                    result[tagName] = true;
                    break;
                default:
                    result.diagnostics.push({
                        file: tag.getSourceFile(),
                        start: tag.pos,
                        length: tag.end - tag.pos,
                        messageText: "Invalid tag value: @" + tagName + "  " + rest,
                        category: ts.DiagnosticCategory.Warning,
                        code: -1
                    });
                    break;
            }
            break;
        // #endregion
        case "alias": // Treat a member as if it had a different name.
        case "augments": // (synonyms: @extends)  Indicate that a symbol inherits from, ands adds to, a parent symbol.
        case "author": // Identify the author of an item.
        case "borrows": // This object uses something from another object.
        case "callback": // Document a callback function.
        case "class": //  (synonyms: @constructor) This function is intended to be called with the "new" keyword.
        case "classdesc": // Use the following text to describe the entire class.
        case "constant": // (synonyms: @const)  Document an object as a constant.
        case "constructs": // This function member will be the constructor for the previous class.
        case "copyright": // Document some copyright information.
        case "default": //  (synonyms: @defaultvalue)  Document the default value.
        case "deprecated": // Document that this is no longer the preferred way.
        case "description": // (synonyms: @desc) Describe a symbol.
        case "enum": // Document a collection of related properties.
        case "event": // Document an event.
        case "example": // Provide an example of how to use a documented item.
        case "exports": // Identify the member that is exported by a JavaScript module.
        case "external": //(synonyms: @host)  Identifies an external class, namespace, or module.
        case "file": //(synonyms: @fileoverview, @overview)  Describe a file.
        case "fires": // (synonyms: @emits)  Describe the events this method may fire.
        case "function": // (synonyms: @func, @method)  Describe a function or method.
        case "global": // Document a global object.
        case "ignore": // Omit a symbol from the documentation.
        case "implements": // This symbol implements an interface.
        case "inheritdoc": // Indicate that a symbol should inherit its parent's documentation.
        case "inner": // Document an inner object.
        case "instance": // Document an instance member.
        case "interface": // This symbol is an interface that others can implement.
        case "kind": // What kind of symbol is this?
        case "lends": // Document properties on an object literal as if they belonged to a symbol with a given name.
        case "license": // Identify the license that applies to this code.
        case "listens": // List the events that a symbol listens for.
        case "member": // (synonyms: @var) Document a member.
        case "memberof": // This symbol belongs to a parent symbol.
        case "mixes": // This object mixes in all the members from another object.
        case "mixin": // Document a mixin object.
        case "module": // Document a JavaScript module.
        case "name": // Document the name of an object.
        case "namespace": // Document a namespace object.
        case "param": //(synonyms: @arg, @argument)  Document the parameter to a function.
        case "property": // (synonyms: @prop)   Document a property of an object.
        case "requires": // This file requires a JavaScript module.
        case "returns": // (synonyms: @return) Document the return value of a function.
        case "see": // Refer to some other documentation for more information.
        case "since": // When was this feature added?
        case "summary": // A shorter version of the full description.
        case "this": // What does the 'this' keyword refer to here?
        case "throws": //(synonyms: @exception) Describe what errors could be thrown.
        case "todo": // Document tasks to be completed.
        case "tutorial": // Insert a link to an included tutorial file.
        case "type": // Document the type of an object.
        case "typedef": // Document a custom type.
        case "variation": // Distinguish different objects with the same name.
        case "version": // 
    }
}
// #endregion
//# sourceMappingURL=transpiler.js.map