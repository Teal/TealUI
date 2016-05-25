/**
 * 对指定数组或对象每一项进行处理，并将结果组成一个新数组或对象。
 * @param iterable 要遍历的数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数。函数的参数依次为:
 *      @param value 当前项的值。
 *      @param index 当前项的索引或键。
 *      @param target 当前正在遍历的数组或对象。
 *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 返回一个新数组或对象。
 * @example Object.map(["a","b"], function(a){ return a + a; }) // ["aa", "bb"]
 * @example Object.map({a: "a", b: "b"}, function(a){ return a + a; }) // {a: "aa", b: "bb"}
 * @example Object.map({length: 1, "0": "a"}, function(a){ return a + a; }) // ["a"]
 */
Object.map = function (iterable, callback, scope) {
    var result;
    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        result = [];
        for (var i = 0, length_1 = iterable.length; i < length_1; i++) {
            result[i] = callback.call(scope, iterable[i], i, iterable);
        }
    }
    else {
        result = {};
        for (var i in iterable) {
            result[i] = callback.call(scope, iterable[i], i, iterable);
        }
    }
    return result;
};
