/**
 * 对指定的字符串进行 Base64 编码(支持中文)。
 * @param value 要转换的字符串。
 * @return 返回转换后的字符串。
 * @example encodeBase64("中文") // "5Lit5paH"
 */
export function encodeBase64(value: string) {

    // 转换 Unicode 字符为 UTF8 字符序列，确保每个字符都是 ASCII 字符。
    const t: number[] = [];
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
    const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const length = t.length;
    let result = "";
    for (let i = 0; i < length;) {

        const c1 = t[i++];
        result += base64Chars.charAt(c1 >> 2);
        if (i === length) {
            result += base64Chars.charAt((c1 & 3) << 4) + "==";
            break;
        }

        const c2 = t[i++];
        result += base64Chars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
        if (i === length) {
            result += base64Chars.charAt((c2 & 15) << 2) + "=";
            break;
        }

        const c3 = t[i++];
        result += base64Chars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6) + base64Chars.charAt(c3 & 63);

    }
    return result;
}

/**
 * 对指定的字符串进行 Base64 解码(支持中文)。
 * @param value 要转换的字符串。
 * @return 返回转换后的字符串。
 * @example decodeBase64("5Lit5paH") // "中文"
 */
export function decodeBase64(value: string) {

    // 一次解码 4 个 Base64 字符，得到 3 个字符。
    const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const t: number[] = [];
    for (let i = 0; i < value.length;) {

        const c1 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
        const c2 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
        if (c1 < 0 || c2 < 0) continue;
        t.push(c1 << 2 | (c2 & 48) >> 4);

        const c3 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
        if (c3 < 0) continue;
        t.push((c2 & 15) << 4 | (c3 & 60) >> 2);

        const c4 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
        if (c4 < 0) continue;
        t.push((c3 & 3) << 6 | c4);

    }

    // 转换 ASCII 字符为 Unicode 字符。
    let result = "";
    for (let i = 0; i < t.length;) {
        const c = t[i++];
        if (c < 128) {
            result += String.fromCharCode(c);
        } else if (c > 191 && c < 224) {
            result += String.fromCharCode((c & 31) << 6 | t[i++] & 63);
        } else if (c > 223 && c < 240) {
            result += String.fromCharCode((c & 15) << 12 | (t[i++] & 63) << 6 | (t[i++] & 63) << 0);
        }
    }
    return result;
}
