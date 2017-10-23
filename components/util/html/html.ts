/**
 * 编码 HTML 转义字符。
 * @param value 要编码的字符串。
 * @return 返回已编码的字符串。HTML 特殊字符 `&`、`<`、`>`、`'`、`"` 分别会被编码成 `&amp;`、`&lt;`、`&gt;`、`&#39;`、`&quot;`。
 * @example encodeHTML("<a></a>") // "&lt;a&gt;&lt;/a&gt;"
 */
export function encodeHTML(value: string) {
    return value.replace(/[&<>'"]/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\'": "&#39;",
        '\"': "&quot;"
    } as any)[c]);
}

/**
 * 编码 HTML 属性转义字符。
 * @param value 要编码的字符串。
 * @return 返回已编码的字符串。HTML 属性转义字符 `'`、`"` 分别会被编码成 `&#39;`、`&quot;`。
 * @example encodeHTMLAttribute("'") // "&#39;"
 */
export function encodeHTMLAttribute(value: string) {
    return value.replace(/['"]/g, c => ({
        "\'": "&#39;",
        '\"': "&quot;"
    } as any)[c]);
}

/**
 * 解码 HTML 转义字符。
 * @param value 要解码的字符串。
 * @return 返回已解码的字符串。
 * @example decodeHTML("&lt;a&gt;&lt;/a&gt;") // "<a></a>"
 */
export function decodeHTML(value: string) {
    return value.replace(/&(#(\d+)|\w+);/g, (_: string, word: string, unicode: string) => unicode ? String.fromCharCode(+unicode) : (({
        "amp": "&",
        "lt": "<",
        "gt": ">",
        "quot": '\"'
    } as any)[word] || word));
}

/**
 * 为 HTML 属性值添加引号。
 * @param value HTML 属性值。
 * @param quote 要添加的引号。
 * @return 返回含引号的 HTML 属性。属性值的引号会被编码。
 * @example escapeHTMLAttribute("a", '"') // "\"a\""
 */
export function wrapHTMLAttribute(value: string, quote?: string): string {
    const q = quote && quote.charCodeAt(0);
    return q === 34 /*"*/ ? '"' + value.replace(/"/g, "&quot;") + '"' :
        q === 39 /*'*/ ? "'" + value.replace(/'/g, "&#39;") + "'" :
            /[>\s="']/.test(value) ? wrapHTMLAttribute(value, value.indexOf('"') >= 0 && value.indexOf("\'") < 0 ? "\'" : '"') : value;
}

/**
 * 删除 HTML 属性值的引号。
 * @param value 含引号的 HTML 属性。
 * @return 返回原始 HTML 属性值。属性值的 HTML 会被解码。
 * @example unescapeHTMLAttribute("'a'") // "a"
 */
export function unwrapHTMLAttribute(value: string) {
    return decodeHTML(value.replace(/^(['"])(.*)\1$/, "$2"));
}
