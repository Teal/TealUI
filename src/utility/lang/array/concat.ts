
/**
 * 合并当前数组和另一个数组并返回一个新数组。
 * @param {Array} array 要合并的数组。
 * @returns {Array} 返回新数组。
 * @example ["I", "love"].concat(["you"]); // ["I", "love", "you"]
 * @since ES4
 */
Array.prototype.concat = Array.prototype.concat || function (array) {
    var result = this.slice(0);
    result.push.apply(result, array);
    return result;
};
