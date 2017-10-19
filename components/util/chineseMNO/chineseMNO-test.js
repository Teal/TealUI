define(["require", "exports", "assert", "./chineseMNO"], function (require, exports, assert, chineseMNO_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function mnoTest() {
        assert.strictEqual(chineseMNO_1.default("13645465454"), "chinaMobile");
    }
    exports.mnoTest = mnoTest;
});
//# sourceMappingURL=chineseMNO-test.js.map