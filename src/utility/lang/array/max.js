/**
 * 计算数组中所有项的最大值。
 * @returns {Number} 返回数组中所有项的最大值。
 * @example [1, 2].max() // 2
 */
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};
