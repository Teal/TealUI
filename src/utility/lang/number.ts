/**
 * @fileOverview 数字(Number)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 Number 的扩展 API。
 * @namespace Number
 */

/**
 * 判断一个对象是否是数字。
 * @param obj 要判断的对象。
 * @returns 如果是数字则返回 @true，否则返回 @false。
 * @example Number.isNumber(7) // true
 */
export function isNumber(obj: any) {
    return typeof obj === 'number' && !isNaN(obj);
}

/**
 * 确保指定数值在指定区间内。
 * @param num 要判断的值。
 * @param min 允许的最小值。
 * @param max 允许的最大值。
 * @returns 如果 *num* 超过 *min* 和 *max*，则返回临界值，否则返回 *num*。
 * @example Number.limit(1, 2, 6) // 2
 */
export function limit(num: number, min: number, max: number) {
    return Math.min(max, Math.max(min, num));
}

/**
 * 返回指定范围的随机整数值。
 * @param min 最小的整数值。
 * @param max 最大的整数值。
 * @returns 返回结果值。其值满足 *min* <= 返回值 < *max*。
 * @example Number.random(2, 6)
 */
export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** 
 * 格式化当前数字为字符串。
 * @param format 格式字符串。具体见下文。
 * @returns 返回格式化后的字符串。
 * @remark
 * #### 格式化语法
 * 格式字符串中的元字符会被替换，支持的元字符有：
 * 
 * 元字符 | 意义      | 实例
 * ------|-----------|--------------------
 * 0     | 补0       | 000:012, 0.00: 2.00
 * \#    | 补空      | \#\#\#:12, 0.\#\#: 2
 * +     | 补正负号  | +0: +0
 * .     | 小数点    | 0.00: 0.00
 * ,     | 追加逗号  | 0.00: 0.00
 * 
 * @example 1..format("000.00") // 001.00
 * @example 1.2.format("0.00") // 1.20
 * @example 1.2.format("#.##") // 1.2
 * @example 1.235.format("#.##") // 1.24
 * @example 1235..format("###,###") // 1,235
 */
export function format(_this: number, format: string) {
    if (!format) {
        return _this.toString();
    }

    let result = splitPart(format);

    // 处理逗号。
    let comma = result[0].lastIndexOf(',');
    if (comma >= 0) {
        comma = result[0].length - comma - 1;
        result[0] = result[0].replace(/,/g, "");
    }

    let val = _this < 0 ? -_this : _this;
    let match: string[];

    // 处理小数部分。
    result[1] = result[1].replace(/^(0*)(#*)/, (all: string, zero: string, sharp: string) => {
        match = splitPart(val.toFixed(all.length));
        all = match[1];

        // 删除 #。
        return sharp ? all.substr(0, zero.length) + all.substr(zero.length).replace(/0+$/, '') : all;
    });

    // 处理整数部分。
    result[0] = result[0].replace(/(\+?)(#*)(0*)$/, (all: string, plus: string, sharp: string, zero: string) => {

        // 前缀补 0。
        if (match[0].length < zero.length) {
            match[0] = new Array(zero.length - match[0].length + 1).join('0') + match[0];
        }

        // 追加 ,。
        if (comma > 0) {
            // 给 match[0] 的所有数字追加逗号。
            let allParts = match[0].split('').reverse();
            for (var i = comma; i < all.length; i += comma) {
                allParts.splice(i++, 0, ',');
            }
            match[0] = allParts.reverse().join('');
        }

        // 追加正负号。
        return (_this < 0 ? '-' : (plus ? '+' : '')) + match[0];

    });

    return result[0] + (result[1] ? '.' + result[1] : result[1]);

    function splitPart(value: string) {
        const p = value.indexOf('.');
        return [p < 0 ? value : value.substr(0, p), p < 0 ? '' : value.substr(p + 1)];
    }

}

/**
 * 获取当前数字的精度。
 * @returns 返回精度。
 */
export function getPrecision(_this: number) {
    const s = _this + "";
    const d = s.indexOf('.') + 1;
    return !d ? 0 : s.length - d;
}
