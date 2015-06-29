
/**
 * 删除当前数组中指定的元素。
 * @param {Object} value 要删除的值。
 * @param {Number} startIndex=0 开始搜索 *value* 的起始位置。
 * @return {Number} 被删除的值在原数组中的位置。如果要擅长的值不存在，则返回 -1 。
 * @remark
 * 如果数组中有多个相同的值， remove 只删除第一个。
 * @example
 * <pre>
 * [1, 7, 8, 8].remove(8); // 返回 2,  数组变成 [1, 7, 8]
 * </pre>
 *
 * 以下示例演示了如何删除数组全部相同项。
 * <pre>
 * var arr = ["wow", "wow", "J+ UI", "is", "powerful", "wow", "wow"];
 *
 * // 反复调用 remove， 直到 remove 返回 -1， 即找不到值 wow
 * while(arr.remove("wow") >= 0);
 *
 * trace(arr); // 输出 ["J+ UI", "is", "powerful"]
 * </pre>
 */
Array.prototype.remove = function (value, /*Number?*/startIndex) {
    var index = this.indexOf(value, startIndex);
    if (index > 0)
        this.splice(index, 1);
    return index;
};

/**
 * 删除当前数组的重复元素。
 */
Array.prototype.unique = function () {
    return this.filter(function (item, index, arr) {
        return arr.indexOf(item, index + 1) < 0;
    });
};
