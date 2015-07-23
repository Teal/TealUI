/**
 * @author xuld
 */

/**
 * 提供大数计算相关函数。
 */
var BigNumber = {

    /**
	 * 计算大数的和。
	 */
    add: function (x, y) {
        throw "此函数未完成";
    },

    /**
	 * 计算大数的差。
	 */
    sub: function (x, y) {
        throw "此函数未完成";
    },

	/**
	 * 计算大数的积。
	 */
    mul: function (x, y) {
        throw "此函数未完成";
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
