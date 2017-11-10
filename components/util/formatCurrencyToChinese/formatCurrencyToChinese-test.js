define(["require", "exports", "assert", "./formatCurrencyToChinese"], function (require, exports, assert, formatCurrencyToChinese_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function formatCurrencyToChineseTest() {
        assert.strictEqual(formatCurrencyToChinese_1.default(10000000), "壹仟万元");
    }
    exports.formatCurrencyToChineseTest = formatCurrencyToChineseTest;
});
//# sourceMappingURL=formatCurrencyToChinese-test.js.map