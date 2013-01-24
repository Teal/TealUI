/**
 * @author xuld
 */


include("text/md5.js");

/**
 * 计算一个字符串的 MD5值。
 * @param {String} s 字符串。
 * @return {String} md5 字符串。
 */
Encryption.hmacMd5 = function (key, data) {
    return Encryption.binl2hex(Encryption.hmacMd5c(key, data));
};

/**
 * 计算 HMAC-MD5 。
 */
Encryption.hmacMd5c = function (key, data) {
    assert.notNull(key, "key");
    assert.notNull(data, "data");
    var me = Encryption,
        charSize = 8,
        bkey = me.str2binl(key);
    if (bkey.length > 16)
        bkey = me.md5c(bkey, key.length * charSize);

    var ipad = Array(16), opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = me.md5c(ipad.concat(me.str2binl(data)), 512 + data.length * charSize);
    return me.md5c(opad.concat(hash), 512 + 128);
};

/**
 * 计算一个字符串的 MD5值。
 * @param {String} s 字符串。
 * @return {String} md5 字符串。
 */
Encryption.base64Md5 = function (s) {
    var charSize = 8;
    return Encryption.binl2b64(Encryption.md5c(Encryption.str2binl(s), s.length * charSize));
};

/**
 * 转换数组到 base-64 的字符串。
 */
Encryption.binl2b64 = function (binarray, base64pad) {
    var str = "";
    base64pad = base64pad || "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
        (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
        ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32)
                str += base64pad;
            else
                str += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
};

/**
 * 计算一个字符串的 MD5值。
 * @param {String} s 字符串。
 * @return {String} md5 字符串。
 */
Encryption.base64HmacMd5 = function (key, data) {
    assert.notNull(key, "key");
    assert.notNull(data, "data");
    return Encryption.binl2b64(Encryption.md5c(key, data));
};


