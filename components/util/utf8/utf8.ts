/**
 * 对指定的字符串进行 UTF-8 编码。
 * @param value 要转换的字符串。
 * @return 返回转换后的字符串。
 * @example encodeUTF8("你") // "\\u4f60"
 */
export function encodeUTF8(value: string) {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        const t = value.charCodeAt(i).toString(16);
        result += "\\u" + new Array(5 - t.length).join("0") + t;
    }
    return result;
}

/**
 * 对指定的字符串进行 UTF-8 解码。
 * @param value 要转换的字符串。
 * @return 返回转换后的字符串。
 * @example decodeUTF8("\\u4f60") // "你"
 */
export function decodeUTF8(value: string) {
    return value.replace(/\\u(\w{4}|\w{2})/gi, (_: string, unicode: string) => String.fromCharCode(parseInt(unicode, 16)));
}
