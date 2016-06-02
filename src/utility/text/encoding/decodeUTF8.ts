
/**
 * 对指定的字符串进行 UTF-8 解码。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example decodeUTF8("\\u4f60") // "你"
 */
export function decodeUTF8(value: string) {
    return value.replace(/\\u(\w{4}|\w{2})/gi, (_: string, unicode: string) => String.fromCharCode(parseInt(unicode, 16)));
}
