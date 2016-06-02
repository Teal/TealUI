// #todo


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
