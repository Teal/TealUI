/**
 * 计算数组中所有项的最小值。
 * @returns {Number} 返回数组中所有项的最小值。
 * @example [1, 2].min() // 1
 */
Array.prototype.min = function () {
    return Math.min.apply(null, this);
};
