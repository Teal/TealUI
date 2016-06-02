
/**
 * 解码 HTML 特殊字符。
 * @param {String} str 要解码的字符串。
 * @returns {String} 返回已解码的字符串。
 * @example decodeHTML("&lt;a&gt;&lt;/a&gt;") // &amp;lt;a&amp;gt;&amp;lt;/a&amp;gt;
 */
function decodeHTML(str) {
    typeof console === "object" && console.assert(typeof str === "string", "decodeHTML(str: 必须是字符串)");
    return str.replace(/&(\w+);/g, function (_, v) {
        return {
            'amp': '&',
            'lt': '<',
            'gt': '>',
            '#39': '\'',
            'quot': '\"'
        }[v] || v;
    });
}
