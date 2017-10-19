define(["require", "exports", "assert", "./html"], function (require, exports, assert, html) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function encodeHTMLTest() {
        assert.strictEqual(html.encodeHTML("<a></a>"), "&lt;a&gt;&lt;/a&gt;");
    }
    exports.encodeHTMLTest = encodeHTMLTest;
    function encodeHTMLAttributeTest() {
        assert.strictEqual(html.encodeHTMLAttribute("'"), "&#39;");
    }
    exports.encodeHTMLAttributeTest = encodeHTMLAttributeTest;
    function decodeHTMLTest() {
        assert.strictEqual(html.decodeHTML("&lt;a&gt;&lt;/a&gt;"), "<a></a>");
    }
    exports.decodeHTMLTest = decodeHTMLTest;
    function escapeHTMLAttributeTest() {
        assert.strictEqual(html.wrapHTMLAttribute("a", '"'), "\"a\"");
    }
    exports.escapeHTMLAttributeTest = escapeHTMLAttributeTest;
    function unescapeHTMLAttributeTest() {
        assert.strictEqual(html.unwrapHTMLAttribute("'a'"), "a");
    }
    exports.unescapeHTMLAttributeTest = unescapeHTMLAttributeTest;
});
//# sourceMappingURL=html-test.js.map