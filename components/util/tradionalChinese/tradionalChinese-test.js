define(["require", "exports", "assert", "./tradionalChinese"], function (require, exports, assert, tradionalChinese) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function toSimpleChineseTest() {
        assert.equal(tradionalChinese.toSimpleChinese("简體"), "简体");
    }
    exports.toSimpleChineseTest = toSimpleChineseTest;
    function toTradionalChineseTest() {
        assert.equal(tradionalChinese.toTradionalChinese("简体"), "簡體");
    }
    exports.toTradionalChineseTest = toTradionalChineseTest;
});
//# sourceMappingURL=tradionalChinese-test.js.map