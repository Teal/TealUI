
/**
 * 计算数组中所有数值的和。
 * @returns {Number} 返回数组中所有数值的和。
 * @example [1, 2].sum() // 3
 */
Array.prototype.sum = function () {
    var result = 0, i = this.length;
    while (--i >= 0) {
        result += +this[i] || 0;
    }
    return result;
};
