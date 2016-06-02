
/**
 * 对指定的字符串进行 UTF-8 编码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example encodeUTF8("你") // "\\u4f60"
 */
export function encodeUTF8(value) {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        const t = value.charCodeAt(i).toString(16);
        result += "\\u" + new Array(5 - t.length).join("0") + t;
    }
    return result;
}
