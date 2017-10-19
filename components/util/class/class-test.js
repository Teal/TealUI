define(["require", "exports", "assert", "./class"], function (require, exports, assert, class_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function extendTest() {
        var clazz = class_1.default.extend({
            fontSize: 1
        });
        assert.strictEqual(new clazz().fontSize, 1);
        assert.ok(clazz.extend);
    }
    exports.extendTest = extendTest;
});
//# sourceMappingURL=class-test.js.map