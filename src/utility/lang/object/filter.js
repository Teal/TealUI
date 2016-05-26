/**
 * 筛选指定数组或对象中符合要求的项组成一个新数组或对象。
 * @param iterable 要遍历的数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数。函数的参数依次为:
 *      @param value 当前项的值。
 *      @param index 当前项的索引或键。
 *      @param target 当前正在遍历的数组或对象。
 *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回一个新数组或对象。
 * @example Object.filter([1, 2], function(item){return item > 1;}) // [2]
 * @example Object.filter({a:1, b:2}, function(item){ return item > 1; }) // {b:2}
 */
Object.filter = function (iterable, callback, scope) {
    var result;
    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        result = [];
        for (var i = 0, length_1 = iterable.length; i < length_1; i++) {
            if ((i in this) && callback.call(scope, iterable[i], i, iterable)) {
                result.push(iterable[i]);
            }
        }
    }
    else {
        result = {};
        for (var i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                result[i] = iterable[i];
            }
        }
    }
    // 返回目标。
    return result;
};
