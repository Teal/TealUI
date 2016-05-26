
/**
 * 对当前数组每一项进行处理，并将结果组成一个新数组。
 * @param {Function} fn 用于处理每一项的函数。函数的参数依次为:
 *
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Object} 返回处理后的新值，这些新值将组成结构数组。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Object} 返回一个新数组或对象。
 * @example [1, 9, 9, 0].map(function(item){return item + 1}); // [2, 10, 10, 1]
 * @since ES5
 */
Array.prototype.map = Array.prototype.map || function (fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "array.map(fn: 必须是函数, [scope])");
    var result = [];
    for (var i = 0, length = this.length; i < length; i++) {
        if (i in this) {
            result[i] = fn.call(scope, this[i], i, this);
        }
    }
    return result;
};
