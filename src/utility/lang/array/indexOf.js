/*@cc_on if(!+"\v1") {

/// 获取指定项在数组内的索引。
/// @param {Object} value 一个类数组对象。
/// @param {Number} [startIndex=0] 转换开始的位置。
/// @returns {Number} 返回索引。如果找不到则返回 -1。
/// @example ["b", "c", "a", "a"].indexOf("a"); // 2
/// @since ES4
Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
    startIndex = startIndex || 0;
    for (var len = this.length; startIndex < len; startIndex++) {
        if (this[startIndex] === value) {
            return startIndex;
        }
    }
    return -1;
};

} @*/
