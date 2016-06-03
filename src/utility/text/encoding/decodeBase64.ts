
/**
 * 对指定的字符串进行 Base64 解码(支持中文)。
 * @param value 要转换的字符串。
 * @returns 转换后的字符串。
 * @example decodeBase64("5Lit5paH") // "中文"
 */
export function decodeBase64(value: string) {

    // 一次解码 4 个 Base64 字符，得到 3 个字符。
    const base64DecodeChars = [
        62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -2, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
    ];
    let t = [];
    for (let i = 0; i < value.length;) {

        const c1 = base64DecodeChars[value.charCodeAt(i++) - 43];
        const c2 = base64DecodeChars[value.charCodeAt(i++) - 43];
        if (!(c1 >= 0 && c2 >= 0)) continue;
        t.push(c1 << 2 | (c2 & 48) >> 4);

        const c3 = base64DecodeChars[value.charCodeAt(i++) - 43];
        if (!(c3 >= 0)) continue;
        t.push((c2 & 15) << 4 | (c3 & 60) >> 2);

        const c4 = base64DecodeChars[value.charCodeAt(i++) - 43];
        if (!(c4 >= 0)) continue;
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
