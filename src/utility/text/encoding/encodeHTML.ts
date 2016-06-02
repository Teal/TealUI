
/**
 * 编码 HTML 特殊字符。
 * @param value 要编码的字符串。
 * @returns 返回已编码的字符串。
 * @remark 此函数主要将 `& < > ' "` 分别编码成 `&amp; &lt; &gt; &#39; &quot;`。
 * @example encodeHTML("<a></a>") // &lt;a&gt;&lt;/a&gt;
 */
export function encodeHTML(value: string) {
    return value.replace(/[&<>\'\"]/g, (c: string) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\'': '&#39;',
        '\"': '&quot;'
    })[c]);
}
