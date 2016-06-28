/**
 * @fileOverview TypeScript 编译器
 * @descrition 编译 TypeScript，生成高性能的 JavaScript 和 API 文档数据。
 */

import * as ts from "typescript";

const Debug = ts["Debug"];

/**
 * 表示一个 TypeScript 语法转换器。
 * @remark 转换器负责更新 TypeScript 语法树和解析 JSDoc 文档。
 */
class Transpiler {

    // #region 接口

    /**
     * 获取正在处理的程序。
     */
    program: ts.Program;

    /**
     * 获取正在使用的选项。
     */
    options: TranspileOptions;

    /**
     * 获取正在使用的类型转换器。
     */
    private checker: ts.TypeChecker;

    /**
     * 获取当前正在处理的文件。
     */
    private sourceFile: ts.SourceFile;

    /**
     * 转换指定的程序。
     * @param program 要处理的程序。
     * @param options 要使用的选项。
     */
    transpile(program: ts.Program, options: TranspileOptions) {
        this.program = program;
        this.options = options;
        this.checker = program.getTypeChecker();

        // 生成文档。
        if (options.doc) {
            this.jsDocs = {};
        }

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
            this.resolveDocs();
        }

    }

    // #endregion

    // #region 节点遍历

    /**
     * 解析指定的类型字符串实际指代的类型。
     * @param pos
     * @param text
     */
    stringToType(text: string, pos: number, end: number) {
        // ts.createScanner(this.options.target, true, this.options.jsx == ts.JsxEmit.None ? ts.LanguageVariant.Standard : ts.LanguageVariant.JSX, text, null, pos, end - pos);
        // return this.checker.getTypeAtLocation();
    }

    // #endregion

    // #region 解析文档注释

    /**
     * 存储所有已解析的文档。
     */
    jsDocs: { [path: string]: SourceFileDocComment };

    /**
     * 获取当前正在解析的文档。
     */
    private jsDoc: SourceFileDocComment;

    /**
     * 存储当前分类。
     */
    private category: string;

    /**
     * 存储当前命名空间。
     */
    private namespace: string;

    /**
     * 解析当前源码的文档注释。
     */
    private resolveDocs() {

        // 创建文档对象。
        this.jsDocs[this.sourceFile.path as string] = this.jsDoc = {
            members: [],
            imports: []
        } as SourceFileDocComment;

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

        let me = this;

        // 解析子节点注释。
        visit(this.sourceFile);

        /**
         * 解析单个节点的文档注释。
         * @param node
         */
        function visit(node: ts.Node) {
            switch (node.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                    me.addDocCommentFromNode(node);
                    break;
            }

            ts.forEachChild(node, visit);
        }

    }

    /**
     * 添加属于某个节点的文档注释。
     * @param node 当前节点。
     */
    private addDocCommentFromNode(node: ts.Node) {

        // 从节点获取文档信息。
        let docComment = this.parseDocCommentFromNode(node);

        // 添加到列表。
        if (docComment) {
            this.addDocComment(docComment);
        }

    }

    /**
     * 解析属于某个节点的文档注释。
     * @param node 当前节点。
     */
    private parseDocCommentFromNode(node: ts.Node) {

        // 首先读取文档注释。
        const comments: ts.CommentRange[] = (ts as any).getJsDocComments(node, this.sourceFile);
        if (!comments.length) return;

        // 然后解析文档注释。
        const comment = comments[comments.length - 1];
        const docComment = this.parseDocComment(comment.pos, comment.end);

        // 从节点提取文档信息。


        // 返回文档注释。
        return docComment;
    }

    /**
     * 默认的扫描器。
     */
    private scanner = ts.createScanner(ts.ScriptTarget.Latest, /*skipTrivia*/ true);

    /**
     * 存储当前正在解析的文档。
     */
    private jsDocComment: ParsedJSDocComment;

    /**
     * 解析指定区间的文档注释。
     * @param start 注释的起始位置。
     * @param end 注释的结束位置。
     */
    private parseDocComment(start: number, end: number) {

        _("解析注释：" + this.sourceFile.text.substring(start, end));
        this.scanner.setText(this.sourceFile.text, start + 3, end - start - 5);

        const p = ts.getLineAndCharacterOfPosition(this.sourceFile, start);
        this.jsDocComment = { line: p.line, column: p.character } as ParsedJSDocComment;

        // 解析前缀文本。
        const summary = this.scanToJSDocTagStart();
        _("文本：", summary);

        // 解析每个标签。
        while (this.scanner.getToken() !== ts.SyntaxKind.EndOfFileToken) {
            Debug.assert(this.scanner.getToken() === ts.SyntaxKind.AtToken);
            this.scanner.scanJSDocToken();
            const tagName = this.scanner.getTokenText();
            this.scanner.scanJSDocToken();
            this.parseJsDocTag(tagName);
        }

        return this.jsDocComment;

    }

    /**
     * 解析到下一个 JSDoc 标签开始。
     */
    private scanToJSDocTagStart() {
        let buffer = "";

        let canParseTag = true;
        let seenAsterisk = true;

        let pos = this.scanner.getTokenPos();
        while (true) {
            switch (this.scanner.scanJSDocToken()) {
                case ts.SyntaxKind.AtToken:
                    if (canParseTag) {
                        return (buffer + this.sourceFile.text.substring(pos, this.scanner.getTokenPos())).trim();
                    }
                    break;

                case ts.SyntaxKind.NewLineTrivia:
                    buffer += this.sourceFile.text.substring(pos, this.scanner.getTokenPos()).trim(); (buffer + this.sourceFile.text.substring(pos, this.scanner.getTokenPos())).trim();
                    if (buffer.charCodeAt(buffer.length - 1) !== 10/*\n*/) {
                        buffer += "\n";
                    }
                    pos = this.scanner.getTextPos();
                    canParseTag = true;
                    seenAsterisk = false;
                    break;

                case ts.SyntaxKind.AsteriskToken:
                    if (seenAsterisk) {
                        canParseTag = false;
                    } else {
                        seenAsterisk = true;
                        pos = this.scanner.getTextPos();
                    }
                    break;

                case ts.SyntaxKind.EndOfFileToken:
                    return (buffer + this.sourceFile.text.substring(pos, this.scanner.getTokenPos())).trim();

            }
        }
    }

    /**
     * 从源文件的文档注释标签截取信息。
     * @param tagName 标签名。
     */
    private parseJsDocTag(tagName: string) {

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
            case "returns": // (synonyms: @return) Document the return value of a function.
                let type = this.tryParseJSDocTypeExpression();
                break;

            //case "type": // Document the type of an object.
            //case "this": // What does the 'this' keyword refer to here?
            //    // todo
            //    break;

            //case "typedef": // Document a custom type.
            //    // todo
            //    break;

            //case "arg":
            //case "argument":
            //    return this.parseJsDocTag("param", argument, tag, result);
            //case "param": //(synonyms: @arg, @argument)  Document the parameter to a function.
            //    // todo
            //    break;

            //case "access": //  Specify the access level of this member (private, public, or protected).
            //    switch (argument) {
            //        case "private":
            //        case "protected":
            //        case "public":
            //        case "internal":
            //            return this.parseJsDocTag(argument, null, tag, result);
            //        default:
            //            this.reportDocError(result, tag, `Invalid argument of tag @${tagName}: '${argument}'. Supported values are: 'private', 'protected', 'public', 'internal'.`);
            //            break;
            //    }
            //    break;

            //case "kind": // What kind of symbol is this?
            //    switch (argument) {
            //        case "func":
            //        case "method":
            //        case "prop":
            //        case "constructs": // This function member will be the constructor for the previous class.
            //        case "constructor":
            //        case "constant":
            //        case "var":
            //        case "function": // (synonyms: @func, @method)  Describe a function or method.
            //        case "property": // (synonyms: @prop)   Document a property of an object.
            //        case "class": //  (synonyms: @constructor) This function is intended to be called with the "new" keyword.
            //        case "interface": // This symbol is an interface that others can implement
            //        case "enum": // Document a collection of related properties.
            //        case "const": // (synonyms: @const)  Document an object as a constant.
            //        case "member": // (synonyms: @var) Document a member.
            //        case "callback": // Document a callback function.
            //        case "event": // Document an event.
            //        case "config": // Document a config.
            //        case "exports": // Identify the member that is exported by a JavaScript module.
            //        case "instance": // Document an instance member..
            //            return this.parseJsDocTag(argument, null, tag, result);
            //        default:
            //            this.reportDocError(result, tag, `Invalid argument of tag @${tagName}: '${argument}'.`);
            //            break;
            //    }

            //case "listens": // List the events that a symbol listens for.
            //case "mixes": // This object mixes in all the members from another object.
            //case "mixin": // Document a mixin object.
            //case "tutorial": // Insert a link to an included tutorial file.
            //case "variation": // Distinguish different objects with the same name.
            //default:
            //    this.reportDocError(result, tag, `Unknown tag @${tagName}.`);
            //    break;
        }
    }

    tryParseJSDocTypeExpression() {
        if (this.scanner.getToken() !== ts.SyntaxKind.OpenBraceToken) {
            return undefined;
        }

        const typeExpression = this.parseJSDocTypeExpression();
        return typeExpression;
    }

    parseJSDocTypeExpression() {
        const result = <ts.JSDocTypeExpression>ts.createNode(ts.SyntaxKind.JSDocTypeExpression, this.scanner.getTokenPos());

        this.parseExpected(ts.SyntaxKind.OpenBraceToken);
        result.type = this.parseJSDocTopLevelType();
        this.parseExpected(ts.SyntaxKind.CloseBraceToken);

        return this.finishNode(result);
    }

    parseExpected(kind: ts.SyntaxKind, diagnosticMessage?: ts.DiagnosticMessage, shouldAdvance = true): boolean {
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
    }

    finishNode<T extends ts.Node>(node: T, end = this.scanner.getStartPos()): T {
        node.end = end;
        return node;
    }

    parseJSDocTopLevelType(): ts.JSDocType {
        let type = this.parseJSDocType();
        if (this.scanner.getToken() === ts.SyntaxKind.BarToken/*|*/) {
            const unionType = <ts.JSDocUnionType>ts.createNode(ts.SyntaxKind.JSDocUnionType, type.pos);
            unionType.types = this.parseJSDocTypeList(type);
            type = this.finishNode(unionType);
        }

        if (this.scanner.getToken() === ts.SyntaxKind.EqualsToken/*=*/) {
            const optionalType = <ts.JSDocOptionalType>ts.createNode(ts.SyntaxKind.JSDocOptionalType, type.pos);
            this.scanner.scanJSDocToken();
            optionalType.type = type;
            type = this.finishNode(optionalType);
        }

        return type;
    }

    parseJSDocType(): ts.JSDocType {
        let type = this.parseBasicTypeExpression();

        while (true) {
            if (this.scanner.getToken() === ts.SyntaxKind.OpenBracketToken) {
                const arrayType = <ts.JSDocArrayType>ts.createNode(ts.SyntaxKind.JSDocArrayType, type.pos);
                arrayType.elementType = type;

                this.scanner.scanJSDocToken();
                this.parseExpected(ts.SyntaxKind.CloseBracketToken);

                type = this.finishNode(arrayType);
            }
            else if (this.scanner.getToken() === ts.SyntaxKind.QuestionToken) {
                const nullableType = <ts.JSDocNullableType>ts.createNode(ts.SyntaxKind.JSDocNullableType, type.pos);
                nullableType.type = type;

                this.scanner.scanJSDocToken();
                type = this.finishNode(nullableType);
            }
            else if (this.scanner.getToken() === ts.SyntaxKind.ExclamationToken) {
                const nonNullableType = <ts.JSDocNonNullableType>ts.createNode(ts.SyntaxKind.JSDocNonNullableType, type.pos);
                nonNullableType.type = type;

                this.scanner.scanJSDocToken();
                type = this.finishNode(nonNullableType);
            }
            else {
                break;
            }
        }

        return type;
    }

    /**
     * 获取文件的首个注释。
     * @param sourceFile
     */
    private getJsDocCommentOfSourceFile() {
        //const comments: ts.CommentRange[] = (ts as any).getJsDocComments(this.sourceFile, this.sourceFile);
        //if (!comments.length) return;
        //const comment = comments[0];
        //if (!comment.hasTrailingNewLine) return;
        //return this.parseJsDoc(comment.pos, comment.end);
    }

    parseBasicTypeExpression(): ts.JSDocType {
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
                return this.parseTokenNode<ts.JSDocType>();
        }

        // TODO (drosen): Parse string literal types in JSDoc as well.
        return this.parseJSDocTypeReference();
    }

    parseTokenNode<T extends ts.Node>(): T {
        const node = <T>ts.createNode(this.scanner.getToken());
        this.scanner.scanJSDocToken();
        return this.finishNode(node);
    }

    parseJSDocThisType(): ts.JSDocThisType {
        const result = <ts.JSDocThisType>ts.createNode(ts.SyntaxKind.JSDocThisType);
        this.scanner.scanJSDocToken();
        this.parseExpected(ts.SyntaxKind.ColonToken);
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    }

    parseJSDocConstructorType(): ts.JSDocConstructorType {
        const result = <ts.JSDocConstructorType>ts.createNode(ts.SyntaxKind.JSDocConstructorType);
        this.scanner.scanJSDocToken();
        this.parseExpected(ts.SyntaxKind.ColonToken);
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    }

    parseJSDocVariadicType(): ts.JSDocVariadicType {
        const result = <ts.JSDocVariadicType>ts.createNode(ts.SyntaxKind.JSDocVariadicType);
        this.scanner.scanJSDocToken();
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    }

    parseJSDocFunctionType(): ts.JSDocFunctionType {
        const result = <ts.JSDocFunctionType>ts.createNode(ts.SyntaxKind.JSDocFunctionType);
        this.scanner.scanJSDocToken();

        this.parseExpected(ts.SyntaxKind.OpenParenToken);
        result.parameters = this.parseDelimitedList(ParsingContext.JSDocFunctionParameters, this.parseJSDocParameter.bind(this));
        this.checkForTrailingComma(result.parameters);
        this.parseExpected(ts.SyntaxKind.CloseParenToken);

        if (this.scanner.getToken() === ts.SyntaxKind.ColonToken) {
            this.scanner.scanJSDocToken();
            result.type = this.parseJSDocType();
        }

        return this.finishNode(result);
    }

    // ts.Parses a comma-delimited list of elements
    parseDelimitedList<T extends ts.Node>(kind: ParsingContext, parseElement: () => T, considerSemicolonAsDelimiter?: boolean): ts.NodeArray<T> {
        const saveParsingContext = parsingContext;
        parsingContext |= 1 << kind;
        const result = <ts.NodeArray<T>>[];
        result.pos = this.scanner.getStartPos();

        let commaStart = -1; // ts.Meaning the previous this.scanner.getToken() was not a comma
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

            if (this.isListTerminator(kind)) {
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
    }

    parseJSDocParameter(): ts.ParameterDeclaration {
        const parameter = <ts.ParameterDeclaration>ts.createNode(ts.SyntaxKind.Parameter);
        parameter.type = this.parseJSDocType();
        if (this.parseOptional(ts.SyntaxKind.EqualsToken)) {
            parameter.questionToken = ts.createNode(ts.SyntaxKind.EqualsToken);
        }
        return this.finishNode(parameter);
    }

    parseOptional(t: ts.SyntaxKind): boolean {
        if (this.scanner.getToken() === t) {
            this.scanner.scanJSDocToken();
            return true;
        }
        return false;
    }

    parseJSDocTypeReference(): ts.JSDocTypeReference {
        const result = <ts.JSDocTypeReference>ts.createNode(ts.SyntaxKind.JSDocTypeReference);
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
    }

    parseTypeArguments() {
        // Move past the <
        this.scanner.scanJSDocToken();
        const typeArguments = this.parseDelimitedList(ParsingContext.JSDocTypeArguments, this.parseJSDocType);
        this.checkForTrailingComma(typeArguments);
        this.checkForEmptyTypeArgumentList(typeArguments);
        this.parseExpected(ts.SyntaxKind.GreaterThanToken);

        return typeArguments;
    }

    checkForEmptyTypeArgumentList(typeArguments: ts.NodeArray<Node>) {
        if (this.parseDiagnostics.length === 0 && typeArguments && typeArguments.length === 0) {
            const start = typeArguments.pos - "<".length;
            const end = this.skipTrivia(this.sourceFile.text, typeArguments.end) + ">".length;
            return this.parseErrorAtPosition(start, end - start, Diagnostics.Type_argument_list_cannot_be_empty);
        }
    }

    parseQualifiedName(left: ts.EntityName): ts.QualifiedName {
        const result = <ts.QualifiedName>ts.createNode(ts.SyntaxKind.QualifiedName, left.pos);
        result.left = left;
        result.right = this.parseIdentifierName();

        return this.finishNode(result);
    }

    parseJSDocRecordType(): ts.JSDocRecordType {
        const result = <ts.JSDocRecordType>ts.createNode(ts.SyntaxKind.JSDocRecordType);
        this.scanner.scanJSDocToken();
        result.members = this.parseDelimitedList(ParsingContext.JSDocRecordMembers, this.parseJSDocRecordMember.bind(this));
        this.checkForTrailingComma(result.members);
        this.parseExpected(ts.SyntaxKind.CloseBraceToken);
        return this.finishNode(result);
    }

    parseJSDocRecordMember(): ts.JSDocRecordMember {
        const result = <ts.JSDocRecordMember>ts.createNode(ts.SyntaxKind.JSDocRecordMember);
        result.name = this.parseSimplePropertyName();

        if (this.scanner.getToken() === ts.SyntaxKind.ColonToken) {
            this.scanner.scanJSDocToken();
            result.type = this.parseJSDocType();
        }

        return this.finishNode(result);
    }

    parseJSDocNonNullableType(): ts.JSDocNonNullableType {
        const result = <ts.JSDocNonNullableType>ts.createNode(ts.SyntaxKind.JSDocNonNullableType);
        this.scanner.scanJSDocToken();
        result.type = this.parseJSDocType();
        return this.finishNode(result);
    }

    parseJSDocTupleType(): ts.JSDocTupleType {
        const result = <ts.JSDocTupleType>ts.createNode(ts.SyntaxKind.JSDocTupleType);
        this.scanner.scanJSDocToken();
        result.types = this.parseDelimitedList(ParsingContext.JSDocTupleTypes, this.parseJSDocType.bind(this));
        this.checkForTrailingComma(result.types);
        this.parseExpected(ts.SyntaxKind.CloseBracketToken);

        return this.finishNode(result);
    }

    checkForTrailingComma(list: ts.NodeArray<ts.Node>) {
        if (this.parseDiagnostics.length === 0 && list.hasTrailingComma) {
            const start = list.end - ",".length;
            this.parseErrorAtPosition(start, ",".length, Diagnostics.Trailing_comma_not_allowed);
        }
    }

    parseJSDocUnionType(): ts.JSDocUnionType {
        const result = <ts.JSDocUnionType>ts.createNode(ts.SyntaxKind.JSDocUnionType);
        this.scanner.scanJSDocToken();
        result.types = this.parseJSDocTypeList(this.parseJSDocType());

        this.parseExpected(ts.SyntaxKind.CloseParenToken);

        return this.finishNode(result);
    }

    parseJSDocTypeList(firstType: ts.JSDocType) {
        Debug.assert(!!firstType);

        const types = <ts.NodeArray<ts.JSDocType>>[];
        types.pos = firstType.pos;

        types.push(firstType);
        while (this.parseOptional(ts.SyntaxKind.BarToken)) {
            types.push(this.parseJSDocType());
        }

        types.end = this.scanner.getStartPos();
        return types;
    }

    parseJSDocAllType(): ts.JSDocAllType {
        const result = <ts.JSDocAllType>ts.createNode(ts.SyntaxKind.JSDocAllType);
        this.scanner.scanJSDocToken();
        return this.finishNode(result);
    }

    parseJSDocUnknownOrNullableType(): ts.JSDocUnknownType | ts.JSDocNullableType {
        const pos = this.scanner.getStartPos();
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

            const result = <ts.JSDocUnknownType>ts.createNode(ts.SyntaxKind.JSDocUnknownType, pos);
            return this.finishNode(result);
        }
        else {
            const result = <ts.JSDocNullableType>ts.createNode(ts.SyntaxKind.JSDocNullableType, pos);
            result.type = this.parseJSDocType();
            return this.finishNode(result);
        }
    }

    /**
     * 添加一个已解析的文档注释。
     * @param node 当前节点。
     */
    addDocComment(jsDocComment: ParsedJSDocComment) {
        if (jsDocComment.category) this.category = jsDocComment.category;
        if (jsDocComment.namespace) this.namespace = jsDocComment.namespace;
        this.jsDoc.members.push(jsDocComment);
    }

    /**
     * 报告一个文档错误。
     * @param result 目标文档注释。
     * @param node 源节点。
     * @param message 错误内容。
     */
    private reportDocError(result: DocComment, node: ts.Node, message: string) {
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
interface TranspileOptions extends ts.CompilerOptions {

    /**
     * 生成的文档路径。如果未提供则不生成文档。
     */
    doc: string;

}

/**
 * 表示一个文档注释。
 */
export interface ParsedJSDocComment {

    // #region 注释属性

    /**
     * 注释在源文件的行号。
     */
    line: number;

    /**
     * 注释在源文件的列号。
     */
    column: number;

    /**
     * 解析此注释时产生的错误提示。
     */
    diagnostics: ts.Diagnostic[];

    // #endregion 修饰符

    // #region 描述

    /**
     * 获取概述。
     */
    summary: string;

    /**
     * 获取详细说明。
     */
    description: string;

    /**
     * 获取分类。
     */
    category: string;

    /**
     * 获取作者。
     */
    author: string;

    /**
     * 获取协议。
     */
    license: string;

    /**
     * 获取版权。
     */
    copyright: string;

    /**
     * 获取版本号。
     */
    version: string;

    /**
     * 获取开始生效的版本号。
     */
    since: string;

    /**
     * 获取废弃的版本号。
     */
    deprecated: string;

    /**
     * 获取待完成项。
     */
    todo: string[];

    /**
     * 获取参考。
     */
    see: (string | DocComment)[];

    /**
     * 获取依赖列表。
     */
    requires: (string | DocComment)[];

    /**
     * 获取关键字。
     */
    keywords: string;

    /**
     * 获取状态。
     */
    state: string;

    /**
     * 获取平台。
     */
    platform: string;

    // #endregion 

    // #region 修饰符

    /**
     * 当前成员是静态的。直接通过类名可以访问此成员。
     */
    static: boolean;

    /**
     * 当前成员是最终的。无法重写或覆盖此成员。
     */
    final: boolean;

    /**
     * 当前成员是抽象的。子类必须实现当前成员。
     */
    abstract: boolean;

    /**
     * 当前成员是虚拟的。子类可以重写当前成员。
     */
    virtual: boolean;

    /**
     * 当前成员用于实现或覆盖基类成员。
     */
    override: boolean;

    /**
     * 当前成员是私有的。只能在当前类内部使用。
     */
    private: boolean;

    /**
     * 当前成员是保护的。只能在当前类及子类内部使用。
     */
    protected: boolean;

    /**
     * 当前成员是公开的。可以直接使用。
     */
    public: boolean;

    /**
     * 当前成员是内部使用的。外部程序不应该使用此接口。
     */
    internal: boolean;

    // #endregion

    // #region 成员类型

    /**
     * 当前成员是一个类。
     */
    class: boolean;

    /**
     * 当前成员是一个接口。
     */
    interface: boolean;

    /**
     * 当前成员是一个枚举。
     */
    enum: boolean;

    /**
     * 当前成员是一个事件。
     */
    event: boolean;

    /**
     * 当前成员是一个构造函数。
     */
    constructor: boolean;

    /**
     * 当前成员是一个析构函数。
     */
    deconstructor: boolean;

    /**
     * 当前成员是一个属性。
     */
    property: boolean;

    /**
     * 当前成员是一个方法。
     */
    method: boolean;

    /**
     * 当前成员是一个字段。
     */
    field: boolean;

    /**
     * 当前成员是一个全局函数。
     */
    function: boolean;

    /**
     * 当前成员是一个命名空间。
     */
    namespace: string;

    /**
     * 当前成员是一个模块。
     */
    module: string;

    /**
     * 当前成员是一个变量。
     */
    variable: boolean;

    /**
     * 当前成员是一个常量。
     */
    constant: boolean;

    // #endregion

    // #region 成员名

    /**
     * 当前标记的成员名。
     */
    name: string;

    /**
     * 当前成员的所属名。
     */
    memberOf: string;

    // #endregion

    // #region 全局专属

    /**
     * 获取文件概述。
     */
    fileOverview: string;

    /**
     * 获取文件视图。
     */
    viewport: string;

    // #endregion

    // #region 类专属

    /**
     * 当前类的描述。
     */
    classDescripton: string;

    /**
     * 当前类的基类。
     */
    extends: string;

    /**
     * 当前类实现的接口。
     */
    implements: string;

    // #endregion

    // #region 字段属性专属

    /**
     * 获取默认值。
     */
    defaultValue: string;

    // #endregion

    // #region 函数专属

    /**
     * 获取参数列表。
     */
    params: ({

        /**
         * 获取参数的类型。
         */
        type: string,

        /**
         * 获取参数的名字。
         */
        name: string,

        /**
         * 获取参数是否可选。
         */
        optional: boolean,

        /**
         * 获取参数是否动态。
         */
        varibale: boolean,

        /**
         * 获取参数的默认值。
         */
        defaultValue: string,

        /**
         * 获取参数的描述。
         */
        description: string
    })[];

    /**
     * 获取返回信息。
     */
    return: {

        /**
         * 获取返回值的类型。
         */
        type: string,

        /**
         * 获取返回值的描述。
         */
        description: string
    };

    /**
     * 获取抛出的异常信息。
     */
    throws: ({

        /**
         * 获取异常的类型。
         */
        type: string,

        /**
         * 获取异常的描述。
         */
        description: string

    })[];

    // #endregion

    // #region 解析需要

    /**
     * 获取复制的成员。
     */
    borrows: string[];

    /**
     * 获取触发的事件列表。
     */
    emits: string[];

    // #endregion

}

/**
 * 表示一个文件的文档注释。
 */
interface SourceFileDocComment {

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
    members: DocComment[];

    /**
     * 获取当前文档的所有导入模块。
     */
    imports: any[];

}

const enum ParsingContext {
    SourceElements,            // Elements in source file
    BlockStatements,           // Statements in block
    SwitchClauses,             // Clauses in switch statement
    SwitchClauseStatements,    // Statements in switch clause
    TypeMembers,               // Members in interface or type literal
    ClassMembers,              // Members in class declaration
    EnumMembers,               // Members in enum declaration
    HeritageClauseElement,     // Elements in a heritage clause
    VariableDeclarations,      // Variable declarations in variable statement
    ObjectBindingElements,     // Binding elements in object binding list
    ArrayBindingElements,      // Binding elements in array binding list
    ArgumentExpressions,       // Expressions in argument list
    ObjectLiteralMembers,      // Members in object literal
    JsxAttributes,             // Attributes in jsx element
    JsxChildren,               // Things between opening and closing JSX tags
    ArrayLiteralMembers,       // Members in array literal
    Parameters,                // Parameters in parameter list
    TypeParameters,            // Type parameters in type parameter list
    TypeArguments,             // Type arguments in type argument list
    TupleElementTypes,         // Element types in tuple element type list
    HeritageClauses,           // Heritage clauses for a class or interface declaration.
    ImportOrExportSpecifiers,  // Named import clause's import specifier list
    JSDocFunctionParameters,
    JSDocTypeArguments,
    JSDocRecordMembers,
    JSDocTupleTypes,
    Count                      // Number of parsing contexts
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
ts.createProgram = function (rootNames: string[], options: TranspileOptions, host?: ts.CompilerHost, oldProgram?: ts.Program) {

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

// 添加文档。
const transpileModule = ts.transpileModule;
ts.transpileModule = function (input: string, transpileOptions: ts.TranspileOptions) {
    let result: ts.TranspileOutput = transpileModule.apply(this, arguments);
    if (transpiler.options.jsDoc) {
        result["jsDoc"] = transpiler.jsDocs;
    }
    return result;
}

export = ts;

// #endregion

const _ = console.log.bind(console);