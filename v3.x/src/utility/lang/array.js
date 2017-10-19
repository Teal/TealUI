/**
 * @fileOverview 数组扩展。
 * @author xuld
 */

// #region @Array#lastIndexOf

if (!Array.prototype.lastIndexOf) {

    /**
     * 获取指定项在数组内的最后一个索引。
     * @param {Object} value 一个类数组对象。
     * @param {Number} [startIndex=0] 转换开始的位置。
     * @returns {Number} 返回索引。如果找不到则返回 -1。
     * @example ["b", "c", "a", "a"].lastIndexOf("a"); // 3
     * @since ES4
     */
    Array.prototype.lastIndexOf = function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var i = this.length - 1; i >= startIndex; i--) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };

}

// #endregion

// #region @Array#remove

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

// #endregion

// #region @Array#unique

/**
 * 删除当前数组中的重复项。
 * @returns {Array} 返回过滤后的新数组。
 * @example [1, 9, 9, 0].unique() // 返回 [1, 9, 0]
 */
Array.prototype.unique = function () {
    //var result = [], i;
    //for (i = 0; i < this.length; i++)
    //    arr.indexOf(this[i], i + 1) < 0 && result.push(this[i]);
    //return result;
    return this.filter(function (item, index, arr) {
        return arr.indexOf(item, index + 1) < 0;
    });
};

// #endregion
