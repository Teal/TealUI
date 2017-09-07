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
Object.each = function (iterable, /*Function*/fn, scope/*=window*/) {

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
String.format = function (/*String?*/formatString/*, ...*/) {
    var args = arguments;
    return formatString ? formatString.replace(/\{\{|\{(\w+)\}|\}\}/g, function (matched, argName) {
        return argName ? (matched = +argName + 1) ? args[matched] : args[1][argName] : matched[0];
    }) : "";
};

/**
 * 删除当前数组中指定的元素。
 * @param {Object} value 要删除的值。
 * @param {Number} startIndex=0 开始搜索 *value* 的起始位置。
 * @return {Number} 被删除的值在原数组中的位置。如果要擅长的值不存在，则返回 -1 。
 * @remark
 * 如果数组中有多个相同的值， remove 只删除第一个。
 * @example
 * <pre>
 * [1, 7, 8, 8].remove(8); // 返回 2,  数组变成 [1, 7, 8]
 * </pre>
 *
 * 以下示例演示了如何删除数组全部相同项。
 * <pre>
 * var arr = ["wow", "wow", "J+ UI", "is", "powerful", "wow", "wow"];
 *
 * // 反复调用 remove， 直到 remove 返回 -1， 即找不到值 wow
 * while(arr.remove("wow") >= 0);
 *
 * trace(arr); // 输出 ["J+ UI", "is", "powerful"]
 * </pre>
 */
Array.prototype.remove = function (value, /*Number?*/startIndex) {
    var index = this.indexOf(value, startIndex);
    if (index > 0)
        this.splice(index, 1);
    return index;
};

/**
 * 删除当前数组的重复元素。
 */
Array.prototype.unique = function () {
    return this.filter(function (item, index, arr) {
        return arr.indexOf(item, index + 1) < 0;
    });
};

/**
 * 表示一个空函数。
 */
Function.empty = function () { };

// #region 兼容老浏览器
// #if CompactMode

if (!Function.prototype.bind) {

    /**
     * 绑定函数作用域(**this**)。并返回一个新函数，这个函数内的 **this** 为指定的 *scope* 。
     * @param {Object} scope 要绑定的作用域的值。
     * @example
     * <pre>
     * var fn = function(){ trace(this);  };
     *
     * var fnProxy = fn.bind(0);
     *
     * fnProxy()  ; //  输出 0
     * </pre>
     */
    Function.prototype.bind = function (scope) {

        var me = this;

        // 返回对 scope 绑定。
        return function () {
            return me.apply(scope, arguments);
        }
    };

}

// IE6-8, FF2-4: 不支持 Array.isArray
if (!Array.isArray) {

    /**
     * 判断一个变量是否是数组。
     * @param {Object} obj 要判断的变量。
     * @return {Boolean} 如果是数组，返回 true， 否则返回 false。
     * @example
     * <pre>
     * Array.isArray([]); // true
     * Array.isArray(document.getElementsByTagName("div")); // false
     * Array.isArray(new Array); // true
     * </pre>
     */
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

}

// IE6-8: 不支持 Array.prototype.forEach
if (!Array.prototype.forEach) {

    /**
     * 遍历当前数组，并对数组的每个元素执行函数 *fn*。
     * @param {Function} fn 对每个元素运行的函数。函数的参数依次为:
     *
     * - {Object} value 当前元素的值。
     * - {Number} index 当前元素的索引。
     * - {Array} array 当前正在遍历的数组。
     *
     * 可以让函数返回 **false** 来强制中止循环。
     * @param {Object} [scope] 定义 *fn* 执行时 **this** 的值。
     * @see #each
     * @see Object.each
     * @see #filter
     * @see Object.map
     * @remark
     * 在高版本浏览器中，forEach 和 each 功能大致相同，但是 forEach 不支持通过 return false 中止循环。
     * 在低版本(IE8-)浏览器中， forEach 为 each 的别名。
     *
     * 目前除了 IE8-，主流浏览器都已内置此函数。
     * @example 以下示例演示了如何遍历数组，并输出每个元素的值。
     * <pre>
     * [2, 5].forEach(function (value, key) {
     * 		trace(value);
     * });
     * // 输出 '2' '5'
     * </pre>
     */
    Array.prototype.forEach = function (fn, scope) {
        return Object.each(this, fn, scope);
    };

    Array.prototype.filter = function(fn, scope) {
        var results = [];
        for (var value, i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                value = this[i];
                if (fn.call(scope, value, i, this)) {
                    results.push(value);
                }
            }
        }
        return results;
    };

}

if (!String.prototype.trim) {

    /**
     * 去除字符串的首尾空格。
     * @return {String} 处理后的字符串。
     * @remark 目前除了 IE8-，主流浏览器都已内置此函数。
     * @example
     * <pre>
     * "   g h   ".trim(); //  返回     "g h"
     * </pre>
     */
    String.prototype.trim = function () {
        return this.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, "");
    };

}

// IE6-8: 不支持 Array.prototype.indexOf
if (!Array.prototype.indexOf) {

    /**
     * 返回当前数组中某个值的第一个位置。
     * @param {Object} item 成员。
     * @param {Number} startIndex=0 开始查找的位置。
     * @return {Number} 返回 *vaue* 的索引，如果不存在指定的值， 则返回-1 。
     */
    Array.prototype.indexOf = function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var len = this.length; startIndex < len; startIndex++)
            if (this[startIndex] === value)
                return startIndex;
        return -1;
    };

}

if (!Date.now) {

    /**
     * 获取当前时间的数字表示。
     * @return {Number} 当前的时间点。
     * @static
     * @example
     * <pre>
     * Date.now(); //   相当于 new Date().getTime()
     * </pre>
     */
    Date.now = function () {
        return +new Date;
    };

}

// IE6: for in 不会遍历原生函数，所以手动拷贝这些元素函数。
(function () {
    for (var item in { toString: 1 }) {
        return;
    }

    var extend = Object.extend;
    extend.enumerables = "toString hasOwnProperty valueOf constructor isPrototypeOf".split(' ');
    Object.extend = function (dest, src) {
        if (src) {
            //#assert dest != null
            for (var i = extend.enumerables.length, value; i--;)
                if (Object.prototype.hasOwnProperty.call(src, value = extend.enumerables[i]))
                    dest[value] = src[value];
            extend(dest, src);
        }

        return dest;
    };

})();

// #endif
// #endregion
