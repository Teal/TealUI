/**
 * @fileOverview 数字扩展。
 * @author xuld
 */

// #region @Number.isNumber

/**
 * 判断一个对象是否是数字。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果是数字则返回 @true，否则返回 @false。
 * @example Number.isNumber(7) // true
 */
Number.isNumber = function (obj) {
    return typeof obj === 'number' && !isNaN(obj);
}

// #endregion

// #region @Number.limit

/**
 * 确保指定数值在指定区间内。
 * @param {Number} num 要判断的值。
 * @param {Number} min 允许的最小值。
 * @param {Number} max 允许的最大值。
 * @returns {Number} 如果 @num 超过 @min 和 @max，则返回临界值，否则返回 @num。
 * @example Number.limit(1, 2, 6) // 2
 */
Number.limit = function (num, min, max) {
    return Math.min(max, Math.max(min, num));
};

// #endregion

// #region @Number.random

/**
 * 返回指定范围的随机整数值。
 * @param {Number} min 最小的整数值。
 * @param {Number} max 最大的整数值。
 * @returns {Number} 返回结果值。其值满足 @min <= 返回值 < @max。
 * @example Number.random(2, 6)
 */
Number.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// #endregion
