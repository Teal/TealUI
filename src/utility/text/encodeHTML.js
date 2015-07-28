
/**
 * 编码 HTML 特殊字符。
 * @param {String} value 要编码的字符串。
 * @returns {String} 返回已编码的字符串。
 * @remark 此函数主要将 & < > ' " 分别编码成 &amp; &lt; &gt; &#39; &quot; 。
 */
function encodeHTML(value) {

    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\'': '&#39;',
        '\"': '&quot;'
    };

    function replaceMap(v) {
        return map[v];
    }

    return value.replace(/[&<>\'\"]/g, replaceMap);
}
