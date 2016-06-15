/**
 * 表示一个 TypeScript 语法树转换器。
 */
var ts = require("typescript");
/**
 * 表示一个语法转换器。
 */
var Translator = (function () {
    function Translator() {
    }
    /**
     * 转换指定的程序。
     * @param program 要转换的程序。
     * @param options 转换的选项。
     */
    Translator.prototype.translate = function (program, options) {
        this.program = program;
        this.options = options;
        this.checker = program.getTypeChecker();
    };
    return Translator;
}());
exports.Translator = Translator;
// 重写 createProgram 函数以添加转换。
var createProgram = ts.createProgram;
ts.createProgram = function (rootNames, options, host, oldProgram) {
    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;
    // 编译。
    var program = createProgram.apply(this, arguments);
    var checker = program.getTypeChecker();
    // 处理每个源文件。
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        // if (!ts.isExternalModule(sourceFile)) {
        visitSourceFile(sourceFile);
    }
    /**
     * 处理一个文件。
     * @param sourceFile 要处理的文件。
     */
    function visitSourceFile(sourceFile) {
        // 删除未使用的模块。
        if (options.includedExports) {
            removeUnusedExports(options.includedExports.split(","));
        }
        /**
         * 删除未使用的导出项。
         * @param usedExports 已使用的导出项列表。
         */
        function removeUnusedExports(usedExports) {
            // 第一步：遍历并找出所有导出函数的依赖关系。
            ts.forEachChild(sourceFile, findReferences);
            mapChild(sourceFile, processNode);
            function findReferences(node) {
                switch (node.kind) {
                    case ts.SyntaxKind.CallExpression:
                    case ts.SyntaxKind.NewExpression:
                    case ts.SyntaxKind.TaggedTemplateExpression:
                    case ts.SyntaxKind.Decorator:
                        var signature = checker.getResolvedSignature(node);
                        console.log("调用", signature.declaration.getText());
                        break;
                    case ts.SyntaxKind.Identifier:
                        //const symbol = checker.getSymbolAtLocation(node);
                        //console.log("变量=", symbol.valueDeclaration.getText());
                        break;
                }
                ts.forEachChild(node, findReferences);
            }
            function processNode(node) {
                //if (!node) return;
                if (node.flags & ts.NodeFlags.Export) {
                }
                mapChild(node, processNode);
                return node;
            }
        }
    }
    return program;
};
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
/**
 * 遍历一个节点及子节点，并执行 *callback*。
 * @param node 要遍历的父节点。
 * @param callback 回调函数。如果函数返回 false，则不再继续遍历子节点，否则将继续遍历。
 */
function eachChildDescendent(node, callback) {
    ts.forEachChild(node, function (childNode) {
        if (callback(childNode) === false)
            return;
        eachChildDescendent(childNode, callback);
    });
}
// 重写 createProgram 函数以添加转换。
var createProgram = ts.createProgram;
ts.createProgram = function (rootNames, options, host, oldProgram) {
    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;
    // 编译。
    var program = createProgram.apply(this, arguments);
    var checker = program.getTypeChecker();
    // 处理每个源文件。
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        // if (!ts.isExternalModule(sourceFile)) {
        visitSourceFile(sourceFile);
    }
    /**
     * 处理一个文件。
     * @param sourceFile 要处理的文件。
     */
    function visitSourceFile(sourceFile) {
        // 删除未使用的模块。
        if (options.includedExports) {
            removeUnusedExports(options.includedExports.split(","));
        }
        /**
         * 删除未使用的导出项。
         * @param usedExports 已使用的导出项列表。
         */
        function removeUnusedExports(usedExports) {
            // 第一步：遍历并找出所有导出函数的依赖关系。
            ts.forEachChild(sourceFile, findReferences);
            mapChild(sourceFile, processNode);
            function findReferences(node) {
                switch (node.kind) {
                    case ts.SyntaxKind.CallExpression:
                    case ts.SyntaxKind.NewExpression:
                    case ts.SyntaxKind.TaggedTemplateExpression:
                    case ts.SyntaxKind.Decorator:
                        var signature = checker.getResolvedSignature(node);
                        console.log("调用", signature.declaration.getText());
                        break;
                    case ts.SyntaxKind.Identifier:
                        //const symbol = checker.getSymbolAtLocation(node);
                        //console.log("变量=", symbol.valueDeclaration.getText());
                        break;
                }
                ts.forEachChild(node, findReferences);
            }
            function processNode(node) {
                //if (!node) return;
                if (node.flags & ts.NodeFlags.Export) {
                }
                mapChild(node, processNode);
                return node;
            }
        }
    }
    return program;
};
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
/**
 * 遍历一个节点及子节点，并执行 *callback*。
 * @param node 要遍历的父节点。
 * @param callback 回调函数。如果函数返回 false，则不再继续遍历子节点，否则将继续遍历。
 */
function eachChildDescendent(node, callback) {
    ts.forEachChild(node, function (childNode) {
        if (callback(childNode) === false)
            return;
        eachChildDescendent(childNode, callback);
    });
}
module.exports = ts;
//# sourceMappingURL=_compiler.js.map