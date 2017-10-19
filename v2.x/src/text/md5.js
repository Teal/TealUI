/**
 * @author xuld
 */

/**
 * 计算一个字符串的 MD5值。
 * @param {String} s 字符串。
 * @return {String} md5 字符串。
 */
var md5 = (function () {

	function md5(s) {
		return md5.binl2hex(md5.md5c(md5.str2binl(s), s.length * charSize));
	}

	var hexcase = false;
	var charSize = 8;

	/**
	 * @param {Boolean} hexcase 输出格式， false - 小写，  true - 大写。
	 *  @param {Number} 字符宽。 8 - ASIIC 或 16 - UNICODE
	 */

	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",

		fns = [function (b, c, d) {
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
		}],

		pss = [
			[7, 12, 17, 22],
			[5, 9, 14, 20],
			[4, 11, 16, 23],
			[6, 10, 15, 21],
		];

	/**
     * 内部计算。
     */
	function md5_cmn(q, a, b, x, s, t) {
		var num = safe_add(safe_add(a, q), safe_add(x, t));
		return safe_add((num << s) | (num >>> (32 - s)), b);
	}

	/**
     * 安全的计算参数的和。
     */
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF);
	}

    /**
     * 转换字符串到二进制。
     * 如果字符大于 255 ， 高位被截掉。
     */
	md5.str2binl = function (str) {
	    var bin = Array(), chrsz = charSize;
	    var mask = (1 << chrsz) - 1;
	    for (var i = 0; i < str.length * chrsz; i += chrsz)
	        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
	    return bin;
	};

    /**
     * 计算一个数组的 MD5 值。
     */
	md5.md5c = function (x, len) {

	    // 靠齐字符串
	    x[len >> 5] |= 0x80 << ((len) % 32);
	    x[(((len + 64) >>> 9) << 4) + 14] = len;

	    var a = 1732584193,
       		b = -271733879,
        	c = -1732584194,
        	d = 271733878,
			i = 0,
			j = 0;

	    function p(j0, j1, j2, j3, ts0, ts1, ts2, ts3) {
	        var fn = fns[j], ps = pss[j];
	        a = md5_cmn(fn(b, c, d), a, b, x[i + j0], ps[0], ts0);
	        d = md5_cmn(fn(a, b, c), d, a, x[i + j1], ps[1], ts1);
	        c = md5_cmn(fn(d, a, b), c, d, x[i + j2], ps[2], ts2);
	        b = md5_cmn(fn(c, d, a), b, c, x[i + j3], ps[3], ts3);
	    }

	    for (; i < x.length; i += 16) {
	        var olda = a,
           		oldb = b,
            	oldc = c,
            	oldd = d;

	        j = 0;
	        p(0, 1, 2, 3, -680876936, -389564586, 606105819, -1044525330);
	        p(4, 5, 6, 7, -176418897, 1200080426, -1473231341, -45705983);
	        p(8, 9, 10, 11, 1770035416, -1958414417, -42063, -1990404162);
	        p(12, 13, 14, 15, 1804603682, -40341101, -1502002290, 1236535329);

	        j = 1;
	        p(1, 6, 11, 0, -165796510, -1069501632, 643717713, -373897302);
	        p(5, 10, 15, 4, -701558691, 38016083, -660478335, -405537848);
	        p(9, 14, 3, 8, 568446438, -1019803690, -187363961, 1163531501);
	        p(13, 2, 7, 12, -1444681467, -51403784, 1735328473, -1926607734);

	        j = 2;
	        p(5, 8, 11, 14, -378558, -2022574463, 1839030562, -35309556);
	        p(1, 4, 7, 10, -1530992060, 1272893353, -155497632, -1094730640);
	        p(13, 0, 3, 6, 681279174, -358537222, -722521979, 76029189);
	        p(9, 12, 15, 2, -640364487, -421815835, 530742520, -995338651);

	        j = 3;
	        p(0, 7, 14, 5, -198630844, 1126891415, -1416354905, -57434055);
	        p(12, 3, 10, 1, 1700485571, -1894986606, -1051523, -2054922799);
	        p(8, 15, 6, 13, 1873313359, -30611744, -1560198380, 1309151649);
	        p(4, 11, 2, 9, -145523070, -1120210379, 718787259, -343485551);

	        a = safe_add(a, olda);
	        b = safe_add(b, oldb);
	        c = safe_add(c, oldc);
	        d = safe_add(d, oldd);
	    }
	    return [a, b, c, d];

	};

    /**
     * 转换数组到十六进的字符串。
     * @param {Array} 二进制数组。
     * @return {String} 字符串。
     */
	md5.binl2hex = function (binarray) {
	    var str = "";
	    for (var i = 0; i < binarray.length * 4; i++) {
	        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
            hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
	    }
	    return str;
	};

	return md5;

})();

