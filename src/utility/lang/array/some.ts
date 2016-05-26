
/**
 * 判断当前数组是否至少存在一项满足指定条件。
 * @param {Function} fn 用于判断每一项是否满足条件的回调。函数的参数依次为:
 * 
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Boolean} 如果至少存在一项满足条件返回 @true，否则返回 @false。
 * @example [1, 9, 9, 0].some(function(item){return item > 5}); // true
 * @since ES5
 */
Array.prototype.some = Array.prototype.some || function (fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "array.some(fn: 必须是函数, [scope])");
    for (var i = 0, length = this.length; i < length; i++) {
        if ((i in this) && fn.call(scope, this[i], i, this)) {
            return true;
        }
    }
    return false;
};
