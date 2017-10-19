define(["require", "exports", "assert", "./des"], function (require, exports, assert, des) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function encryptDESTest() {
        assert.strictEqual(des.encryptDES("a", "1"), "\u0082\u000e\u0056\u00cc\u007c\u0045\u0059\u00a4");
    }
    exports.encryptDESTest = encryptDESTest;
    function decryptDESTest() {
        assert.strictEqual(des.decryptDES("\u0082\u000e\u0056\u00cc\u007c\u0045\u0059\u00a4", "1"), "a");
    }
    exports.decryptDESTest = decryptDESTest;
});
//# sourceMappingURL=des-test.js.map