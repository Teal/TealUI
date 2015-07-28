/**
 * @author xuld
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
    },

    /**
	 * 将货币转为中文大写金额。
	 * @param {Number} val 要处理的值。
	 * @returns {String} 返回格式化后的字符串。
	 * @example Currency.format(10000000) // "壹千万元整"
	 */
    toChinese: function (val) {

        var digits = '零壹贰叁肆伍陆柒捌玖',
            units0 = '元万亿',
            units1 = ['', '拾', '佰', '仟'],
            neg = val < 0,
            s = '',
            t;

        val = Math.abs(val);

        // 零。
        if (val < 0.005) {
            return '零元整';
        }

        // 得到小数点后两位。
        t = Math.round(val * 100) % 100;
        s += t ? (t >= 10 ? digits.charAt(Math.floor(t / 10)) + '角' : '') + (t % 10 ? digits.charAt(t % 10) + '分' : '') : '整';

        // 得到整数位。
        t = Math.floor(val);
        for (var i = 0; i < units0.length && t > 0; i++) {
            var p = '';
            for (var j = 0; j < units1.length && t > 0; j++) {
                p = digits.charAt(t % 10) + units1[j] + p;
                t = Math.floor(t / 10);
            }
            s = (p.replace(/(零.)*零$/, '') || '零') + units0.charAt(i) + s;
        }

        return (neg ? '负' : '') + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零');
    }

};
