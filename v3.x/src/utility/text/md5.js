/**
 * @author xuld
 */

/**
 * 计算一个字符串的 MD5 值。
 * @param {String} str 要计算的字符串。
 * @returns {String} 返回 @str 加密后的字符串。其所有字符均为小写。
 * @example md5("a") // "0cc175b9c0f1b6a831c399e269772661"
 */
function md5(str) {
    typeof console === "object" && console.assert(typeof str === "string", "md5(str: 必须是字符串)");
    return md5.binaryToString(md5.calc(md5.stringToBinary(str), str.length * md5.charSize));
}

/**
 * MD5 算法使用的字符集。如需更改 MD5 返回的大小写可更改此字段。
 * @inner
 */
md5.hexChars = "0123456789abcdef";

/**
 * MD5 算法使用的字符大小。
 * @inner
 */
md5.charSize = 8;

/**
 * 转换字符串到二进制。
 * 如果字符大于 255 ， 高位被截掉。
 * @inner
 */
md5.stringToBinary = function (str) {
    var result = [];
    for (var i = 0, len = str.length * md5.charSize, mask = (1 << md5.charSize) - 1; i < len; i += md5.charSize) {
        result[i >> 5] |= (str.charCodeAt(i / md5.charSize) & mask) << (i % 32);
    }
    return result;
};

/**
 * 转换数组到十六进的字符串。
 * @param {Array} 二进制数组。
 * @returns {String} 字符串。
 * @inner
 */
md5.binaryToString = function (binArray) {
    var result = "";
    for (var i = 0; i < binArray.length * 4; i++) {
        result += md5.hexChars.charAt((binArray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + md5.hexChars.charAt((binArray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return result;
};

/**
 * 计算一个数组的 MD5 值。
 * @inner
 */
md5.calc = function (binArray, length) {

    /**
     * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法。
     * @inner
     */
    function safeAdd(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF);
    }

    function combine(q, a, b, x, str, t) {
        var num = safeAdd(safeAdd(a, q), safeAdd(x, t));
        return safeAdd((num << str) | (num >>> (32 - str)), b);
    }

    function proc(j0, j1, j2, j3, ts0, ts1, ts2, ts3) {
        var fn = fns[procIndex],
            ps = pss[procIndex];
        a = combine(fn(b, c, d), a, b, binArray[i + j0], ps[0], ts0);
        d = combine(fn(a, b, c), d, a, binArray[i + j1], ps[1], ts1);
        c = combine(fn(d, a, b), c, d, binArray[i + j2], ps[2], ts2);
        b = combine(fn(c, d, a), b, c, binArray[i + j3], ps[3], ts3);
    }

    var fns = [
        function (b, c, d) {
            return (b & c) | ((~b) & d);
        },
        function (b, c, d) {
            return (b & d) | (c & (~d));
        },
        function (b, c, d) {
            return b ^ c ^ d;
        },
        function (b, c, d) {
            return c ^ (b | (~d));
        }
    ], pss = [
        [7, 12, 17, 22],
        [5, 9, 14, 20],
        [4, 11, 16, 23],
        [6, 10, 15, 21],
    ];

    // 靠齐字符串
    binArray[length >> 5] |= 0x80 << ((length) % 32);
    binArray[(((length + 64) >>> 9) << 4) + 14] = length;

    var a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878,
        i = 0,
        procIndex = 0;

    for (; i < binArray.length; i += 16) {
        var oldA = a,
            oldB = b,
            oldC = c,
            oldD = d;

        procIndex = 0;
        proc(0, 1, 2, 3, -680876936, -389564586, 606105819, -1044525330);
        proc(4, 5, 6, 7, -176418897, 1200080426, -1473231341, -45705983);
        proc(8, 9, 10, 11, 1770035416, -1958414417, -42063, -1990404162);
        proc(12, 13, 14, 15, 1804603682, -40341101, -1502002290, 1236535329);

        procIndex = 1;
        proc(1, 6, 11, 0, -165796510, -1069501632, 643717713, -373897302);
        proc(5, 10, 15, 4, -701558691, 38016083, -660478335, -405537848);
        proc(9, 14, 3, 8, 568446438, -1019803690, -187363961, 1163531501);
        proc(13, 2, 7, 12, -1444681467, -51403784, 1735328473, -1926607734);

        procIndex = 2;
        proc(5, 8, 11, 14, -378558, -2022574463, 1839030562, -35309556);
        proc(1, 4, 7, 10, -1530992060, 1272893353, -155497632, -1094730640);
        proc(13, 0, 3, 6, 681279174, -358537222, -722521979, 76029189);
        proc(9, 12, 15, 2, -640364487, -421815835, 530742520, -995338651);

        procIndex = 3;
        proc(0, 7, 14, 5, -198630844, 1126891415, -1416354905, -57434055);
        proc(12, 3, 10, 1, 1700485571, -1894986606, -1051523, -2054922799);
        proc(8, 15, 6, 13, 1873313359, -30611744, -1560198380, 1309151649);
        proc(4, 11, 2, 9, -145523070, -1120210379, 718787259, -343485551);

        a = safeAdd(a, oldA);
        b = safeAdd(b, oldB);
        c = safeAdd(c, oldC);
        d = safeAdd(d, oldD);
    }
    return [a, b, c, d];
};
