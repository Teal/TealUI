/**
 * @fileOverview 扩展 Object 相关的 API。
 */

// #region @Object.assign

/**
 * 复制对象的所有属性到其它对象。
 * @param {Object} target 复制的目标对象。
 * @param {Object} source 复制的源对象。
 * @returns {Object} 返回 *target*。
 * @example <pre>
 * var a = {v: 3}, b = {g: 2};
 * Object.assign(a, b);
 * console.log(a); // {v: 3, g: 2}
 * </pre>
 */
Object.assign = Object.assign || function (target, source) {
    // ECMA 6 内置此函数，但是功能更丰富。
    for (var key in source)
        target[key] = source[key];
    return target;
};

// #endregion

// #region @Object.each

/**
 * 遍历一个数组或对象，并对每个元素执行函数 *fn*。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * 可以让函数返回 **false** 来强制中止循环。
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @returns {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
 * @see Array#forEach
 * @example
 * <pre>
 * Object.each({a: '1', c: '3'}, function (value, key) {
 * 		console.log(key + ' : ' + value);
 * });
 * // 输出 'a : 1' 'c : 3'
 * </pre>
 */
Object.each = function (iterable, fn, scope) {

    var length, i;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable && (length = iterable.length) != null && length.constructor === Number) {
        for (i = 0; i < length; i++)
            if (fn.call(scope, iterable[i], i, iterable) === false)
                return false;
    } else {
        for (i in iterable)
            if (fn.call(scope, iterable[i], i, iterable) === false)
                return false;
    }

    // 正常结束返回 true。
    return true;
};

// #endregion
