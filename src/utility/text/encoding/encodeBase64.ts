
/**
 * 对指定的字符串进行 Base64 编码(支持中文)。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example encodeBase64("中文") // "5Lit5paH"
 */
export function encodeBase64(value: string) {

    // 转换 Unicode 字符为 UTF8 字符序列，确保每个字符都是 ASCII 字符。
    let t: number[] = [];
    for (let i = 0; i < value.length; i++) {
        const c = value.charCodeAt(i);
        if (c < 128) {
            t.push(c);
        } else if (c < 2048) {
            t.push(192 | c >> 6 & 31, 128 | c >> 0 & 63);
        } else {
            t.push(224 | c >> 12 & 15, 128 | c >> 6 & 63, 128 | c >> 0 & 63);
        }
    }

    // 一次编码 3 个字符，得到 4 位 Base64 编码，如果位数不够则补 '='。
    const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const length = t.length;
    let result = "";
    for (let i = 0; i < length;) {

        const c1 = t[i++];
        result += base64EncodeChars.charAt(c1 >> 2);
        if (i === length) {
            result += base64EncodeChars.charAt((c1 & 3) << 4) + "==";
            break;
        }

        const c2 = t[i++];
        result += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
        if (i === length) {
            result += base64EncodeChars.charAt((c2 & 15) << 2) + "=";
            break;
        }

        const c3 = t[i++];
        result += base64EncodeChars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6) + base64EncodeChars.charAt(c3 & 63);

    }
    return result;
}
