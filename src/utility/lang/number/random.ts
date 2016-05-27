
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
