/**
 * @fileOverview TypeScript 编译器
 * @descrition 编译 TypeScript，生成高性能的 JavaScript 和 API 文档数据。
 */
var ts = require("typescript");
var Debug = ts["Debug"];
/**
 * 表示一个 TypeScript 语法转换器。
 * @remark 转换器负责更新 TypeScript 语法树和解析 JSDoc 文档。
 */
var Transpiler = (function () {
    function Transpiler() {
        /**
         * 默认的扫描器。
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
    // #endregion
    // #region 节点遍历
    /**
     * 解析指定的类型字符串实际指代的类型。
     * @param pos
     * @param text
     */
    Transpiler.prototype.stringToType = function (text, pos, end) {
        // ts.createScanner(this.options.target, true, this.options.jsx == ts.JsxEmit.None ? ts.LanguageVariant.Standard : ts.LanguageVariant.JSX, text, null, pos, end - pos);
        // return this.checker.getTypeAtLocation();
    };
    /**
     * 解析当前源码的文档注释。
     */
    Transpiler.prototype.resolveDocs = function () {
        // 创建文档对象。
        this.jsDocs[this.sourceFile.path] = this.jsDoc = {
            members: [],
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
            this.addDocComment(docComment);
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
        var docComment = this.parseDocComment(comment.pos, comment.end);
        // 从节点提取文档信息。
        // 返回文档注释。
        return docComment;
    };
    /**
     * 解析指定区间的文档注释。
     * @param start 注释的起始位置。
     * @param end 注释的结束位置。
     */
    Transpiler.prototype.parseDocComment = function (start, end) {
        _("解析注释：" + this.sourceFile.text.substring(start, end));
        this.scanner.setText(this.sourceFile.text, start + 3, end - start - 5);
        var p = ts.getLineAndCharacterOfPosition(this.sourceFile, start);
        this.jsDocComment = { line: p.line, column: p.character };
        // 解析前缀文本。
        var summary = this.scanToJSDocTagStart();
        _("文本：", summary);
        // 解析每个标签。
        while (this.scanner.getToken() !== ts.SyntaxKind.EndOfFileToken) {
            Debug.assert(this.scanner.getToken() === ts.SyntaxKind.AtToken);
            this.scanner.scanJSDocToken();
            var tagName = this.scanner.getTokenText();
            this.scanner.scanJSDocToken();
            this.parseJsDocTag(tagName);
        }
        return this.jsDocComment;
    };
    /**
     * 解析到下一个 JSDoc 标签开始。
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
     * 从源文件的文档注释标签截取信息。
     * @param tagName 标签名。
     */
    Transpiler.prototype.parseJsDocTag = function (tagName) {
        console.log("标签：", tagName, JSON.stringify(this.scanToJSDocTagStart()));
        switch (tagName.toLowerCase()) {
            //// 类型名
            //case "augments":
            //case "extend":
            //    return this.parseJsDocTag("extends", argument, tag, result);
            //case "module": // Document a JavaScript module.
            //    return this.parseJsDocTag("namespace", argument, tag, result);
            //case "lends": // Document properties on an object literal as if they belonged to a symbol with a given name.
            //    return this.parseJsDocTag("memberof", argument, tag, result);
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
            //    return this.parseJsDocTag("fires", argument, tag, result);
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
            //    return this.parseJsDocTag("description", argument, tag, result);
            //case "fileoverview":
            //case "fileOverview":
            //case "overview":
            //    return this.parseJsDocTag("file", argument, tag, result);
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
            //    return this.parseJsDocTag("internal", argument, tag, result);
            //case "host": // Document an inner object.
            //    return this.parseJsDocTag("external", argument, tag, result);
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
            //    return this.parseJsDocTag("function", argument, tag, result);
            //case "prop":
            //    return this.parseJsDocTag("property", argument, tag, result);
            //case "constructs": // This function member will be the constructor for the previous class.
            //case "constructor":
            //    return this.parseJsDocTag("class", argument, tag, result);
            //case "constant":
            //    return this.parseJsDocTag("const", argument, tag, result);
            //case "var":
            //    return this.parseJsDocTag("member", argument, tag, result);
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
            //    return this.parseJsDocTag("default", argument, tag, result);
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
                return this.parseJsDocTag("returns");
            case "returns":
                var type = this.tryParseJSDocTypeExpression();
                break;
        }
    };
    Transpiler.prototype.tryParseJSDocTypeExpression = function () {
        if (this.scanner.getToken() !== ts.SyntaxKind.OpenBraceToken) {
            return undefined;
        }
        var typeExpression = this.parseJSDocTypeExpression();
        return typeExpression;
    };
    Transpiler.prototype.parseJSDocTypeExpression = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocTypeExpression, this.scanner.getTokenPos());
        this.parseExpected(ts.SyntaxKind.OpenBraceToken);
        result.type = this.parseJSDocTopLevelType();
        this.parseExpected(ts.SyntaxKind.CloseBraceToken);
        return this.finishNode(result);
    };
    Transpiler.prototype.parseExpected = function (kind, diagnosticMessage, shouldAdvance) {
        if (shouldAdvance === void 0) { shouldAdvance = true; }
        if (this.scanner.getToken() === kind) {
            if (shouldAdvance) {
                this.scanner.scanJSDocToken();
            }
            return true;
        }
        // Report specific message if provided with one.  Otherwise, report generic fallback message.
        //if (diagnosticMessage) {
        //    parseErrorAtCurrentToken(diagnosticMessage);
        //}
        //else {
        //    parseErrorAtCurrentToken(Diagnostics._0_expected, tokenToString(kind));
        //}
        return false;
    };
    Transpiler.prototype.finishNode = function (node, end) {
        if (end === void 0) { end = this.scanner.getStartPos(); }
        node.end = end;
        return node;
    };
    Transpiler.prototype.parseJSDocTopLevelType = function () {
        var type = this.parseJSDocType();
        if (this.scanner.getToken() === ts.SyntaxKind.BarToken) {
            var unionType = ts.createNode(ts.SyntaxKind.JSDocUnionType, type.pos);
            unionType.types = this.parseJSDocTypeList(type);
            type = this.finishNode(unionType);
        }
        if (this.scanner.getToken() === ts.SyntaxKind.EqualsToken) {
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
        // TODO (drosen): Parse string literal types in ts.JSDoc as well.
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
        result.parameters = this.parseDelimitedList(22 /* JSDocFunctionParameters */, this.parseJSDocParameter.bind(this));
        this.checkForTrailingComma(result.parameters);
        this.parseExpected(ts.SyntaxKind.CloseParenToken);
        if (this.scanner.getToken() === ts.SyntaxKind.ColonToken) {
            this.scanner.scanJSDocToken();
            result.type = this.parseJSDocType();
        }
        return this.finishNode(result);
    };
    // ts.Parses a comma-delimited list of elements
    Transpiler.prototype.parseDelimitedList = function (kind, parseElement, considerSemicolonAsDelimiter) {
        var saveParsingContext = parsingContext;
        parsingContext |= 1 << kind;
        var result = [];
        result.pos = getNodePos();
        var commaStart = -1; // ts.Meaning the previous this.scanner.getToken() was not a comma
        while (true) {
            if (isListElement(kind, /*inErrorRecovery*/ false)) {
                result.push(parseListElement(kind, parseElement));
                commaStart = scanner.getTokenPos();
                if (parseOptional(ts.SyntaxKind.CommaToken)) {
                    continue;
                }
                commaStart = -1; // ts.Back to the state where the last this.scanner.getToken() was not a comma
                if (isListTerminator(kind)) {
                    break;
                }
                // ts.We didn't get a comma, and the list wasn't terminated, explicitly parse
                // out a comma so we give a good error message.
                parseExpected(ts.SyntaxKind.CommaToken);
                // ts.If the this.scanner.getToken() was a semicolon, and the caller allows that, then skip it and
                // continue.  ts.This ensures we get back on track and don't result in tons of
                // parse errors.  ts.For example, this can happen when people do things like use
                // a semicolon to delimit object literal members.   ts.Note: we'll have already
                // reported an error when we called parseExpected above.
                if (considerSemicolonAsDelimiter && this.scanner.getToken() === ts.SyntaxKind.SemicolonToken && !scanner.hasPrecedingLineBreak()) {
                    this.scanner.scanJSDocToken();
                }
                continue;
            }
            if (isListTerminator(kind)) {
                break;
            }
            if (abortParsingListOrMoveToNextToken(kind)) {
                break;
            }
        }
        // ts.Recording the trailing comma is deliberately done after the previous
        // loop, and not just if we see a list terminator. ts.This is because the list
        // may have ended incorrectly, but it is still important to know if there
        // was a trailing comma.
        // ts.Check if the last this.scanner.getToken() was a comma.
        if (commaStart >= 0) {
            // ts.Always preserve a trailing comma by marking it on the ts.NodeArray
            result.hasTrailingComma = true;
        }
        result.end = this.getNodeEnd();
        parsingContext = saveParsingContext;
        return result;
    };
    Transpiler.prototype.parseJSDocParameter = function () {
        var parameter = ts.createNode(ts.SyntaxKind.Parameter);
        parameter.type = this.parseJSDocType();
        if (this.parseOptional(ts.SyntaxKind.EqualsToken)) {
            parameter.questionToken = ts.createNode(ts.SyntaxKind.EqualsToken);
        }
        return this.finishNode(parameter);
    };
    Transpiler.prototype.parseOptional = function (t) {
        if (this.scanner.getToken() === t) {
            this.scanner.scanJSDocToken();
            return true;
        }
        return false;
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
        var typeArguments = this.parseDelimitedList(23 /* JSDocTypeArguments */, this.parseJSDocType);
        this.checkForTrailingComma(typeArguments);
        this.checkForEmptyTypeArgumentList(typeArguments);
        this.parseExpected(ts.SyntaxKind.GreaterThanToken);
        return typeArguments;
    };
    Transpiler.prototype.checkForEmptyTypeArgumentList = function (typeArguments) {
        if (this.parseDiagnostics.length === 0 && typeArguments && typeArguments.length === 0) {
            var start = typeArguments.pos - "<".length;
            var end = this.skipTrivia(this.sourceFile.text, typeArguments.end) + ">".length;
            return this.parseErrorAtPosition(start, end - start, Diagnostics.Type_argument_list_cannot_be_empty);
        }
    };
    Transpiler.prototype.parseQualifiedName = function (left) {
        var result = ts.createNode(ts.SyntaxKind.QualifiedName, left.pos);
        result.left = left;
        result.right = this.parseIdentifierName();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocRecordType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocRecordType);
        this.scanner.scanJSDocToken();
        result.members = this.parseDelimitedList(24 /* JSDocRecordMembers */, this.parseJSDocRecordMember.bind(this));
        this.checkForTrailingComma(result.members);
        this.parseExpected(ts.SyntaxKind.CloseBraceToken);
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
    Transpiler.prototype.parseJSDocNonNullableType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocNonNullableType);
        this.scanner.scanJSDocToken();
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    };
    Transpiler.prototype.parseJSDocTupleType = function () {
        var result = ts.createNode(ts.SyntaxKind.JSDocTupleType);
        this.scanner.scanJSDocToken();
        result.types = this.parseDelimitedList(25 /* JSDocTupleTypes */, parseJSDocType);
        this.checkForTrailingComma(result.types);
        this.parseExpected(ts.SyntaxKind.CloseBracketToken);
        return this.finishNode(result);
    };
    Transpiler.prototype.checkForTrailingComma = function (list) {
        if (this.parseDiagnostics.length === 0 && list.hasTrailingComma) {
            var start = list.end - ",".length;
            this.parseErrorAtPosition(start, ",".length, Diagnostics.Trailing_comma_not_allowed);
        }
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
    /**
     * 添加一个已解析的文档注释。
     * @param node 当前节点。
     */
    Transpiler.prototype.addDocComment = function (jsDocComment) {
        if (jsDocComment.category)
            this.category = jsDocComment.category;
        if (jsDocComment.namespace)
            this.namespace = jsDocComment.namespace;
        this.jsDoc.members.push(jsDocComment);
    };
    /**
     * 报告一个文档错误。
     * @param result 目标文档注释。
     * @param node 源节点。
     * @param message 错误内容。
     */
    Transpiler.prototype.reportDocError = function (result, node, message) {
        result.diagnostics.push({
            file: this.sourceFile,
            start: node.pos,
            length: node.end - node.pos,
            messageText: message,
            category: ts.DiagnosticCategory.Warning,
            code: -1
        });
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
    if (transpiler.options.jsDoc) {
        result["jsDoc"] = transpiler.jsDocs;
    }
    return result;
};
// #endregion
var _ = console.log.bind(console);
module.exports = ts;
//# sourceMappingURL=tscript.js.map