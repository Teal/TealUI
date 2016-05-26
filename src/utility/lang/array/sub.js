// #require ./indexOf
/**
 * 从当前数组中删除另一个数组的所有元素，返回剩下的元素组成的新数组。
 * @param other 被除去的元素数组。
 * @returns 返回新数组。
 * @example [1, 2].sub([1]) // [2]
 */
Array.prototype.sub = function (other) {
    var result = this.slice(0);
    for (var i = result.length - 1; i >= 0; i--) {
        if (other.indexOf(result[i]) < 0) {
            result.splice(i, 1);
        }
    }
    return result;
};
