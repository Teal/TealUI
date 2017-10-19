define(["require", "exports", "assert", "./namespace"], function (require, exports, assert, namespace_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function namespaceTest() {
        namespace_1.default("MyNameSpace.SubNamespace");
        assert.ok(window.MyNameSpace.SubNamespace);
        window.MyNameSpace.SubNamespace = 1;
        namespace_1.default("MyNameSpace.SubNamespace");
        assert.strictEqual(window.MyNameSpace.SubNamespace, 1);
    }
    exports.namespaceTest = namespaceTest;
});
//# sourceMappingURL=namespace-test.js.map