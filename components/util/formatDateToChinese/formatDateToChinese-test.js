define(["require", "exports", "assert", "./formatDateToChinese"], function (require, exports, assert, formatDateToChinese_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function formatDateToChineseTest() {
        assert.strictEqual(formatDateToChinese_1.default(new Date()), "刚刚");
    }
    exports.formatDateToChineseTest = formatDateToChineseTest;
});
//# sourceMappingURL=formatDateToChinese-test.js.map