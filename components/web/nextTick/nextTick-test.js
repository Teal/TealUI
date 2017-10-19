define(["require", "exports", "assert", "./nextTick"], function (require, exports, assert, nextTick_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function nextTickTest(done) {
        var i = 0;
        nextTick_1.default(function () {
            i++;
        });
        nextTick_1.default(function () {
            assert.strictEqual(i, 1);
            done();
        });
        assert.strictEqual(i, 0);
    }
    exports.nextTickTest = nextTickTest;
});
//# sourceMappingURL=nextTick-test.js.map