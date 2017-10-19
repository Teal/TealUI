define(["require", "exports", "assert", "./bigInteger"], function (require, exports, assert, bigInteger) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function addTest() {
        assert.strictEqual(bigInteger.add("1", "2"), "3");
    }
    exports.addTest = addTest;
    function mulTest() {
        assert.strictEqual(bigInteger.mul("1", "2"), "2");
    }
    exports.mulTest = mulTest;
});
//# sourceMappingURL=bigInteger-test.js.map