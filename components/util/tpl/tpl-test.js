define(["require", "exports", "assert", "./tpl"], function (require, exports, assert, tpl_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function tplTest() {
        assert.strictEqual(tpl_1.default("Hello <%= $.name %>!", { name: "World" }), "Hello World!");
    }
    exports.tplTest = tplTest;
});
//# sourceMappingURL=tpl-test.js.map