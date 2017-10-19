define(["require", "exports", "assert", "./currency"], function (require, exports, assert, currency) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function addTest() {
        assert.strictEqual(currency.add(86.24, 0.1), 86.34);
    }
    exports.addTest = addTest;
    function subTest() {
        assert.strictEqual(currency.sub(7, 0.8), 6.2);
    }
    exports.subTest = subTest;
    function mulTest() {
        assert.strictEqual(currency.mul(7, 0.8), 5.6);
    }
    exports.mulTest = mulTest;
    function divTest() {
        assert.strictEqual(currency.div(7, 0.8), 8.75);
    }
    exports.divTest = divTest;
    function roundTest() {
        assert.strictEqual(currency.round(86.245), 86.25);
    }
    exports.roundTest = roundTest;
    function formatTest() {
        assert.strictEqual(currency.format(86234.245), "86,234.25");
    }
    exports.formatTest = formatTest;
});
//# sourceMappingURL=currency-test.js.map