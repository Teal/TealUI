
/**
 * 解码 HTML 特殊字符。
 * @param value 要解码的字符串。
 * @returns 返回已解码的字符串。
 * @example decodeHTML("&lt;a&gt;&lt;/a&gt;") // <a></a>
 */
export function decodeHTML(value: string) {
    return value.replace(/&(\w+);/g, (_: string, c: string) => ({
        'amp': '&',
        'lt': '<',
        'gt': '>',
        '#39': '\'',
        'quot': '\"'
    }[c] || c));
}
