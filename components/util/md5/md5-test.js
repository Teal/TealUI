define(["require", "exports", "assert", "./md5"], function (require, exports, assert, md5_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function md5Test() {
        assert.strictEqual(md5_1.default("a"), "0cc175b9c0f1b6a831c399e269772661");
    }
    exports.md5Test = md5Test;
});
//# sourceMappingURL=md5-test.js.map