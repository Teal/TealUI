/**
 * @author xuld
 */

/**
 * 提供大正整数计算相关函数。
 */
var BigNumber = {

    /**
	 * 计算大数的和。
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

	/**
	 * 计算大数的积。
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
				result = BigInteger.add(result, t);
				f2 += q[j].length;
			}
			f1 += p[i].length;
		}
		return result;

	},

    /**
	 * 计算大数的幂。
	 */
	pow: function (x, y) {
		var ret = "1";
		for (var i = 0; i < y; i++) {
		    ret = BigInteger.mul(ret, x);
		}
		return ret;
	}

};
