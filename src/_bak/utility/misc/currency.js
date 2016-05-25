/**
 * @fileOverview 直接使用 JS 进行计算会产生误差，本组件提供了精确计算货币的功能。
 * @author xuld@vip.qq.com
 */

/**
 * 提供货币计算相关函数。
 * @remark 本类型支持的最大货币范围为：10,000,000,000,000.00
 */
var Currency = {

    /**
	 * 精确计算两个货币的和。
	 * @param {Number} x 计算的左值。
	 * @param {Number} y 计算的左值。
	 * @returns {Number} 返回计算的结果。
	 * @example Currency.add(86.24, .1)
	 */
    add: function (x, y) {
        var m = Math.pow(10, Math.max(x.toString().replace(/^\d+(\.|$)/, "").length, y.toString().replace(/^\d+(\.|$)/, "").length) + 1);
        return (x * m + y * m) / m;
    },

    /**
	 * 精确计算两个货币的差。
	 * @param {Number} x 计算的左值。
	 * @param {Number} y 计算的左值。
	 * @returns {Number} 返回计算的结果。
	 * @example Currency.sub(86.24, .1)
	 */
    sub: function (x, y) {
        var m = Math.pow(10, Math.max(x.toString().replace(/^\d+(\.|$)/, "").length, y.toString().replace(/^\d+(\.|$)/, "").length) + 1);
        return (x * m - y * m) / m;
    },

    /**
	 * 精确计算两个货币的积。
	 * @param {Number} x 计算的左值。
	 * @param {Number} y 计算的左值。
	 * @returns {Number} 返回计算的结果。
	 * @example Currency.mul(7, 0.8)
	 */
    mul: function (x, y) {
        x = x.toString();
        y = y.toString();
        return parseInt(x.replace(".", "")) * parseInt(y.replace(".", "")) / Math.pow(10, x.replace(/^\d+(\.|$)/, "").length + y.replace(/^\d+(\.|$)/, "").length + 1) / 10;
    },

    /**
	 * 精确计算两个货币的商。
	 * @param {Number} x 计算的左值。
	 * @param {Number} y 计算的左值。
	 * @returns {Number} 返回计算的结果。
	 * @example Currency.div(86.24, .1)
	 */
    div: function (x, y) {
        x = x.toString();
        y = y.toString();
        return (parseInt(x.replace(".", "")) / parseInt(y.replace(".", ""))) * Math.pow(10, y.replace(/^\d+(\.|$)/, "").length - x.replace(/^\d+(\.|$)/, "").length + 1) / 10;
    },

    /**
	 * 保留小数点后两位四舍五入。
	 * @param {Number} val 要处理的值。
	 * @returns {Number} 返回计算的结果。
	 * @example Currency.round(86.245) // 86.25
	 */
    round: function (val) {
        return Math.round(val * 100) / 100;
    },

    /**
	 * 将指定的货币格式化为字符串。
	 * @param {Number} val 要处理的值。
	 * @returns {String} 返回格式化后的字符串。字符串保留两位小数，整数部分每 3 位包含一个逗号分隔符。
	 * @example Currency.format(86234.245) // "86,234.25"
	 */
    format: function (val) {
        var t = Math.round(Math.abs(val) * 100),
            result = Math.floor(val) + '',
            c = (result.length - 1) % 3 + (val < 0 ? 2 : 1);

        return result.substr(0, c) + result.substr(c).replace(/(\d{3})/g, ',$1') + '.' + Math.floor(t / 10) % 10 + t % 10;
    }

};
