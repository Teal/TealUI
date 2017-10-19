define(["require", "exports", "assert", "./outerHTML"], function (require, exports, assert, outerHTML) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getOuterHTMLTest() {
        assert.strictEqual(outerHTML.getOuterHTML(document.getElementById("qunit-fixture")), "<div id=\"qunit-fixture\"></div>");
    }
    exports.getOuterHTMLTest = getOuterHTMLTest;
    function setOuterHTMLTest() {
        outerHTML.setOuterHTML(document.getElementById("qunit-fixture"), "<div id=\"qunit-fixture\" class=\"doc\"></div>");
        assert.strictEqual(outerHTML.getOuterHTML(document.getElementById("qunit-fixture")), "<div id=\"qunit-fixture\" class=\"doc\"></div>");
    }
    exports.setOuterHTMLTest = setOuterHTMLTest;
});
//# sourceMappingURL=outerHTML-test.js.map