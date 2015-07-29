
/**
 * 编码 HTML 特殊字符。
 * @param {String} value 要编码的字符串。
 * @returns {String} 返回已编码的字符串。
 * @remark 此函数主要将 & < > ' " 分别编码成 &amp; &lt; &gt; &#39; &quot; 。
 * @example encodeHTML("&lt;a&gt;&lt;/a&gt;") // &amp;lt;a&amp;gt;&amp;lt;/a&amp;gt;
 */
function encodeHTML(value) {
    return value.replace(/[&<>\'\"]/g, function (v) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '\'': '&#39;',
            '\"': '&quot;'
        })[v];
    });
}
