/**
 * 使用 UTF-8 编码字符串。
 * @param value 要编码的字符串。
 * @return 返回编码后的字符串，使用 JavaScript 转义格式。
 * @example encodeUTF8("你") // "\\u4f60"
 */
export function encodeUTF8(value: string) {
    let r = "";
    for (let i = 0; i < value.length; i++) {
        const t = value.charCodeAt(i).toString(16);
        r += "\\u" + new Array(5 - t.length).join("0") + t;
    }
    return r;
}

/**
 * 解码使用 UTF-8 编码的字符串。
 * @param value 要解码的字符串。
 * @return 返回解码后的字符串。
 * @example decodeUTF8("\\u4f60") // "你"
 */
export function decodeUTF8(value: string) {
    return value.replace(/\\u(\w{4}|\w{2})/gi, (_: string, unicode: string) => String.fromCharCode(parseInt(unicode, 16)));
}
