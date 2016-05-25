/*
 * 
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 *
 * By lizq
 *
 * 2006-11-11
 * 
 * 
 * Modified by xuld
 * 
 * 2015-7-29
 *
 */

/**
 * 计算一个字符串的 SHA-1 值。
 * @param {String} str 要计算的字符串。
 * @returns {String} 返回 @str 加密后的字符串。其所有字符均为小写。
 * @example sha1("abc") // "a9993e364706816aba3e25717850c26c9cd0d89d"
 */
function sha1(str) {
    typeof console === "object" && console.assert(typeof str === "string", "sha1(str: 必须是字符串)");
    return sha1.binaryToString(sha1.calc(sha1.stringToBinary(str)));
}

/**
 * SHA-1 算法使用的字符集。如需更改 SHA-1 返回的大小写可更改此字段。
 * @inner
 */
sha1.hexChars = "0123456789abcdef";

/**
 * SHA-1 算法使用的字符大小。
 * @inner
 */
sha1.charSize = 8;

/**
 * 转换字符串到二进制。
 * 如果字符大于 255 ， 高位被截掉。
 * @inner
 */
sha1.stringToBinary = function (str) {
    var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16);
    for (var i = 0; i < nblk * 16; i++) {
        blks[i] = 0;
    }
    for (i = 0; i < str.length; i++) {
        blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);
    }
    blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
    blks[nblk * 16 - 1] = str.length * 8;
    return blks;
};

/**
 * 转换数组到十六进的字符串。
 * @param {Array} 二进制数组。
 * @returns {String} 字符串。
 * @inner
 */
sha1.binaryToString = function (binArray) {
    var result = "";
    for (var i = 0; i < binArray.length * 4; i++) {
        result += sha1.hexChars.charAt((binArray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + sha1.hexChars.charAt((binArray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return result;
};

/**
 * 计算一个数组的 SHA-1 值。
 * @inner
 */
sha1.calc = function (binArray) {

    /**
     * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法。
     * @inner
     */
    function safeAdd(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF);
    }

    /**
     * 32位二进制数循环左移。
     * @inner
     */
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /**
     * 返回对应F函数的值。
     * @inner
     */
    function sha1Ft(t, b, c, d) {
        if (t < 20)
            return (b & c) | ((~b) & d);
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d; // t<80
    }

    /**
     * 返回对应的Kt值。
     * @inner
     */
    function sha1Kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < binArray.length; i += 16) { // 每次处理512位 16*32
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) { // 对每个512位进行80步操作
            if (j < 16) {
                w[j] = binArray[i + j];
            } else {
                w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var t = safeAdd(safeAdd(rol(a, 5), sha1Ft(j, b, c, d)), safeAdd(safeAdd(e, w[j]), sha1Kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
        e = safeAdd(e, olde);
    }
    return new Array(a, b, c, d, e);
};
