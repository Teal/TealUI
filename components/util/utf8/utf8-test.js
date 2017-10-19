define(["require", "exports", "assert", "./utf8"], function (require, exports, assert, utf8) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function encodeUTF8Test() {
        assert.strictEqual(utf8.encodeUTF8("你"), "\\u4f60");
    }
    exports.encodeUTF8Test = encodeUTF8Test;
    function decodeUTF8Test() {
        assert.strictEqual(utf8.decodeUTF8("\\u4f60"), "你");
    }
    exports.decodeUTF8Test = decodeUTF8Test;
});
//# sourceMappingURL=utf8-test.js.map