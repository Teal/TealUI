/**
 * @author
 */

var XMLDocument = XMLDocument || {};

/**
 * 解析一个 XML 文件。
 * @param {String} value 要解析的字符串。
 * @param {XMLDocument} 返回解析后的 XML 文档。
 * @example XMLDocument.parse("&lt;a>&lt;/a>")
 */
XMLDocument.parse = function (value) {
    if (typeof value !== "string" || !value) {
        return null;
    }
    var xml, tmp;
    try {
        if (window.DOMParser) {// Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString(value, "text/xml");
        } else {// IE
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = "false";
            xml.loadXML(value);
        }
    } catch (e) {
        xml = undefined;
    }
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        throw new SyntaxError('XML.parse: parse error\n' + value);
    }
    return xml;
};