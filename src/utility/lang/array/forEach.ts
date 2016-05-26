
if (!Array.prototype.forEach) {

    /**
     * 遍历当前数组，并对每一项执行函数 @fn。
     * @param {Function} fn 对每一项执行的函数。函数的参数依次为:
     *
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * 
     * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
     * @example
     * [2, 5].forEach(function (value, index) {
     *      console.log(value);
     * }); // 输出 2  5
     * @since ES5
     */
    Array.prototype.forEach = function (fn, scope) {
        typeof console === "object" && console.assert(fn instanceof Function, "array.forEach(fn: 必须是函数, [scope])");
        for (var i = 0, length = this.length; i < length; i++) {
            fn.call(scope, this[i], i, this);
        }
    };

    /**
     * 将当前数组中符合要求的项组成一个新数组。
     * @param {Function} fn 用于判断每一项是否符合要求的函数。函数的参数依次为:
     * 
     * * @param {Object} value 当前项的值。
     * * @param {Number} index 当前项的索引。
     * * @param {Array} array 当前正在遍历的数组。
     * * @returns {Boolean} 返回 @true 说明当前元素符合条件，否则不符合。
     * 
     * @param {Object} [scope] 指定 @fn 执行时 @this 的值。
     * @returns {Array} 返回一个新数组。
     * @example [1, 2].filter(function(v){return v > 1;}) // [2]
     * @since ES5
     */
    Array.prototype.filter = function (fn, scope) {
        typeof console === "object" && console.assert(fn instanceof Function, "array.filter(fn: 必须是函数, [scope])");
        var results = [];
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                var value = this[i];
                if (fn.call(scope, value, i, this)) {
                    results.push(value);
                }
            }
        }
        return results;
    };

}
