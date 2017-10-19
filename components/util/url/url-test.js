define(["require", "exports", "assert", "./url"], function (require, exports, assert, url_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function urlTest() {
        assert.strictEqual(url_1.default.format(url_1.default.parse("http://tealui.com/index.html?from=parse")), "http://tealui.com/index.html?from=parse");
    }
    exports.urlTest = urlTest;
});
//# sourceMappingURL=url-test.js.map