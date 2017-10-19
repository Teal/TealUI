define(["require", "exports", "assert", "./base64"], function (require, exports, assert, base64) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function encodeBase64Test() {
        assert.strictEqual(base64.encodeBase64("中文"), "5Lit5paH");
    }
    exports.encodeBase64Test = encodeBase64Test;
    function decodeBase64Test() {
        assert.strictEqual(base64.decodeBase64("5Lit5paH"), "中文");
    }
    exports.decodeBase64Test = decodeBase64Test;
});
//# sourceMappingURL=base64-test.js.map