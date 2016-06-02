// #todo


/**
 * 编码 HTML 属性特殊字符。
 * @param {String} str 要编码的字符串。
 * @returns {String} 返回已编码的字符串。
 * @remark 此函数主要将 ' " 分别编码成 &#39; &quot; 。
 * @example encodeHTML("'") // &amp;#39;
 */
function encodeHTMLAttribute(str) {
    typeof console === "object" && console.assert(typeof str === "string", "encodeHTMLAttribute(str: 必须是字符串)");
    return str.replace(/[\'\"]/g, function (v) {
        return ({
            '\'': '&#39;',
            '\"': '&quot;'
        })[v];
    });
}
