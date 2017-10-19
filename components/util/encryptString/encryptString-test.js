define(["require", "exports", "assert", "./encryptString"], function (require, exports, assert, encryptString) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function dencryptStringTest() {
        assert.strictEqual(encryptString.dencryptString("abc", 123), "cce");
    }
    exports.dencryptStringTest = dencryptStringTest;
    function encryptStringTest() {
        assert.strictEqual(encryptString.encryptString("abc", 123), "``e");
    }
    exports.encryptStringTest = encryptStringTest;
});
//# sourceMappingURL=encryptString-test.js.map