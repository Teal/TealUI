/**
 * 判断一个对象是否是数字。
 * @param obj 要判断的对象。
 * @return 如果是数字则返回 true，否则返回 false。
 * @example isNumber(7) // true
 */
export function isNumber(obj: any) {
    return typeof obj === "number" && !isNaN(obj);
}

/**
 * 判断一个数字是否是整数。
 * @param num 要判断的数字。
 * @return 如果是整数则返回 true，否则返回 false。
 * @example isInteger(7) // true
 */
export function isInteger(num: number) {
    return Math.floor(num) === num;
}

/**
 * 确保指定数值在指定区间内。
 * @param num 要判断的值。
 * @param min 允许的最小值。
 * @param max 允许的最大值。
 * @return 如果 *num* 超过 *min* 和 *max*，则返回临界值，否则返回 *num*。
 * @example limit(1, 2, 6) // 2
 */
export function limit(num: number, min: number, max: number) {
    return Math.min(max, Math.max(min, num));
}

/**
 * 返回指定范围的随机整数值。
 * @param min 最小的整数值。
 * @param max 最大的整数值。
 * @return 返回结果值。其值满足 *min* <= 返回值 < *max*。
 * @example random(2, 6)
 */
export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 获取数字的小数位数。
 * @return 返回小数位数。。
 * @example getPrecision(0) // 0
 * @example getPrecision(0.1) // 1
 * @example getPrecision(0.01) // 2
 */
export function getPrecision(num: number) {
    const s = num + "";
    const d = s.indexOf(".") + 1;
    return !d ? 0 : s.length - d;
}

/**
 * 获取数字的整数位数。
 * @return 返回整数位数。
 * @example getIntegerLength(0) // 1
 * @example getIntegerLength(100) // 3
 */
export function getIntegerLength(num: number) {
    return num === 0 ? 1 : Math.floor(Math.log(num) / Math.log(10)) + 1;
}

/**
 * 格式化数字为字符串。
 * @param format 格式字符串。
 * 格式字符串中的元字符会被替换，支持的元字符有：
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
export function format(num: number, format?: string) {
    if (!format) {
        return num.toString();
    }

    return format.replace(/(\+)?([0#,]+|(?=\.))(\.[0#]*)?/, (all, sign?: string, integerDights?: string, fractionDights?: string) => {

        // 处理符号位。
        if (num < 0) {
            sign = "-";
            num = -num;
        } else {
            sign = sign || "";
        }

        // 格式化数字。
        const numString = fractionDights ? num.toFixed(fractionDights.length - 1) : num.toString();
        const dot = numString.indexOf(".");
        let fractionPart = dot < 0 ? "" : numString.slice(dot);
        let integerPart = dot < 0 ? numString : numString.slice(0, dot);

        // 处理小数部分。
        if (fractionDights) {
            for (let i = fractionDights.length - 1; i > 0; i--) {
                if (fractionDights.charAt(i) === "#" && fractionPart.charAt(i) === "0") {
                    fractionPart = fractionPart.slice(0, -1);
                } else {
                    break;
                }
            }
            if (fractionPart.length === 1) {
                fractionPart = "";
            }
        }

        // 处理整数部分。
        if (integerDights) {
            let comma = integerDights.lastIndexOf(",");
            if (comma >= 0) {
                comma = integerDights.length - comma - 1;
                integerDights = integerDights.replace(/,/g, "");
            }
            while (integerPart.length < integerDights.length) {
                const char = integerDights.charAt(integerDights.length - integerPart.length - 1);
                if (char === "#") {
                    break;
                }
                integerPart = char + integerPart;
            }
            if (comma > 0) {
                for (let i = integerPart.length - comma; i > 0; i -= comma) {
                    integerPart = integerPart.slice(0, i) + "," + integerPart.slice(i);
                }
            }
        } else {
            integerPart = "";
        }

        return sign + integerPart + fractionPart;
    });
}
