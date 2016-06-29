/**
 * @fileOverview TypeScript 编译器
 * @descrition 编译 TypeScript，生成高性能的 JavaScript 和 API 文档数据。
 */
var ts = require("typescript");
var Debug = ts["Debug"];
/**
 * 表示一个 TypeScript 语法转换器。
 * @remark 转换器负责更新 TypeScript 语法树和解析 JsDoc 文档。
 */
var Transpiler = (function () {
    function Transpiler() {
        // #endregion
        // #region 解析单个文档注释
        /**
         * 存储词法分析器。
         */
        this.scanner = ts.createScanner(ts.ScriptTarget.Latest, /*skipTrivia*/ true);
    }
    /**
     * 转换指定的程序。
     * @param program 要处理的程序。
     * @param options 要使用的选项。
     */
    Transpiler.prototype.transpile = function (program, options) {
        this.program = program;
        this.options = options;
        this.checker = program.getTypeChecker();
        // 生成文档。
        if (options.doc) {
            this.jsDocs = {};
        }
        // 处理每个源文件。
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            this.transpileModule(sourceFile);
        }
    };
    /**
     * 转换指定的模块。
     * @param sourceFile
     */
    Transpiler.prototype.transpileModule = function (sourceFile) {
        this.sourceFile = sourceFile;
        if (this.options.doc) {
            this.resolveDocs();
        }
    };
    /**
     * 解析当前源码的文档注释。
     */
    Transpiler.prototype.resolveDocs = function () {
        // 创建文档对象。
        this.jsDocs[this.sourceFile.path] = this.jsDoc = {
            comments: [],
            imports: []
        };
        //// 获取属于当前文档的文档注释。
        //const sourceFileComment = this.getJsDocCommentOfSourceFile();
        //if (sourceFileComment) {
        //    this.jsDoc.title = sourceFileComment.fileOverview;
        //    this.jsDoc.keywords = sourceFileComment.keywords;
        //    this.jsDoc.author = sourceFileComment.author;
        //    this.jsDoc.description = sourceFileComment.description || sourceFileComment.summary;
        //    this.jsDoc.state = sourceFileComment.state;
        //    this.jsDoc.platform = sourceFileComment.platform.split(/\s*,\s*/);
        //    this.jsDoc.viewport = sourceFileComment.viewport;
        //}
        var me = this;
        // 解析子节点注释。
        visit(this.sourceFile);
        /**
         * 解析单个节点的文档注释。
         * @param node
         */
        function visit(node) {
            switch (node.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                    me.addDocCommentFromNode(node);
                    break;
            }
            ts.forEachChild(node, visit);
        }
    };
    /**
     * 添加属于某个节点的文档注释。
     * @param node 当前节点。
     */
    Transpiler.prototype.addDocCommentFromNode = function (node) {
        // 从节点获取文档信息。
        var docComment = this.parseDocCommentFromNode(node);
        // 添加到列表。
        if (docComment) {
            this.addJsDocComment(docComment);
        }
    };
    /**
     * 解析属于某个节点的文档注释。
     * @param node 当前节点。
     */
    Transpiler.prototype.parseDocCommentFromNode = function (node) {
        // 首先读取文档注释。
        var comments = ts.getJsDocComments(node, this.sourceFile);
        if (!comments.length)
            return;
        // 然后解析文档注释。
        var comment = comments[comments.length - 1];
        var docComment = this.parseJsDocComment(comment.pos, comment.end);
        // 从节点提取文档信息。
        // todo
        // 返回文档注释。
        return docComment;
    };
    /**
     * 获取文件的首个注释。
     * @param sourceFile
     */
    Transpiler.prototype.getJsDocCommentOfSourceFile = function () {
        //const comments: ts.CommentRange[] = (ts as any).getJsDocComments(this.sourceFile, this.sourceFile);
        //if (!comments.length) return;
        //const comment = comments[0];
        //if (!comment.hasTrailingNewLine) return;
        //return this.parseJsDoc(comment.pos, comment.end);
    };
    /**
     * 添加一个已解析的文档注释。
     * @param node 当前节点。
     */
    Transpiler.prototype.addJsDocComment = function (jsDocComment) {
        if (jsDocComment.category)
            this.category = jsDocComment.category;
        if (jsDocComment.namespace)
            this.namespace = jsDocComment.namespace;
        this.jsDoc.comments.push(jsDocComment);
    };
    /**
     * 解析指定区间的文档注释。
     * @param start 注释的起始位置。
     * @param end 注释的结束位置。
     */
    Transpiler.prototype.parseJsDocComment = function (start, end) {
        _("解析注释：" + this.sourceFile.text.substring(start, end));
        // 初始化结果。
        var p = ts.getLineAndCharacterOfPosition(this.sourceFile, start);
        this.jsDocComment = { line: p.line, column: p.character };
        // 初始化扫描器。
        this.scanner.setText(this.sourceFile.text, start + 3, end - start - 5);
        // 解析所有标签前的文本。
        this.handleHtmlTag("summary", this.scanToJSDocTagStart());
        // 解析每个标签。
        while (this.scanner.getToken() !== ts.SyntaxKind.EndOfFileToken) {
            Debug.assert(this.scanner.getToken() === ts.SyntaxKind.AtToken);
            // 解析标签名。
            this.scanner.scanJSDocToken();
            var tagName = this.scanner.getTokenText();
            // 解析标签空格。
            this.scanner.scanJSDocToken();
            this.handleTag(tagName);
        }
        return this.jsDocComment;
    };
    /**
     * 读取标记到下一个文档注释标签为止。
     * @return 返回读取到的文本，其中不包含前缀的 *。
     */
    Transpiler.prototype.scanToJSDocTagStart = function () {
        var buffer = "";
        var canParseTag = true;
        var seenAsterisk = true;
        var pos = this.scanner.getTokenPos();
        while (true) {
            switch (this.scanner.scanJSDocToken()) {
                case ts.SyntaxKind.AtToken:
                    if (canParseTag) {
                        return (buffer + this.sourceFile.text.substring(pos, this.scanner.getTokenPos())).trim();
                    }
                    break;
                case ts.SyntaxKind.NewLineTrivia:
                    buffer += this.sourceFile.text.substring(pos, this.scanner.getTokenPos()).trim();
                    (buffer + this.sourceFile.text.substring(pos, this.scanner.getTokenPos())).trim();
                    if (buffer.charCodeAt(buffer.length - 1) !== 10 /*\n*/) {
                        buffer += "\n";
                    }
                    pos = this.scanner.getTextPos();
                    canParseTag = true;
                    seenAsterisk = false;
                    break;
                case ts.SyntaxKind.AsteriskToken:
                    if (seenAsterisk) {
                        canParseTag = false;
                    }
                    else {
                        seenAsterisk = true;
                        pos = this.scanner.getTextPos();
                    }
                    break;
                case ts.SyntaxKind.EndOfFileToken:
                    return (buffer + this.sourceFile.text.substring(pos, this.scanner.getTokenPos())).trim();
            }
        }
    };
    /**
     * 解析指定的标记。
     * @param kind 期待的标记。
     */
    Transpiler.prototype.parseExpected = function (kind) {
        if (this.scanner.getToken() === kind) {
            this.scanner.scanJSDocToken();
            return true;
        }
        this.reportJsDocError("Unexpected token " + ts.SyntaxKind[this.scanner.getToken()] + ". Expected " + ts.SyntaxKind[kind]);
        return false;
    };
    /**
     * 如果匹配则解析指定的标记。
     * @param kind 期待的标记。
     */
    Transpiler.prototype.parseOptional = function (kind) {
        if (this.scanner.getToken() === kind) {
            this.scanner.scanJSDocToken();
            return true;
        }
        return false;
    };
    /**
     * 完成指定节点的读取，追加节点结束位置信息。
     * @param node 解析完成的节点。
     */
    Transpiler.prototype.finishNode = function (node) {
        node.end = this.scanner.getStartPos();
        return node;
    };
    /**
     * 报告一个文档注释解析错误。
     * @param message 错误内容。
     */
    Transpiler.prototype.reportJsDocError = function (message) {
        this.jsDocComment.diagnostics.push({
            file: this.sourceFile,
            start: this.scanner.getTokenPos(),
            length: this.scanner.getTextPos() - this.scanner.getTokenPos(),
            messageText: message,
            category: ts.DiagnosticCategory.Warning,
            code: -1
        });
    };
    /**
     * 从源文件的文档注释标签截取信息。
     * @param tagName 标签名。
     */
    Transpiler.prototype.handleTag = function (tagName) {
        console.log("标签：", tagName, JSON.stringify(this.scanToJSDocTagStart()));
        switch (tagName.toLowerCase()) {
            //// 类型名
            //case "augments":
            //case "extend":
            //    return this.handleTag("extends", argument, tag, result);
            //case "module": // Document a JavaScript module.
            //    return this.handleTag("namespace", argument, tag, result);
            //case "lends": // Document properties on an object literal as if they belonged to a symbol with a given name.
            //    return this.handleTag("memberof", argument, tag, result);
            //case "extends": // (synonyms: @extends)  Indicate that a symbol inherits from, ands adds to, a parent symbol.
            //case "namespace": // Document a namespace object.
            //case "memberof": // This symbol belongs to a parent symbol.
            //    if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
            //    // TODO：解析 argument 为类型。
            //    result[tagName] = argument;
            //    break;
            //// 允许重复的类型名
            //case "implements": // This symbol implements an interface.
            //case "borrows": // This object uses something from another object.
            //    // TODO：解析 argument 为类型。
            //    result[tagName] = result[tagName] || [];
            //    result[tagName].push(argument);
            //    break;
            //// 成员名
            //case "emits":
            //    return this.handleTag("fires", argument, tag, result);
            //case "name": // Document the name of an object.
            //case "fires":// (synonyms: @emits)  Describe the events this method may fire.
            //case "alias": // Treat a member as if it had a different name.
            //    if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
            //    // TODO：解析 argument 为名字。
            //    result[tagName] = argument;
            //    break;
            //// 单行文本
            //// 允许重复的单行文本
            //case "author": // Identify the author of an item.
            //case "copyright": // Document some copyright information.
            //case "license": // Identify the license that applies to this code.
            //    result[tagName] = (result[tagName] ? result[tagName] + "," : "") + argument;
            //    break;
            //// 多行文本
            //case "desc":
            //    return this.handleTag("description", argument, tag, result);
            //case "fileoverview":
            //case "fileOverview":
            //case "overview":
            //    return this.handleTag("file", argument, tag, result);
            //case "classdesc": // Use the following text to describe the entire class.
            //case "summary": // A shorter version of the full description.
            //case "description": // (synonyms: @desc) Describe a symbol.
            //case "file"://(synonyms: @fileoverview, @overview)  Describe a file.
            //case "todo": // Document tasks to be completed.
            //    result[tagName] = (result[tagName] ? result[tagName] + "\n" : "") + argument;
            //    break;
            //// 地址
            //case "see": // Refer to some other documentation for more information.
            //case "requires": // This file requires a JavaScript module.
            //case "throws": //(synonyms: @exception) Describe what errors could be thrown.
            //    result[tagName] = result[tagName] || [];
            //    // TODO: 解析特殊的地址
            //    result[tagName].push(argument);
            //    break;
            //// 布尔型标签
            //case "inner": // Document an inner object.
            //    return this.handleTag("internal", argument, tag, result);
            //case "host": // Document an inner object.
            //    return this.handleTag("external", argument, tag, result);
            //case "abstract": // This member must be implemented by the inheritor.
            //case "virtual": // This member must be overridden by the inheritor.
            //case "override": // Indicate that a symbol overrides its parent.
            //case "readonly": // This symbol is meant to be read- only.
            //case "private": // This symbol is meant to be private.
            //case "protected": // This symbol is meant to be protected.
            //case "public": // This symbol is meant to be public.
            //case "internal": // This symbol is meant to be internal.
            //case "static": // Document a static member.
            //case "ignore": // Omit a symbol from the documentation.
            //case "external"://(synonyms: @host)  Identifies an external class, namespace, or module.
            //case "inheritdoc": // Indicate that a symbol should inherit its parent's documentation.
            //    if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tagName}. The specific member has been marked as ${tagName}.`);
            //    if (argument) this.reportDocError(result, tag, `Tag @${tagName} has no parameters.`);
            //    result[tagName] = true;
            //    break;
            //// 可选名字的布尔型标签
            //case "func":
            //case "method":
            //    return this.handleTag("function", argument, tag, result);
            //case "prop":
            //    return this.handleTag("property", argument, tag, result);
            //case "constructs": // This function member will be the constructor for the previous class.
            //case "constructor":
            //    return this.handleTag("class", argument, tag, result);
            //case "constant":
            //    return this.handleTag("const", argument, tag, result);
            //case "var":
            //    return this.handleTag("member", argument, tag, result);
            //case "function": // (synonyms: @func, @method)  Describe a function or method.
            //case "property": // (synonyms: @prop)   Document a property of an object.
            //case "class": //  (synonyms: @constructor) This function is intended to be called with the "new" keyword.
            //case "interface": // This symbol is an interface that others can implement
            //case "enum": // Document a collection of related properties.
            //case "const": // (synonyms: @const)  Document an object as a constant.
            //case "member": // (synonyms: @var) Document a member.
            //case "callback": // Document a callback function.
            //case "event": // Document an event.
            //case "config": // Document a config.
            //case "exports": // Identify the member that is exported by a JavaScript module.
            //case "instance": // Document an instance member..
            //case "global": // Document a global object.
            //    // TODO：解析 argument 为名字。
            //    if (argument) result.name = argument;
            //    argument[argument] = true;
            //    break;
            //// 代码
            //case "default": //  (synonyms: @defaultvalue)  Document the default value.
            //case "example": // Provide an example of how to use a documented item.
            //    argument[argument] = result;
            //    break;
            //case "defaultvalue":
            //    return this.handleTag("default", argument, tag, result);
            //// 版本
            //case "deprecated": // Document that this is no longer the preferred way.
            //case "version": // Documents the version number of an item.
            //case "since": // When was this feature added?
            //    if (result[tagName]) this.reportDocError(result, tag, `Duplicate tag: @${tag.tagName.text}.`);
            //    // TODO：解析版本号
            //    result[tagName] = argument;
            //    break;
            // 特定标签
            case "return":
                return this.handleTag("returns");
            case "returns":
                var type = this.tryParseJSDocTypeExpression();
                break;
        }
    };
    /**
     * 处理单行文本类标签。
     * @param tagName 标签名。
     * @param text 内容。
     */
    Transpiler.prototype.handleTextTag = function (tagName, text) {
        if (!text) {
            return;
        }
    };
    /**
     * 处理多行文本类标签。
     * @param tagName 标签名。
     * @param text 内容。
     */
    Transpiler.prototype.handleHtmlTag = function (tagName, text) {
        if (!text) {
            return;
        }
    };
    // #endregion
    // #region 解析类型
    /**
     * 如果存在则解析文档注释中的 {*类型*}。
     */
    Transpiler.prototype.tryParseJSDocTypeExpression = function () {
        if (this.scanner.getToken() !== ts.SyntaxKind.OpenBraceToken) {
            return undefined;
        }
        var typeExpression = this.parseJSDocTypeExpression();
        return typeExpression;
    };
    /**
     * 解析文档注释中的 {*类型*}。
     */
    Transpiler.prototype.parseJSDocTypeExpression = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocTypeExpression, this.scanner.getTokenPos());
        this.parseExpected(ts.SyntaxKind.OpenBraceToken);
        result.type = this.parseJSDocTopLevelType();
        this.parseExpected(ts.SyntaxKind.CloseBraceToken);
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocTopLevelType = function () {
        var type = this.parseJSDocType();
        if (this.scanner.getToken() === ts.SyntaxKind.BarToken /*|*/) {
            var unionType = ts.createNode(ts.SyntaxKind.JSDocUnionType, type.pos);
            unionType.types = this.parseJSDocTypeList(type);
            type = this.finishNode(unionType);
        }
        if (this.scanner.getToken() === ts.SyntaxKind.EqualsToken /*=*/) {
            var optionalType = ts.createNode(ts.SyntaxKind.JSDocOptionalType, type.pos);
            this.scanner.scanJSDocToken();
            optionalType.type = type;
            type = this.finishNode(optionalType);
        }
        return type;
    };
    Transpiler.prototype.parseJSDocType = function () {
        var type = this.parseBasicTypeExpression();
        while (true) {
            if (this.scanner.getToken() === ts.SyntaxKind.OpenBracketToken) {
                var arrayType = ts.createNode(ts.SyntaxKind.JSDocArrayType, type.pos);
                arrayType.elementType = type;
                this.scanner.scanJSDocToken();
                this.parseExpected(ts.SyntaxKind.CloseBracketToken);
                type = this.finishNode(arrayType);
            }
            else if (this.scanner.getToken() === ts.SyntaxKind.QuestionToken) {
                var nullableType = ts.createNode(ts.SyntaxKind.JSDocNullableType, type.pos);
                nullableType.type = type;
                this.scanner.scanJSDocToken();
                type = this.finishNode(nullableType);
            }
            else if (this.scanner.getToken() === ts.SyntaxKind.ExclamationToken) {
                var nonNullableType = ts.createNode(ts.SyntaxKind.JSDocNonNullableType, type.pos);
                nonNullableType.type = type;
                this.scanner.scanJSDocToken();
                type = this.finishNode(nonNullableType);
            }
            else {
                break;
            }
        }
        return type;
    };
    Transpiler.prototype.parseBasicTypeExpression = function () {
        switch (this.scanner.getToken()) {
            case ts.SyntaxKind.AsteriskToken:
                return this.parseJSDocAllType();
            case ts.SyntaxKind.QuestionToken:
                return this.parseJSDocUnknownOrNullableType();
            case ts.SyntaxKind.OpenParenToken:
                return this.parseJSDocUnionType();
            case ts.SyntaxKind.OpenBracketToken:
                return this.parseJSDocTupleType();
            case ts.SyntaxKind.ExclamationToken:
                return this.parseJSDocNonNullableType();
            case ts.SyntaxKind.OpenBraceToken:
                return this.parseJSDocRecordType();
            case ts.SyntaxKind.FunctionKeyword:
                return this.parseJSDocFunctionType();
            case ts.SyntaxKind.DotDotDotToken:
                return this.parseJSDocVariadicType();
            case ts.SyntaxKind.NewKeyword:
                return this.parseJSDocConstructorType();
            case ts.SyntaxKind.ThisKeyword:
                return this.parseJSDocThisType();
            case ts.SyntaxKind.AnyKeyword:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.BooleanKeyword:
            case ts.SyntaxKind.SymbolKeyword:
            case ts.SyntaxKind.VoidKeyword:
                return this.parseTokenNode();
        }
        // TODO (drosen): Parse string literal types in JsDoc as well.
        return this.parseJSDocTypeReference();
    };
    Transpiler.prototype.parseTokenNode = function () {
        var node = ts.createNode(this.scanner.getToken());
        this.scanner.scanJSDocToken();
        return this.finishNode(node);
    };
    Transpiler.prototype.parseJSDocThisType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocThisType);
        this.scanner.scanJSDocToken();
        this.parseExpected(ts.SyntaxKind.ColonToken);
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocConstructorType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocConstructorType);
        this.scanner.scanJSDocToken();
        this.parseExpected(ts.SyntaxKind.ColonToken);
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocVariadicType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocVariadicType);
        this.scanner.scanJSDocToken();
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocFunctionType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocFunctionType);
        this.scanner.scanJSDocToken();
        this.parseExpected(ts.SyntaxKind.OpenParenToken);
        result.parameters = this.parseDelimitedList(this.parseJSDocParameter, ts.SyntaxKind.CloseParenToken);
        if (this.scanner.getToken() === ts.SyntaxKind.ColonToken) {
            this.scanner.scanJSDocToken();
            result.type = this.parseJSDocType();
        }
        return this.finishNode(result);
    };
    Transpiler.prototype.parseDelimitedList = function (parseElement, terminatorToken) {
        var result = [];
        result.pos = this.scanner.getStartPos();
        while (!this.parseOptional(terminatorToken)) {
            if (this.scanner.getToken() !== ts.SyntaxKind.CommaToken) {
                result.hasTrailingComma = false;
                result.push(parseElement.call(this));
            }
            if (this.parseOptional(ts.SyntaxKind.CommaToken)) {
                result.hasTrailingComma = true;
                continue;
            }
            // 缺少逗号。
            this.parseExpected(ts.SyntaxKind.CommaToken);
            // 换行后自动终止。
            this.scanner.scanJSDocToken();
            if (this.scanner.hasPrecedingLineBreak()) {
                break;
            }
        }
        result.end = this.scanner.getStartPos();
        return result;
    };
    Transpiler.prototype.isJSDocType = function () {
        switch (this.scanner.getToken()) {
            case ts.SyntaxKind.AsteriskToken:
            case ts.SyntaxKind.QuestionToken:
            case ts.SyntaxKind.OpenParenToken:
            case ts.SyntaxKind.OpenBracketToken:
            case ts.SyntaxKind.ExclamationToken:
            case ts.SyntaxKind.OpenBraceToken:
            case ts.SyntaxKind.FunctionKeyword:
            case ts.SyntaxKind.DotDotDotToken:
            case ts.SyntaxKind.NewKeyword:
            case ts.SyntaxKind.ThisKeyword:
                return true;
        }
        return ts["tokenIsIdentifierOrKeyword"](this.scanner.getToken());
    };
    Transpiler.prototype.parseJSDocParameter = function () {
        var parameter = ts.createNode(ts.SyntaxKind.Parameter);
        parameter.type = this.parseJSDocType();
        if (this.parseOptional(ts.SyntaxKind.EqualsToken)) {
            parameter.questionToken = ts.createNode(ts.SyntaxKind.EqualsToken);
        }
        return this.finishNode(parameter);
    };
    Transpiler.prototype.parseJSDocTypeReference = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocTypeReference);
        result.name = this.parseSimplePropertyName();
        if (this.scanner.getToken() === ts.SyntaxKind.LessThanToken) {
            result.typeArguments = this.parseTypeArguments();
        }
        else {
            while (this.parseOptional(ts.SyntaxKind.DotToken)) {
                if (this.scanner.getToken() === ts.SyntaxKind.LessThanToken) {
                    result.typeArguments = this.parseTypeArguments();
                    break;
                }
                else {
                    result.name = this.parseQualifiedName(result.name);
                }
            }
        }
        return this.finishNode(result);
    };
    Transpiler.prototype.parseTypeArguments = function () {
        // Move past the <
        this.scanner.scanJSDocToken();
        var typeArguments = this.parseDelimitedList(this.parseJSDocType, ts.SyntaxKind.GreaterThanToken);
        return typeArguments;
    };
    Transpiler.prototype.parseQualifiedName = function (left) {
        var result = ts.createNode(ts.SyntaxKind.QualifiedName, left.pos);
        result.left = left;
        result.right = this.parseSimplePropertyName();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocRecordType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocRecordType);
        this.scanner.scanJSDocToken();
        result.members = this.parseDelimitedList(this.parseJSDocRecordMember, ts.SyntaxKind.CloseBraceToken);
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocRecordMember = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocRecordMember);
        result.name = this.parseSimplePropertyName();
        if (this.scanner.getToken() === ts.SyntaxKind.ColonToken) {
            this.scanner.scanJSDocToken();
            result.type = this.parseJSDocType();
        }
        return this.finishNode(result);
    };
    Transpiler.prototype.parseSimplePropertyName = function () {
        this.scanner.scanJSDocToken();
        var result = ts.createNode(ts.SyntaxKind.Identifier, this.scanner.getTokenPos());
        result.text = this.scanner.getTokenText();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocNonNullableType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocNonNullableType);
        this.scanner.scanJSDocToken();
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocTupleType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocTupleType);
        this.scanner.scanJSDocToken();
        result.types = this.parseDelimitedList(this.parseJSDocType, ts.SyntaxKind.CloseBracketToken);
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocUnionType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocUnionType);
        this.scanner.scanJSDocToken();
        result.types = this.parseJSDocTypeList(this.parseJSDocType());
        this.parseExpected(ts.SyntaxKind.CloseParenToken);
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocTypeList = function (firstType) {
        Debug.assert(!!firstType);
        var types = [];
        types.pos = firstType.pos;
        types.push(firstType);
        while (this.parseOptional(ts.SyntaxKind.BarToken)) {
            types.push(this.parseJSDocType());
        }
        types.end = this.scanner.getStartPos();
        return types;
    };
    Transpiler.prototype.parseJSDocAllType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocAllType);
        this.scanner.scanJSDocToken();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocUnknownOrNullableType = function () {
        var pos = this.scanner.getStartPos();
        // skip the ?
        this.scanner.scanJSDocToken();
        // Need to lookahead to decide if this is a nullable or unknown type.
        // Here are cases where we'll pick the unknown type:
        //
        //      Foo(?,
        //      { a: ? }
        //      Foo(?)
        //      Foo<?>
        //      Foo(?=
        //      (?|
        if (this.scanner.getToken() === ts.SyntaxKind.CommaToken ||
            this.scanner.getToken() === ts.SyntaxKind.CloseBraceToken ||
            this.scanner.getToken() === ts.SyntaxKind.CloseParenToken ||
            this.scanner.getToken() === ts.SyntaxKind.GreaterThanToken ||
            this.scanner.getToken() === ts.SyntaxKind.EqualsToken ||
            this.scanner.getToken() === ts.SyntaxKind.BarToken) {
            var result = ts.createNode(ts.SyntaxKind.JSDocUnknownType, pos);
            return this.finishNode(result);
        }
        else {
            var result = ts.createNode(ts.SyntaxKind.JSDocNullableType, pos);
            result.type = this.parseJSDocType();
            return this.finishNode(result);
        }
    };
    return Transpiler;
}());
/**
 * 遍历一个节点并执行更新操作。
 * @param node 要遍历的父节点。
 * @param callback 回调函数。函数返回用于更新的节点，如果函数返回 null，说明删除当前节点。
 */
