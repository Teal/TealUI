/**
 * @author xuld
 */

/**
 * 提供大整数计算相关函数。
 */
var BigInt = {

    /**
	 * 计算大正整数的和。
	 * @param {String} x 计算的左值。
	 * @param {String} y 计算的左值。
	 * @returns {String} 返回计算的结果。
	 * @example BigInt.add("1", "2") // "3"
	 */
    add: function (x, y) {
        var m = x.split('').reverse();
        var n = y.split('').reverse();
        var ret = [];
        var s = 0;

        for (var i = 0; i < x.length || i < y.length; i++) {
            var t = (m[i] | 0) + (n[i] | 0) + s;

            ret.push(t % 10);
            s = (t / 10) | 0;
        }
        if (s) {
            ret.push(s);
        }
        return ret.reverse().join('');
    },

    // #region @BigInt.mul

	/**
	 * 计算大正整数的积。
	 * @param {String} x 计算的左值。
	 * @param {String} y 计算的左值。
	 * @returns {String} 返回计算的结果。
	 * @example BigInt.mul("1", "2") // "2"
	 */
    mul: function (x, y) {
		var p = x.match(/\d{1,4}/g).reverse(),
			q = y.match(/\d{1,4}/g).reverse(),
			f1 = 0;
		result = "0";

		for (var i = 0; i < p.length; i++) {
			var f2 = 0;
			for (var j = 0; j < q.length; j++) {
				var t = (p[i] | 0) * (q[j] | 0);
				t += new Array(f1 + f2 + 1).join("0");
				result = BigInt.add(result, t);
				f2 += q[j].length;
			}
			f1 += p[i].length;
		}
		return result;

	},

    // #region @BigInt.pow

    /**
	 * 计算大正整数的幂。
	 * @param {String} x 计算的左值。
	 * @param {String} y 计算的左值。
	 * @returns {String} 返回计算的结果。
	 * @example BigInt.pow("1", "2") // "1"
	 */
	pow: function (x, y) {
		var ret = "1";
		for (var i = 0; i < y; i++) {
		    ret = BigInt.mul(ret, x);
		}
		return ret;
	}

    // #endregion

    // #endregion

};
