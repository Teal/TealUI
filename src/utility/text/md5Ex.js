/**
 * @author xuld
 */

// #require md5

/**
 * 计算一个字符串的 HMAC-MD5 值。
 * @param {String} str 要计算的字符串。
 * @returns {String} 返回 @str 加密后的字符串。其所有字符均为大写。
 * @example md5.hmacMd5("abc", "key") // "D2FE98063F876B03193AFB49B4979591"
 */
md5.hmacMd5 = function (str, key) {
    return md5.binaryToString(md5.hmacMd5c(str, key));
};

/**
 * 计算 HMAC-MD5 。
 * @inner
 */
md5.hmacMd5c = function (str, key) {
    var me = md5,
        bkey = me.stringToBinary(key),
        ipad = Array(16),
        opad = Array(16),
        i = 0;

    if (bkey.length > 16)
        bkey = me.calc(bkey, key.length * md5.charSize);

    for (; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    return me.calc(opad.concat(me.calc(ipad.concat(me.stringToBinary(str)), 512 + str.length * md5.charSize)), 512 + 128);
};

/**
 * 计算一个字符串的 Base64-MD5 值。
 * @param {String} str 要计算的字符串。
 * @returns {String} 返回 @str 加密后的字符串。其所有字符均为大写。
 * @example md5.base64Md5("abc")
 */
md5.base64Md5 = function (str) {
    return md5.binaryToBase64(md5.calc(md5.stringToBinary(str), str.length * md5.charSize));
};

/**
 * 转换数组到 base-64 的字符串。
 * @inner
 */
md5.binaryToBase64 = function (binArray, base64Pad) {
    base64Pad = base64Pad || "";

    var result = "",
        i = 0,
        triplet,
        j;
    for (; i < binArray.length * 4; i += 3) {
        triplet = (((binArray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binArray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binArray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);

        for (j = 0; j < 4; j++) {
            result += i * 8 + j * 6 > binArray.length * 32 ? base64Pad : ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F));
        }
    }
    return result;
};

/**
 * 计算一个字符串的 Base64-MD5 值。
 * @param {String} str 要计算的字符串。
 * @returns {String} 返回 @str 加密后的字符串。其所有字符均为大写。
 * @example md5.base64HmacMd5("abc", "key") // "0v6YBj+HawMZOvtJtJeVkQ"
 */
md5.base64HmacMd5 = function (str, key) {
    return md5.binaryToBase64(md5.hmacMd5c(str, key));
};
