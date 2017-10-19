define(["require", "exports", "assert", "./sha1"], function (require, exports, assert, sha1_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function sha1Test() {
        assert.strictEqual(sha1_1.default("abc"), "a9993e364706816aba3e25717850c26c9cd0d89d");
    }
    exports.sha1Test = sha1Test;
});
//# sourceMappingURL=sha1-test.js.map