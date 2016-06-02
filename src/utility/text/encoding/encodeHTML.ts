
/**
 * 编码 HTML 特殊字符。
 * @param {String} str 要编码的字符串。
 * @returns {String} 返回已编码的字符串。
 * @remark 此函数主要将 & < > ' " 分别编码成 &amp; &lt; &gt; &#39; &quot; 。
 * @example encodeHTML("&lt;a&gt;&lt;/a&gt;") // &amp;lt;a&amp;gt;&amp;lt;/a&amp;gt;
 */
function encodeHTML(str) {
    typeof console === "object" && console.assert(typeof str === "string", "encodeHTML(str: 必须是字符串)");
    return str.replace(/[&<>\'\"]/g, function (v) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '\'': '&#39;',
            '\"': '&quot;'
        })[v];
    });
}