function mapChild(node, callback) {
    if (!node)
        return;
    switch (node.kind) {
        case ts.SyntaxKind.QualifiedName:
            node.left = callback(node.left);
            node.right = callback(node.right);
            return;
        case ts.SyntaxKind.TypeParameter:
            node.name = callback(node.name);
            node.constraint = callback(node.constraint);
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.ShorthandPropertyAssignment:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            node.questionToken = callback(node.questionToken);
            node.equalsToken = callback(node.equalsToken);
            node.objectAssignmentInitializer = callback(node.objectAssignmentInitializer);
            return;
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.BindingElement:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.propertyName = callback(node.propertyName);
            node.dotDotDotToken = callback(node.dotDotDotToken);
            node.name = callback(node.name);
            node.questionToken = callback(node.questionToken);
            node.type = callback(node.type);
            node.initializer = callback(node.initializer);
            return;
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.IndexSignature:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            mapArray(node.typeParameters, callback);
            mapArray(node.parameters, callback);
            node.type = callback(node.type);
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
            node.asteriskToken = node.asteriskToken && callback(node.asteriskToken);
            node.name = callback(node.name);
            node.questionToken = node.questionToken && callback(node.questionToken);
            mapArray(node.typeParameters, callback);
            mapArray(node.parameters, callback);
            node.type = node.type && callback(node.type);
            node.equalsGreaterThanToken = node.equalsGreaterThanToken && callback(node.equalsGreaterThanToken);
            node.body = node.body && callback(node.body);
            return;
        case ts.SyntaxKind.TypeReference:
            node.typeName = callback(node.typeName);
            mapArray(node.typeArguments, callback);
            return;
        case ts.SyntaxKind.TypePredicate:
            node.parameterName = callback(node.parameterName);
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.TypeQuery:
            node.exprName = callback(node.exprName);
            return;
        case ts.SyntaxKind.TypeLiteral:
            mapArray(node.members, callback);
            return;
        case ts.SyntaxKind.ArrayType:
            node.elementType = callback(node.elementType);
            return;
        case ts.SyntaxKind.TupleType:
            mapArray(node.elementTypes, callback);
            return;
        case ts.SyntaxKind.UnionType:
        case ts.SyntaxKind.IntersectionType:
            mapArray(node.types, callback);
            return;
        case ts.SyntaxKind.ParenthesizedType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.ObjectBindingPattern:
        case ts.SyntaxKind.ArrayBindingPattern:
            mapArray(node.elements, callback);
            return;
        case ts.SyntaxKind.ArrayLiteralExpression:
            mapArray(node.elements, callback);
            return;
        case ts.SyntaxKind.ObjectLiteralExpression:
            mapArray(node.properties, callback);
            return;
        case ts.SyntaxKind.PropertyAccessExpression:
            node.expression = callback(node.expression);
            node.dotToken = callback(node.dotToken);
            node.name = callback(node.name);
            return;
        case ts.SyntaxKind.ElementAccessExpression:
            node.expression = callback(node.expression);
            node.argumentExpression = callback(node.argumentExpression);
            return;
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
            node.expression = callback(node.expression);
            mapArray(node.typeArguments, callback);
            mapArray(node.arguments, callback);
            return;
        case ts.SyntaxKind.TaggedTemplateExpression:
            node.tag = callback(node.tag);
            node.template = callback(node.template);
            return;
        case ts.SyntaxKind.TypeAssertionExpression:
            node.type = callback(node.type);
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.ParenthesizedExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.DeleteExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.TypeOfExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.VoidExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.PrefixUnaryExpression:
            node.operand = callback(node.operand);
            return;
        case ts.SyntaxKind.YieldExpression:
            node.asteriskToken = callback(node.asteriskToken);
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.AwaitExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.PostfixUnaryExpression:
            node.operand = callback(node.operand);
            return;
        case ts.SyntaxKind.BinaryExpression:
            node.left = callback(node.left);
            node.operatorToken = callback(node.operatorToken);
            node.right = callback(node.right);
            return;
        case ts.SyntaxKind.AsExpression:
            node.expression = callback(node.expression);
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.ConditionalExpression:
            node.condition = callback(node.condition);
            node.questionToken = callback(node.questionToken);
            node.whenTrue = callback(node.whenTrue);
            node.colonToken = callback(node.colonToken);
            node.whenFalse = callback(node.whenFalse);
            return;
        case ts.SyntaxKind.SpreadElementExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.Block:
        case ts.SyntaxKind.ModuleBlock:
            mapArray(node.statements, callback);
            return;
        case ts.SyntaxKind.SourceFile:
            mapArray(node.statements, callback);
            node.endOfFileToken = callback(node.endOfFileToken);
            return;
        case ts.SyntaxKind.VariableStatement:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.declarationList = callback(node.declarationList);
            return;
        case ts.SyntaxKind.VariableDeclarationList:
            mapArray(node.declarations, callback);
            return;
        case ts.SyntaxKind.ExpressionStatement:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.IfStatement:
            node.expression = callback(node.expression);
            node.thenStatement = callback(node.thenStatement);
            node.elseStatement = callback(node.elseStatement);
            return;
        case ts.SyntaxKind.DoStatement:
            node.statement = callback(node.statement);
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.WhileStatement:
            node.expression = callback(node.expression);
            node.statement = callback(node.statement);
            return;
        case ts.SyntaxKind.ForStatement:
            node.initializer = callback(node.initializer);
            node.condition = callback(node.condition);
            node.incrementor = callback(node.incrementor);
            node.statement = callback(node.statement);
            return;
        case ts.SyntaxKind.ForInStatement:
            node.initializer = callback(node.initializer);
            node.expression = callback(node.expression);
            node.statement = callback(node.statement);
            return;
        case ts.SyntaxKind.ForOfStatement:
            node.initializer = callback(node.initializer);
            node.expression = callback(node.expression);
            node.statement = callback(node.statement);
            return;
        case ts.SyntaxKind.ContinueStatement:
        case ts.SyntaxKind.BreakStatement:
            node.label = callback(node.label);
            return;
        case ts.SyntaxKind.ReturnStatement:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.WithStatement:
            node.expression = callback(node.expression);
            node.statement = callback(node.statement);
            return;
        case ts.SyntaxKind.SwitchStatement:
            node.expression = callback(node.expression);
            node.caseBlock = callback(node.caseBlock);
            return;
        case ts.SyntaxKind.CaseBlock:
            mapArray(node.clauses, callback);
            return;
        case ts.SyntaxKind.CaseClause:
            node.expression = callback(node.expression);
            mapArray(node.statements, callback);
            return;
        case ts.SyntaxKind.DefaultClause:
            mapArray(node.statements, callback);
            return;
        case ts.SyntaxKind.LabeledStatement:
            node.label = callback(node.label);
            node.statement = callback(node.statement);
            return;
        case ts.SyntaxKind.ThrowStatement:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.TryStatement:
            node.tryBlock = callback(node.tryBlock);
            node.catchClause = callback(node.catchClause);
            node.finallyBlock = callback(node.finallyBlock);
            return;
        case ts.SyntaxKind.CatchClause:
            node.variableDeclaration = callback(node.variableDeclaration);
            node.block = callback(node.block);
            return;
        case ts.SyntaxKind.Decorator:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            mapArray(node.typeParameters, callback);
            mapArray(node.heritageClauses, callback);
            mapArray(node.members, callback);
            return;
        case ts.SyntaxKind.InterfaceDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            mapArray(node.typeParameters, callback);
            mapArray(node.heritageClauses, callback);
            mapArray(node.members, callback);
            return;
        case ts.SyntaxKind.TypeAliasDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            mapArray(node.typeParameters, callback);
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.EnumDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            mapArray(node.members, callback);
            return;
        case ts.SyntaxKind.EnumMember:
            node.name = callback(node.name);
            node.initializer = callback(node.initializer);
            return;
        case ts.SyntaxKind.ModuleDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            node.body = callback(node.body);
            return;
        case ts.SyntaxKind.ImportEqualsDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.name = callback(node.name);
            node.moduleReference = callback(node.moduleReference);
            return;
        case ts.SyntaxKind.ImportDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.importClause = callback(node.importClause);
            node.moduleSpecifier = callback(node.moduleSpecifier);
            return;
        case ts.SyntaxKind.ImportClause:
            node.name = callback(node.name);
            node.namedBindings = callback(node.namedBindings);
            return;
        case ts.SyntaxKind.NamespaceImport:
            node.name = callback(node.name);
            return;
        case ts.SyntaxKind.NamedImports:
        case ts.SyntaxKind.NamedExports:
            mapArray(node.elements, callback);
            return;
        case ts.SyntaxKind.ExportDeclaration:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.exportClause = callback(node.exportClause);
            node.moduleSpecifier = callback(node.moduleSpecifier);
            return;
        case ts.SyntaxKind.ImportSpecifier:
        case ts.SyntaxKind.ExportSpecifier:
            node.propertyName = callback(node.propertyName);
            node.name = callback(node.name);
            return;
        case ts.SyntaxKind.ExportAssignment:
            mapArray(node.decorators, callback);
            mapArray(node.modifiers, callback);
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.TemplateExpression:
            mapArray(node.templateSpans, callback);
            node.head = callback(node.head);
            return;
        case ts.SyntaxKind.TemplateSpan:
            node.expression = callback(node.expression);
            node.literal = callback(node.literal);
            return;
        case ts.SyntaxKind.ComputedPropertyName:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.HeritageClause:
            mapArray(node.types, callback);
            return;
        case ts.SyntaxKind.ExpressionWithTypeArguments:
            node.expression = callback(node.expression);
            mapArray(node.typeArguments, callback);
            return;
        case ts.SyntaxKind.ExternalModuleReference:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.MissingDeclaration:
            mapArray(node.decorators, callback);
            return;
        case ts.SyntaxKind.JsxElement:
            node.openingElement = callback(node.openingElement);
            mapArray(node.children, callback);
            node.closingElement = callback(node.closingElement);
            return;
        case ts.SyntaxKind.JsxSelfClosingElement:
        case ts.SyntaxKind.JsxOpeningElement:
            node.tagName = callback(node.tagName);
            mapArray(node.attributes, callback);
            return;
        case ts.SyntaxKind.JsxAttribute:
            node.name = callback(node.name);
            node.initializer = callback(node.initializer);
            return;
        case ts.SyntaxKind.JsxSpreadAttribute:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.JsxExpression:
            node.expression = callback(node.expression);
            return;
        case ts.SyntaxKind.JsxClosingElement:
            node.tagName = callback(node.tagName);
            return;
        case ts.SyntaxKind.JSDocTypeExpression:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocUnionType:
            mapArray(node.types, callback);
            return;
        case ts.SyntaxKind.JSDocTupleType:
            mapArray(node.types, callback);
            return;
        case ts.SyntaxKind.JSDocArrayType:
            node.elementType = callback(node.elementType);
            return;
        case ts.SyntaxKind.JSDocNonNullableType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocNullableType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocRecordType:
            mapArray(node.members, callback);
            return;
        case ts.SyntaxKind.JSDocTypeReference:
            node.name = callback(node.name);
            mapArray(node.typeArguments, callback);
            return;
        case ts.SyntaxKind.JSDocOptionalType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocFunctionType:
            mapArray(node.parameters, callback);
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocVariadicType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocConstructorType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocThisType:
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocRecordMember:
            node.name = callback(node.name);
            node.type = callback(node.type);
            return;
        case ts.SyntaxKind.JSDocComment:
            mapArray(node.tags, callback);
            return;
        case ts.SyntaxKind.JSDocParameterTag:
            node.preParameterName = callback(node.preParameterName);
            node.typeExpression = callback(node.typeExpression);
            node.postParameterName = callback(node.postParameterName);
            return;
        case ts.SyntaxKind.JSDocReturnTag:
            node.typeExpression = callback(node.typeExpression);
            return;
        case ts.SyntaxKind.JSDocTypeTag:
            node.typeExpression = callback(node.typeExpression);
            return;
        case ts.SyntaxKind.JSDocTemplateTag:
            mapArray(node.typeParameters, callback);
            return;
    }
}
/**
 * 遍历一个节点并执行更新操作。
 * @param nodes 要遍历的父节点。
 * @param callback 回调函数。函数返回用于更新的节点，如果函数返回 null，说明删除当前节点。
 */
