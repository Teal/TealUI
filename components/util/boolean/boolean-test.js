define(["require", "exports", "assert", "./boolean"], function (require, exports, assert, boolean) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseTest() {
        assert.equal(boolean.parse(undefined), false);
        assert.equal(boolean.parse(null), false);
        assert.equal(boolean.parse(""), false);
        assert.equal(boolean.parse("foo"), true);
        assert.equal(boolean.parse("false"), false);
        assert.equal(boolean.parse("true"), true);
        assert.equal(boolean.parse("0"), false);
        assert.equal(boolean.parse("1"), true);
    }
    exports.parseTest = parseTest;
});
//# sourceMappingURL=boolean-test.js.map