/**
 * 将多维数组合并为一维数组。
 * @returns {Array} 返回新数组。
 * @example [[1, 2], [[[3]]]].flatten() // [1, 2, 3]
 */
Array.prototype.flatten = function () {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        this[i] && this[i].flatten ? result.push.apply(result, this[i].flatten()) : result.push(this[i]);
    }
    return result;
};
