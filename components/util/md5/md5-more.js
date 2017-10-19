define(["require", "exports", "./md5"], function (require, exports, md5_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 计算字符串的 MD5-Base64 值。
     * @param value 要计算的字符串。
     * @return 返回计算后的字符串。
     * @example md5Base64("abc") // "kAFQmDzST7DWlj99KOF/cg"
     */
    function md5Base64(value) {
        return binaryToBase64(md5_1.md5Binary(value));
    }
    exports.md5Base64 = md5Base64;
    /**
     * 使用 Base64 编码字节数组。
     * @param value 要编码的字节数组。
     * @param padding 用于补齐编码的字符。
     * @return 返回编码后字符串。
     * @internal
     */
    function binaryToBase64(value, padding) {
        if (padding === void 0) { padding = ""; }
        var r = "";
        for (var i = 0; i < value.length * 4; i += 3) {
            var triplet = (value[i >> 2] >> i % 4 * 8 & 255) << 16 | (value[i + 1 >> 2] >> (i + 1) % 4 * 8 & 0xff) << 8 | value[i + 2 >> 2] >> (i + 2) % 4 * 8 & 0xff;
            for (var j = 0; j < 4; j++) {
                r += i * 8 + j * 6 > value.length * 32 ? padding : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F));
            }
        }
        return r;
    }
    exports.binaryToBase64 = binaryToBase64;
    /**
     * 计算字符串的 HMAC-MD5 值。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @return 返回计算后的字符串。
     * @example hmacMd5("abc", "key") // "d2fe98063f876b03193afb49b4979591"
     */
    function hmacMD5(value, key) {
        return md5_1.binaryToString(hmacBinary(value, key));
    }
    exports.hmacMD5 = hmacMD5;
    /**
     * 计算字符串的 HMAC-MD5-Base64 值。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @return 返回加密后的字符串，其中只包含小写字母。
     * @example hmacMD5Base64("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
     */
    function hmacMD5Base64(value, key) {
        return binaryToBase64(hmacBinary(value, key));
    }
    exports.hmacMD5Base64 = hmacMD5Base64;
    /**
     * 计算字符串的 HMAC-MD5-Base64 值并返回字节数组。
     * @param value 要计算的字符串。
     * @param key 加密的密钥。
     * @return 返回字节数组。
     * @internal
     */
    function hmacBinary(value, key) {
        value = unescape(encodeURIComponent(value));
        key = unescape(encodeURIComponent(key));
        var bkey = md5_1.stringToBinary(key);
        if (bkey.length > 16)
            bkey = md5_1.md5Core(bkey, key.length * 8);
        var ipad = [];
        var opad = [];
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        return md5_1.md5Core(opad.concat(md5_1.md5Core(ipad.concat(md5_1.stringToBinary(value)), 512 + value.length * 8)), 512 + 128);
    }
    exports.hmacBinary = hmacBinary;
});
//# sourceMappingURL=md5-more.js.map