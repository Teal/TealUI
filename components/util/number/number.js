define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 判断对象是否是数字。
     * @param obj 要判断的对象。
     * @return 如果是数字则返回 true，否则返回 false。
     * @example isNumber(7) // true
     */
    function isNumber(obj) {
        return typeof obj === "number" && !isNaN(obj);
    }
    exports.isNumber = isNumber;
    /**
     * 判断数字是否是整数。
     * @param num 要判断的数字。
     * @return 如果是整数则返回 true，否则返回 false。
     * @example isInteger(7) // true
     */
    function isInteger(num) {
        return Math.floor(num) === num;
    }
    exports.isInteger = isInteger;
    /**
     * 保留指定小数位数四舍五入。
     * @param num 数字。
     * @param precision 保留的小数位数。
     * @return 返回结果值。
     * @example round(1.25, 1) // 1.3
     */
    function round(num, precision) {
        if (precision === void 0) { precision = 0; }
        if (precision) {
            precision = Math.pow(10, precision);
            return Math.round(num * precision) / precision;
        }
        return Math.round(num);
    }
    exports.round = round;
    /**
     * 计算不小于指定数的最小值（天花板数）。
     * @param num 数字。
     * @param precision 保留的小数位数。
     * @return 返回结果值。
     * @example ceil(1.25, 1) // 1.3
     */
    function ceil(num, precision) {
        if (precision === void 0) { precision = 0; }
        if (precision) {
            precision = Math.pow(10, precision);
            return Math.ceil(num * precision) / precision;
        }
        return Math.ceil(num);
    }
    exports.ceil = ceil;
    /**
     * 计算不大于指定数的最大值（地板数）。
     * @param num 数字。
     * @param precision 保留的小数位数。
     * @return 返回结果值。
     * @example floor(1.25, 1) // 1.2
     */
    function floor(num, precision) {
        if (precision === void 0) { precision = 0; }
        if (precision) {
            precision = Math.pow(10, precision);
            return Math.floor(num * precision) / precision;
        }
        return Math.floor(num);
    }
    exports.floor = floor;
    /**
     * 确保指定数值在指定区间内。
     * @param num 数字。
     * @param min 允许的最小值（含）。
     * @param max 允许的最大值（含）。
     * @return 如果数字小于最小值，则返回最小值，如果数字大于最大值，则返回最大值，否则返回数值本身。
     * @example limit(1, 2, 6) // 2
     */
    function limit(num, min, max) {
        return Math.min(max, Math.max(min, num));
    }
    exports.limit = limit;
    /**
     * 返回指定范围内的随机整数值。
     * @param min 最小的整数值（含）。
     * @param max 最大的整数值（不含）。
     * @return 返回一个整数。
     * @example random(2, 6)
     */
    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    exports.random = random;
    /**
     * 获取数字的小数位数。
     * @param num 数字。
     * @return 返回小数位数。
     * @example getPrecision(0) // 0
     * @example getPrecision(0.1) // 1
     * @example getPrecision(0.01) // 2
     */
    function getPrecision(num) {
        var s = num + "";
        var d = s.indexOf(".") + 1;
        return !d ? 0 : s.length - d;
    }
    exports.getPrecision = getPrecision;
    /**
     * 获取数字的整数位数。
     * @param num 数字。
     * @return 返回整数位数。
     * @example getIntegerLength(0) // 1
     * @example getIntegerLength(100) // 3
     */
    function getIntegerLength(num) {
        return num === 0 ? 1 : Math.floor(Math.log(num) / Math.log(10)) + 1;
    }
    exports.getIntegerLength = getIntegerLength;
    /**
     * 格式化数字为字符串。
     * @param num 数字。
     * @param format 格式字符串。其中以下字符会被替换：
     *
     * 元字符 | 意义      | 示例
     * ------|-----------|--------------------
     * 0     | 补0       | 000:012, 0.00: 2.00
     * #     | 补空      | ###:12, 0.##: 2
     * +     | 补正负号  | +0: +0
     * .     | 小数点    | 0.00: 0.00
     * ,     | 追加逗号  | 0.00: 0.00
     *
     * @return 返回格式化后的字符串。
     * @example format(1, "000.00") // 001.00
     * @example format(1.2, "0.00") // 1.20
     * @example format(1.2, "#.##") // 1.2
     * @example format(1.235, "#.##") // 1.24
     * @example format(1235, "###,###") // 1,235
     */
    function format(num, format) {
        if (!format) {
            return num.toString();
        }
        return format.replace(/(\+)?([0#,]+|(?=\.))(\.[0#]*)?/, function (all, sign, integerDights, fractionDights) {
            // 处理符号位。
            if (num < 0) {
                sign = "-";
                num = -num;
            }
            else {
                sign = sign || "";
            }
            // 格式化数字。
            var numString = fractionDights ? num.toFixed(fractionDights.length - 1) : num.toString();
            var dot = numString.indexOf(".");
            var fractionPart = dot < 0 ? "" : numString.slice(dot);
            var integerPart = dot < 0 ? numString : numString.slice(0, dot);
            // 处理小数部分。
            if (fractionDights) {
                for (var i = fractionDights.length - 1; i > 0; i--) {
                    if (fractionDights.charAt(i) === "#" && fractionPart.charAt(i) === "0") {
                        fractionPart = fractionPart.slice(0, -1);
                    }
                    else {
                        break;
                    }
                }
                if (fractionPart.length === 1) {
                    fractionPart = "";
                }
            }
            // 处理整数部分。
            if (integerDights) {
                var comma = integerDights.lastIndexOf(",");
                if (comma >= 0) {
                    comma = integerDights.length - comma - 1;
                    integerDights = integerDights.replace(/,/g, "");
                }
                while (integerPart.length < integerDights.length) {
                    var char = integerDights.charAt(integerDights.length - integerPart.length - 1);
                    if (char === "#") {
                        break;
                    }
                    integerPart = char + integerPart;
                }
                if (comma > 0) {
                    for (var i = integerPart.length - comma; i > 0; i -= comma) {
                        integerPart = integerPart.slice(0, i) + "," + integerPart.slice(i);
                    }
                }
            }
            else {
                integerPart = "";
            }
            return sign + integerPart + fractionPart;
        });
    }
    exports.format = format;
});
//# sourceMappingURL=number.js.map