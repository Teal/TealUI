
interface ObjectConstructor {

    /**
     * 判断指定数组或对象是否至少存在一项满足指定条件。
     * @param iterable 要遍历的数组或对象（不支持函数）。
     * @param callback 对每一项执行的回调函数。函数的参数依次为:
     *      @param value 当前项的值。
     *      @param index 当前项的索引或键。
     *      @param target 当前正在遍历的数组或对象。
     *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
     * @example Object.some({a: 1, b: 2}, function(item) {return item > 1}) // true
     */
    some(iterable: any, callback: (value: any, index: number | string, target: any) => boolean, scope?: any): boolean;

}

/**
 * 判断指定数组或对象是否至少存在一项满足指定条件。
 * @param iterable 要遍历的数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数。函数的参数依次为:
 *      @param value 当前项的值。
 *      @param index 当前项的索引或键。
 *      @param target 当前正在遍历的数组或对象。
 *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
 * @example Object.some({a: 1, b: 2}, function(item) {return item > 1}) // true
 */
Object.some = function (iterable: any, callback: (value: any, index: number | string, target: any) => boolean, scope?: any) {

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable instanceof Array) {
        for (let i = 0, length = iterable.length; i < length; i++) {
            if ((i in this) && callback.call(scope, iterable[i], i, iterable)) {
                return true;
            }
        }
    } else {
        for (let i in iterable) {
            if (callback.call(scope, iterable[i], i, iterable)) {
                return true;
            }
        }
    }

    // 返回目标。
    return false;
}
