define(["require", "exports", "assert", "./gb2312"], function (require, exports, assert, gb2312) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function encodeGB2312Test() {
        assert.strictEqual(gb2312.encodeGB2312("你"), "%C4%E3");
    }
    exports.encodeGB2312Test = encodeGB2312Test;
    function decodeGB2312Test() {
        assert.strictEqual(gb2312.decodeGB2312("%C4%E3"), "你");
    }
    exports.decodeGB2312Test = decodeGB2312Test;
});
//# sourceMappingURL=gb2312-test.js.map