function mapArray(nodes, callback) {
    if (!nodes)
        return;
    for (var i = 0; i < nodes.length; i++) {
        nodes[i] = callback(nodes[i]);
        if (nodes[i] == null) {
            nodes.splice(i--, 1);
        }
    }
}
// #endregion
// #region 更改系统 API
// 全局统一使用的转换器。
var transpiler = new Transpiler();
// 更改创建程序的方式。
var createProgram = ts.createProgram;
ts.createProgram = function (rootNames, options, host, oldProgram) {
    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;
    // 编译。
    var program = createProgram.apply(this, arguments);
    // 转换。
    transpiler.transpile(program, options);
    // 语法转换。
    return program;
};
// 更新注释。
var writeCommentRange = ts.writeCommentRange;
ts.writeCommentRange = function (text, lineMap, writer, comment, newLine) {
    // console.log("输出注释:" + text.substring(comment.pos, comment.end));
    return writeCommentRange.apply(this, arguments);
};
// 添加文档。
var transpileModule = ts.transpileModule;
ts.transpileModule = function (input, transpileOptions) {
    var result = transpileModule.apply(this, arguments);
    if (transpiler.options.doc) {
        result["jsDoc"] = transpiler.jsDocs;
    }
    return result;
};
// #endregion
var _ = console.log.bind(console);
module.exports = ts;
//# sourceMappingURL=tscript.js.map