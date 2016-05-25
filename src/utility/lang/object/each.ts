
interface ObjectConstructor {

    /**
     * 遍历一个数组或对象，并对每一项执行 *callback*。
     * @param iterable 要遍历的数组或对象（不支持函数）。
     * @param callback 对每一项执行的回调函数。函数的参数依次为:
     *      @param value 当前项的值。
     *      @param index 当前项的索引或键。
     *      @param target 当前正在遍历的数组或对象。
     *      @returns 函数可以返回 false 以终止循环。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 如果循环是因为 *callback* 返回 false 而中止，则返回 false，否则返回 true。
     * @example Object.each({a: 1, b: 2}, console.log, console); // 打印 'a  1' 和 'b  2'
     * @example Object.each(['a', 'b'], console.log, console); // 打印 '0  a' 和 '1  b'
     */
    each<T>(iterable: any, callback: (value: any, index: number | string, target: any) => boolean | void, scope?: Object): boolean;

}

/**
 * 遍历一个数组或对象，并对每一项执行 *callback*。
 * @param iterable 要遍历的数组或对象（不支持函数）。
 * @param callback 对每一项执行的回调函数。函数的参数依次为:
 *      @param value 当前项的值。
 *      @param index 当前项的索引或键。
 *      @param target 当前正在遍历的数组或对象。
 *      @returns 函数可以返回 false 以终止循环。
 * @param scope 设置 *callback* 执行时 this 的值。
 * @returns 如果循环是因为 *callback* 返回 false 而中止，则返回 false，否则返回 true。
 * @example Object.each({a: 1, b: 2}, console.log, console); // 打印 'a  1' 和 'b  2'
 * @example Object.each(['a', 'b'], console.log, console); // 打印 '0  a' 和 '1  b'
 */
Object.each = function (iterable: any, callback: (value: any, index: number | string, target: any) => boolean | void, scope: Object) {

    // 普通对象使用 for( in ) , 数组用 0 -> length 。
    if (iterable && typeof iterable.length === "number") {
        for (let i = 0; i < iterable.length; i++)
            if (callback.call(scope, iterable[i], i, iterable) === false)
                return false;
    } else {
        for (let key in iterable)
            if (callback.call(scope, iterable[key], key, iterable) === false)
                return false;
    }

    return true;
};
