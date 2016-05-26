
/**
 * 判断数组中是否存在重复项。
 * @returns {Boolean} 若数组中存在重复值，则返回 @true，否则返回 @false。
 * @example 
 * [1, 9, 0].isUnique() // true
 * 
 * [1, 9, 9, 0].isUnique() // false
 */
Array.prototype.isUnique = function () {
    for (var i = 0; i < this.length - 1; i++) {
        if (~this.indexOf(this[i], i + 1)) {
            return false;
        }
    }
    return true;
};
