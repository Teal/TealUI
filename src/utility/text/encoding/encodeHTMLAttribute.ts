
/**
 * 编码 HTML 属性特殊字符。
 * @param value 要编码的字符串。
 * @returns 返回已编码的字符串。
 * @remark 此函数主要将 ' " 分别编码成 &#39; &quot; 。
 * @example encodeHTMLAttribute("'") // &amp;#39;
 */
export function encodeHTMLAttribute(value) {
    return value.replace(/[\'\"]/g, (c: string) => ({
        '\'': '&#39;',
        '\"': '&quot;'
    })[c]);
}
