define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 使用 Base64 编码字符串。
     * @param value 要编码的字符串。
     * @return 返回编码后的字符串。非 ASCII 字符将先以 UTF-8 编码格式转换为 ASCII 字符。
     * @example encodeBase64("中文") // "5Lit5paH"
     */
    function encodeBase64(value) {
        // 转换 Unicode 字符为 utf-8 字符序列，确保每个字符都是 ASCII 字符。
        var t = [];
        for (var i = 0; i < value.length; i++) {
            var c = value.charCodeAt(i);
            if (c < 128) {
                t.push(c);
            }
            else if (c < 2048) {
                t.push(192 | c >> 6 & 31, 128 | c >> 0 & 63);
            }
            else {
                t.push(224 | c >> 12 & 15, 128 | c >> 6 & 63, 128 | c >> 0 & 63);
            }
        }
        // 一次编码 3 个字符，得到 4 位 Base64 编码，如果位数不够则补 '='。
        var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var length = t.length;
        var r = "";
        for (var i = 0; i < length;) {
            var c1 = t[i++];
            r += base64Chars.charAt(c1 >> 2);
            if (i === length) {
                r += base64Chars.charAt((c1 & 3) << 4) + "==";
                break;
            }
            var c2 = t[i++];
            r += base64Chars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
            if (i === length) {
                r += base64Chars.charAt((c2 & 15) << 2) + "=";
                break;
            }
            var c3 = t[i++];
            r += base64Chars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6) + base64Chars.charAt(c3 & 63);
        }
        return r;
    }
    exports.encodeBase64 = encodeBase64;
    /**
     * 解码使用 Base64 编码的字符串。
     * @param value 要解码的字符串。
     * @return 返回解码后的字符串。
     * @example decodeBase64("5Lit5paH") // "中文"
     */
    function decodeBase64(value) {
        // 一次解码 4 个 Base64 字符，得到 3 个字符。
        var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var t = [];
        for (var i = 0; i < value.length;) {
            var c1 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
            var c2 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
            if (c1 < 0 || c2 < 0)
                continue;
            t.push(c1 << 2 | (c2 & 48) >> 4);
            var c3 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
            if (c3 < 0)
                continue;
            t.push((c2 & 15) << 4 | (c3 & 60) >> 2);
            var c4 = i < value.length ? base64Chars.indexOf(value.charAt(i++)) : -1;
            if (c4 < 0)
                continue;
            t.push((c3 & 3) << 6 | c4);
        }
        // 转换 ASCII 字符为 Unicode 字符。
        var r = "";
        for (var i = 0; i < t.length;) {
            var c = t[i++];
            if (c < 128) {
                r += String.fromCharCode(c);
            }
            else if (c > 191 && c < 224) {
                r += String.fromCharCode((c & 31) << 6 | t[i++] & 63);
            }
            else if (c > 223 && c < 240) {
                r += String.fromCharCode((c & 15) << 12 | (t[i++] & 63) << 6 | (t[i++] & 63) << 0);
            }
        }
        return r;
    }
    exports.decodeBase64 = decodeBase64;
});
//# sourceMappingURL=base64.js.map