// #require ./indexOf
/**
 * 删除当前数组中的重复项。
 * @returns 返回过滤后的新数组。
 * @example [1, 9, 9, 0].unique() // 返回 [1, 9, 0]
 */
Array.prototype.unique = function () {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        if (this.indexOf(this[i], i + 1) < 0) {
            result.push(this[i]);
        }
    }
    return result;
};
