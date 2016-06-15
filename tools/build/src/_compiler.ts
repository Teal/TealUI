/**
 * 表示一个 TypeScript 语法树转换器。
 */

import * as ts from "typescript";

/**
 * 表示转换的选项。
 */
export interface TranslateOptions {

}

/**
 * 表示一个语法转换器。
 */
export class Translator {

    /**
     * 获取当前要转换的程序。
     */
    program: ts.Program;

    /**
     * 获取当前的类型检查器。
     */
    checker: ts.TypeChecker;

    /**
     * 获取当前的转换选项。
     */
    options: TranslateOptions;

    /**
     * 转换指定的程序。
     * @param program 要转换的程序。
     * @param options 转换的选项。
     */
    translate(program: ts.Program, options: TranslateOptions) {
        this.program = program;
        this.options = options;
        this.checker = program.getTypeChecker();
    }

}

// 重写 createProgram 函数以添加转换。
const createProgram = ts.createProgram;
ts.createProgram = function (rootNames: string[], options: CompilerOptions, host?: ts.CompilerHost, oldProgram?: ts.Program) {

    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;

    // 编译。
    const program = createProgram.apply(this, arguments) as ts.Program;
    const checker = program.getTypeChecker();

    // 处理每个源文件。
    for (const sourceFile of program.getSourceFiles()) {
        // if (!ts.isExternalModule(sourceFile)) {
        visitSourceFile(sourceFile);
        // }
    }

    /**
     * 处理一个文件。
     * @param sourceFile 要处理的文件。
     */
    function visitSourceFile(sourceFile: ts.SourceFile) {

        // 删除未使用的模块。
        if (options.includedExports) {
            removeUnusedExports(options.includedExports.split(","));
        }

        /**
         * 删除未使用的导出项。
         * @param usedExports 已使用的导出项列表。
         */
        function removeUnusedExports(usedExports: string[]) {

            // 第一步：遍历并找出所有导出函数的依赖关系。

            ts.forEachChild(sourceFile, findReferences);
            mapChild(sourceFile, processNode);

            function findReferences(node: ts.Node) {
                switch (node.kind) {
                    case ts.SyntaxKind.CallExpression:
                    case ts.SyntaxKind.NewExpression:
                    case ts.SyntaxKind.TaggedTemplateExpression:
                    case ts.SyntaxKind.Decorator:
                        const signature = checker.getResolvedSignature((node as ts.CallLikeExpression));
                        console.log("调用", signature.declaration.getText());
                        break;
                    case ts.SyntaxKind.Identifier:
                        //const symbol = checker.getSymbolAtLocation(node);
                        //console.log("变量=", symbol.valueDeclaration.getText());
                        break;
                }

                ts.forEachChild(node, findReferences);
            }

            function processNode(node: ts.Node) {
                //if (!node) return;

                if (node.flags & ts.NodeFlags.Export) {
                    //if ((node as ts.FunctionDeclaration).name.text == "a") {
                    //    (node as ts.FunctionDeclaration).name = ts.createNode(ts.SyntaxKind.Identifier) as ts.Identifier;
                    //    (node as ts.FunctionDeclaration).name.text = "___g";
                    //}
                }

                mapChild(node, processNode);

                return node;
            }

        }

    }

    return program;
};

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

/**
 * 遍历一个节点及子节点，并执行 *callback*。
 * @param node 要遍历的父节点。
 * @param callback 回调函数。如果函数返回 false，则不再继续遍历子节点，否则将继续遍历。
 */
function eachChildDescendent(node: ts.Node, callback: (node: ts.Node) => boolean) {
    ts.forEachChild(node, childNode => {
        if (callback(childNode) === false) return;
        eachChildDescendent(childNode, callback);
    });
}

import * as ts from "typescript";

/**
 * 扩展的编译选项。
 */
interface CompilerOptions extends ts.CompilerOptions {

    /**
     * 如果指定了导入的模块，则只有列表中包含的名称会被正常导出，其它名称会被删除。
     */
    includedExports?: string;

}

// 重写 createProgram 函数以添加转换。
const createProgram = ts.createProgram;
ts.createProgram = function (rootNames: string[], options: CompilerOptions, host?: ts.CompilerHost, oldProgram?: ts.Program) {

    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;

    // 编译。
    const program = createProgram.apply(this, arguments) as ts.Program;
    const checker = program.getTypeChecker();

    // 处理每个源文件。
    for (const sourceFile of program.getSourceFiles()) {
        // if (!ts.isExternalModule(sourceFile)) {
        visitSourceFile(sourceFile);
        // }
    }

    /**
     * 处理一个文件。
     * @param sourceFile 要处理的文件。
     */
    function visitSourceFile(sourceFile: ts.SourceFile) {

        // 删除未使用的模块。
        if (options.includedExports) {
            removeUnusedExports(options.includedExports.split(","));
        }

        /**
         * 删除未使用的导出项。
         * @param usedExports 已使用的导出项列表。
         */
        function removeUnusedExports(usedExports: string[]) {

            // 第一步：遍历并找出所有导出函数的依赖关系。

            ts.forEachChild(sourceFile, findReferences);
            mapChild(sourceFile, processNode);

            function findReferences(node: ts.Node) {
                switch (node.kind) {
                    case ts.SyntaxKind.CallExpression:
                    case ts.SyntaxKind.NewExpression:
                    case ts.SyntaxKind.TaggedTemplateExpression:
                    case ts.SyntaxKind.Decorator:
                        const signature = checker.getResolvedSignature((node as ts.CallLikeExpression));
                        console.log("调用", signature.declaration.getText());
                        break;
                    case ts.SyntaxKind.Identifier:
                        //const symbol = checker.getSymbolAtLocation(node);
                        //console.log("变量=", symbol.valueDeclaration.getText());
                        break;
                }

                ts.forEachChild(node, findReferences);
            }

            function processNode(node: ts.Node) {
                //if (!node) return;

                if (node.flags & ts.NodeFlags.Export) {
                    //if ((node as ts.FunctionDeclaration).name.text == "a") {
                    //    (node as ts.FunctionDeclaration).name = ts.createNode(ts.SyntaxKind.Identifier) as ts.Identifier;
                    //    (node as ts.FunctionDeclaration).name.text = "___g";
                    //}
                }

                mapChild(node, processNode);

                return node;
            }

        }

    }

    return program;
};

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

/**
 * 遍历一个节点及子节点，并执行 *callback*。
 * @param node 要遍历的父节点。
 * @param callback 回调函数。如果函数返回 false，则不再继续遍历子节点，否则将继续遍历。
 */
function eachChildDescendent(node: ts.Node, callback: (node: ts.Node) => boolean) {
    ts.forEachChild(node, childNode => {
        if (callback(childNode) === false) return;
        eachChildDescendent(childNode, callback);
    });
}

export = ts;
