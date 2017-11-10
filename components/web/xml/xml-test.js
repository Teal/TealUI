define(["require", "exports", "assert", "./xml"], function (require, exports, assert, xml) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function xmlTest() {
        assert.equal(xml.parseXML("<a>content</a>").firstChild.nodeName, "a");
    }
    exports.xmlTest = xmlTest;
});
//# sourceMappingURL=xml-test.js.map