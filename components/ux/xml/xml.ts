declare var ActiveXObject: any;

/**
 * 解析一个 XML 文件。
 * @param value 要解析的字符串。
 * @return 返回解析后的 XML 文档。
 * @example parseXML("<a>content</a>")
 */
export function parseXML(value: string) {
    let xml: Document | undefined;
    try {
        if (typeof DOMParser !== "undefined") {
            const tmp = new DOMParser();
            xml = tmp.parseFromString(value, "text/xml");
        } else {
            xml = new ActiveXObject("Microsoft.XMLDOM");
            (xml as any).async = "false";
            (xml as any).loadXML(value);
        }
    } catch (e) { }
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        throw new SyntaxError("XML.parse: parse error\n" + value);
    }
    return xml;
}
