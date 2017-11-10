define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 解析一个 XML 文件。
     * @param value 要解析的字符串。
     * @return 返回解析后的 XML 文档。
     * @example parseXML("<a>content</a>")
     */
    function parseXML(value) {
        var xml;
        try {
            if (typeof DOMParser !== "undefined") {
                var tmp = new DOMParser();
                xml = tmp.parseFromString(value, "text/xml");
            }
            else {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(value);
            }
        }
        catch (e) { }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            throw new SyntaxError("XML.parse: parse error\n" + value);
        }
        return xml;
    }
    exports.parseXML = parseXML;
});
//# sourceMappingURL=xml.js.map