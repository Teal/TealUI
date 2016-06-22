/**
 * @fileOverview TypeScript 编译器
 * @descrition 编译 TypeScript，生成高性能的 JavaScript 和 API 文档数据。
 */
var ts = require("typescript");
/**
 * 表示一个 TypeScript 语法转换器。
 * @remark 转换器负责更新 TypeScript 语法树和解析 JSDoc 文档。
 */
var Transpiler = (function () {
    function Transpiler() {
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
            this.docs = {};
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
        //// 解析每个成员。
        //mapChild(sourceFile, (node: ts.Node) => {
        //    return node;
        //});
    };
    /**
     * 解析当前源码的文档注释。
     */
    Transpiler.prototype.resolveDocs = function () {
        // 创建文档对象。
        this.docs[this.sourceFile.path] = this.doc = {
            members: [],
            imports: []
        };
        //// 获取属于当前文档的文档注释。
        //const sourceFileComment = this.getJsDocCommentOfSourceFile();
        //if (sourceFileComment) {
        //    this.doc.title = sourceFileComment.fileOverview;
        //    this.doc.keywords = sourceFileComment.keywords;
        //    this.doc.author = sourceFileComment.author;
        //    this.doc.description = sourceFileComment.description || sourceFileComment.summary;
        //    this.doc.state = sourceFileComment.state;
        //    this.doc.platform = sourceFileComment.platform.split(/\s*,\s*/);
        //    this.doc.viewport = sourceFileComment.viewport;
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
     * @param pos 注释的起始位置。
     * @param end 注释的结束位置。
     */
    Transpiler.prototype.parseDocComment = function (pos, end) {
        console.log("解析注释：" + this.sourceFile.text.substring(pos, end));
        return;
        var result = { diagnostics: [] };
        var parsed = ts.parseIsolatedJSDocComment(this.sourceFile.text, pos, end);
        // 保留解析的注释。
        if (parsed.diagnostics) {
            (_a = result.diagnostics).push.apply(_a, parsed.diagnostics);
        }
        // 解析标签。
        if (parsed.jsDocComment) {
            console.log();
        }
        return result;
        var _a;
        //const defaultTagName = "summary";
    };
    /**
     * 从源文件的文档注释标签截取信息。
     * @param tagName 标签名。
     * @param argument 标签参数，即从当前标签结束到下一个标签之间的文本。
     * @param tag 文档标签。
     * @param result 存放解析结果的对象。
     */
    Transpiler.prototype.parseJsDocTag = function (tagName, argument, tag, result) {
        switch (tagName.toLowerCase()) {
            // 类型名
            case "augments":
            case "extend":
                return this.parseJsDocTag("extends", argument, tag, result);
            case "module":
                return this.parseJsDocTag("namespace", argument, tag, result);
            case "lends":
                return this.parseJsDocTag("memberof", argument, tag, result);
            case "extends": // (synonyms: @extends)  Indicate that a symbol inherits from, ands adds to, a parent symbol.
            case "namespace": // Document a namespace object.
            case "memberof":
                if (result[tagName])
                    this.reportDocError(result, tag, "Duplicate tag: @" + tag.tagName.text + ".");
                // TODO：解析 argument 为类型。
                result[tagName] = argument;
                break;
            // 允许重复的类型名
            case "implements": // This symbol implements an interface.
            case "borrows":
                // TODO：解析 argument 为类型。
                result[tagName] = result[tagName] || [];
                result[tagName].push(argument);
                break;
            // 成员名
            case "emits":
                return this.parseJsDocTag("fires", argument, tag, result);
            case "name": // Document the name of an object.
            case "fires": // (synonyms: @emits)  Describe the events this method may fire.
            case "alias":
                if (result[tagName])
                    this.reportDocError(result, tag, "Duplicate tag: @" + tag.tagName.text + ".");
                // TODO：解析 argument 为名字。
                result[tagName] = argument;
                break;
            // 单行文本
            // 允许重复的单行文本
            case "author": // Identify the author of an item.
            case "copyright": // Document some copyright information.
            case "license":
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
            case "file": //(synonyms: @fileoverview, @overview)  Describe a file.
            case "todo":
                result[tagName] = (result[tagName] ? result[tagName] + "\n" : "") + argument;
                break;
            // 地址
            case "see": // Refer to some other documentation for more information.
            case "requires": // This file requires a JavaScript module.
            case "throws":
                result[tagName] = result[tagName] || [];
                // TODO: 解析特殊的地址
                result[tagName].push(argument);
                break;
            // 布尔型标签
            case "inner":
                return this.parseJsDocTag("internal", argument, tag, result);
            case "host":
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
            case "external": //(synonyms: @host)  Identifies an external class, namespace, or module.
            case "inheritdoc":
                if (result[tagName])
                    this.reportDocError(result, tag, "Duplicate tag: @" + tagName + ". The specific member has been marked as " + tagName + ".");
                if (argument)
                    this.reportDocError(result, tag, "Tag @" + tagName + " has no parameters.");
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
            case "global":
                // TODO：解析 argument 为名字。
                if (argument)
                    result.name = argument;
                argument[argument] = true;
                break;
            // 代码
            case "default": //  (synonyms: @defaultvalue)  Document the default value.
            case "example":
                argument[argument] = result;
                break;
            case "defaultvalue":
                return this.parseJsDocTag("default", argument, tag, result);
            // 版本
            case "deprecated": // Document that this is no longer the preferred way.
            case "version": // Documents the version number of an item.
            case "since":
                if (result[tagName])
                    this.reportDocError(result, tag, "Duplicate tag: @" + tag.tagName.text + ".");
                // TODO：解析版本号
                result[tagName] = argument;
                break;
            // 特定标签
            case "return":
                return this.parseJsDocTag("returns", argument, tag, result);
            case "returns":
                // todo
                break;
            case "type": // Document the type of an object.
            case "this":
                // todo
                break;
            case "typedef":
                // todo
                break;
            case "arg":
            case "argument":
                return this.parseJsDocTag("param", argument, tag, result);
            case "param":
                // todo
                break;
            case "access":
                switch (argument) {
                    case "private":
                    case "protected":
                    case "public":
                    case "internal":
                        return this.parseJsDocTag(argument, null, tag, result);
                    default:
                        this.reportDocError(result, tag, "Invalid argument of tag @" + tagName + ": '" + argument + "'. Supported values are: 'private', 'protected', 'public', 'internal'.");
                        break;
                }
                break;
            case "kind":
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
                    case "instance":
                        return this.parseJsDocTag(argument, null, tag, result);
                    default:
                        this.reportDocError(result, tag, "Invalid argument of tag @" + tagName + ": '" + argument + "'.");
                        break;
                }
            case "listens": // List the events that a symbol listens for.
            case "mixes": // This object mixes in all the members from another object.
            case "mixin": // Document a mixin object.
            case "tutorial": // Insert a link to an included tutorial file.
            case "variation": // Distinguish different objects with the same name.
            default:
                this.reportDocError(result, tag, "Unknown tag @" + tagName + ".");
                break;
        }
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
    Transpiler.prototype.addDocComment = function (docComment) {
        if (docComment.category)
            this.category = docComment.category;
        if (docComment.namespace)
            this.namespace = docComment.namespace;
        this.doc.members.push(docComment);
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
    if (transpiler.options.doc) {
        result["doc"] = transpiler.docs;
    }
    return result;
};
module.exports = ts;
// #endregion
//# sourceMappingURL=tscript.js.map