/**
 * @fileOverview 为整个库提供最基础的工具函数。
 */

/**
 * 复制对象的所有属性到其它对象。
 * @param {Object} dest 复制的目标对象。
 * @param {Object} src 复制的源对象。
 * @return {Object} 返回  *dest *。
 * @example <pre>
 * var a = {v: 3}, b = {g: 2};
 * Object.extend(a, b);
 * trace(a); // {v: 3, g: 2}
 * </pre>
 */
Object.extend = function (dest, src) {
    for (var key in src)
        dest[key] = src[key];
    return dest;
};

/**
 * 遍历一个类数组，并对每个元素执行函数 *fn*。
 * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
 *
 * - {Object} value 当前元素的值。
 * - {Number} index 当前元素的索引。
 * - {Array} array 当前正在遍历的数组。
 *
 * 可以让函数返回 **false** 来强制中止循环。
 * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
 * @return {Boolean} 如果循环是因为 *fn* 返回 **false** 而中止，则返回 **false**， 否则返回 **true**。
 * @see Array#forEach
 * @example
 * <pre>
 * Object.each({a: '1', c: '3'}, function (value, key) {
 * 		trace(key + ' : ' + value);
 * });
 * // 输出 'a : 1' 'c : 3'
 * </pre>
 */
Object.each = function (iterable, fn, scope) {

    var length;

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable && (length = iterable.length) != null && length.constructor === Number) {
        for (var i = 0; i < length; i++)
            if (fn.call(scope, iterable[i], i, iterable) === false)
                return false;
    } else {
        for (var key in iterable)
            if (fn.call(scope, iterable[key], key, iterable) === false)
                return false;
    }

    // 正常结束返回 true。
    return true;
};

/**
 * 格式化指定的字符串。
 * @param {String} formatString 要格式化的字符串。格式化的方式见备注。
 * @param {Object} ... 格式化参数。
 * @return {String} 格式化后的字符串。
 * @remark 
 * 
 * 格式化字符串中，使用 {0} {1} ... 等元字符来表示传递给 String.format 用于格式化的参数。
 * 如 String.format("{0} 年 {1} 月 {2} 日", 2012, 12, 32) 中， {0} 被替换成 2012，
 * {1} 被替换成 12 ，依次类推。
 * 
 * String.format 也支持使用一个 JSON来作为格式化参数。
 * 如 String.format("{year} 年 {month} 月 ", { year: 2012, month:12});
 * 若要使用这个功能，请确保 String.format 函数有且仅有 2个参数，且第二个参数是一个 Object。
 *
 * 格式化的字符串{}不允许包含空格。
 * 
 * 如果需要在格式化字符串中出现 { 和 }，请分别使用 {{ 和 }} 替代。
 * 不要出现{{{ 和 }}} 这样将获得不可预知的结果。
 * @memberOf String
 * @example <pre>
 * String.format("{0}转换", 1); //  "1转换"
 * String.format("{1}翻译",0,1); // "1翻译"
 * String.format("{a}翻译",{a:"也可以"}); // 也可以翻译
 * String.format("{{0}}不转换, {0}转换", 1); //  "{0}不转换1转换"
 * </pre>
 */
String.format = function (formatString) {
    var args = arguments;
    return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
        return argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0];
    }) : "";
};
