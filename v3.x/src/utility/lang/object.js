/**
 * @fileOverview 扩展 Object 相关的 API。
 * @author xuld
 */

// #region @Object.assign

if (!Object.assign) {

    /**
     * 复制对象的所有属性到其它对象。
     * @param {Object} target 复制的目标对象。
     * @param {Object} source 复制的源对象。
     * @returns {Object} 返回 @target。
     * @example
     * var a = {v: 3}, b = {g: 2};
     * Object.assign(a, b); // a 现在是 {v: 3, g: 2}
     * @since ES6
     */
    Object.assign = function (target, source) {
        typeof console === "object" && console.assert(target != null, "Object.assign(target: 不能为空, source)");
        // ECMA 6 内置此函数，但是功能更丰富。
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    };

}

// #endregion

// #region @Object.each

/**
 * 遍历一个对象或数组，并对每一项执行函数 @fn。
 * @param {Object} iterable 要遍历的数组或对象（函数除外）。
 * @param {Function} fn 对每一项执行的函数。函数的参数依次为:
 *
 * * @param {Object} value 当前项的值。
 * * @param {Number} index 当前项的索引。
 * * @param {Array} array 当前正在遍历的数组。
 * * @returns {Boolean} 如果返回 @false，则终止循环。
 * 
 * @param {Object} [scope] 定义 @fn 执行时 @this 的值。
 * @returns {Boolean} 如果循环是因为 @fn 返回 @false 而中止，则返回 @false，否则返回 @true。
 * @example
 * Object.each({a: '1', c: '3'}, function (value, key) {
 *      console.log(key + ' : ' + value);
 * }); // 输出 'a : 1' 'c : 3'
 * 
 * Object.each([1, 2, 3], function(item, index){
 *      console.log(index, "=>", item);
 * });
 */
Object.each = function (iterable, fn, scope) {
    typeof console === "object" && console.assert(fn instanceof Function, "Object.each(iterable, fn: 必须是函数, [scope])");

    var length;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable && (length = iterable.length) != null && length.constructor === Number) {
        for (var i = 0; i < length; i++) {
            if (fn.call(scope, iterable[i], i, iterable) === false) {
                return false;
            }
        }
    } else {
        for (var i in iterable) {
            if (fn.call(scope, iterable[i], i, iterable) === false) {
                return false;
            }
        }
    }

    return true;
};

// #endregion
