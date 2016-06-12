/**
 * @fileOverview 解析 XML
 * @author xuld@vip.qq.com
 */

/**
 * 解析一个 XML 文件。
 * @param value 要解析的字符串。
 * @returns 返回解析后的 XML 文档。
 * @example parseXML("&lt;a>&lt;/a>")
 */
export function parseXML(value: string) {
    let xml: Document;
    try {
        if (typeof DOMParser !== "undefined") {// Standard
            const tmp = new DOMParser();
            xml = tmp.parseFromString(value, "text/xml");
        } else {// IE
            xml = new ActiveXObject("Microsoft.XMLDOM");
            (xml as any).async = "false";
            (xml as any).loadXML(value);
        }
    } catch (e) { }
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        throw new SyntaxError('XML.parse: parse error\n' + value);
    }
    return xml;
}
