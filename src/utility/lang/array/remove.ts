// #todo


interface Array<T> {

}

/**
 * 删除当前数组中匹配的第一个项。
 * @param {Object} value 要删除的项。
 * @param {Number} [startIndex=0] 开始搜索 @value 的起始位置。
 * @returns {Number} 返回被删除的项在原数组中的位置。如果数组中找不到指定的项，则返回 -1。
 * @remark 
 * > #### !一次只删除一个
 * > 如果数组中有多个相同的项，remove 只删除第一个。
 * @example
 * [1, 9, 9, 0].remove(9); // 返回 1,  数组变成 [1, 9, 0]
 *
 * ##### 删除数组全部相同项
 * var arr = ["wow", "wow", "TealUI", "is", "powerful", "wow", "wow"];
 * // 反复调用 remove， 直到 remove 返回 -1， 即找不到值 wow
 * while(arr.remove("wow") >= 0);
 * console.log(arr); // 输出 ["TealUI", "is", "powerful"]
 */
Array.prototype.remove = function (value, startIndex) {
    startIndex = this.indexOf(value, startIndex);
    ~startIndex && this.splice(startIndex, 1);
    return startIndex;
};
