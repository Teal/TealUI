
/**
 * 从当前数组中删除另一个数组的所有元素，返回剩下的元素组成的新数组。
 * @param {Array} array 被除去的元素数组。
 * @returns {Array} 返回新数组。
 * @example [1, 2].sub([1]) // [2]
 */
Array.prototype.sub = function (array) {
    typeof console === "object" && console.assert(array && array.indexOf, "array.sub(array: 必须是数组)");
    var result = this.slice(0), i;
    for (i = result.length - 1; i >= 0; i--) {
        if (array.indexOf(result[i]) < 0) {
            result.splice(i, 1);
        }
    }
    return result;
};
