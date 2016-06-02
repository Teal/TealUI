// #todo


interface Array<T> {

    /**
     * 判断当前数组是否至少存在一项满足指定条件。
     * @param callback 对每一项执行的回调函数。函数的参数依次为:
     *      @param value 当前项的值。
     *      @param index 当前项的索引或键。
     *      @param target 当前正在遍历的数组。
     *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
     * @example [1, 9, 9, 0].some(function(item){return item > 5}) // true
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    some(callback: (value: T, index: number, target: Array<T>) => boolean, scope?: any): boolean;

}

if (!Array.prototype.some) {

    /**
     * 判断当前数组是否至少存在一项满足指定条件。
     * @param callback 对每一项执行的回调函数。函数的参数依次为:
     *      @param value 当前项的值。
     *      @param index 当前项的索引或键。
     *      @param target 当前正在遍历的数组。
     *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 如果至少存在一项满足条件则返回 true，否则返回 false。
     * @example [1, 9, 9, 0].some(function(item){return item > 5}) // true
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    Array.prototype.some = function (callback: (value: any, index: number, target: any[]) => boolean, scope?: any) {
        for (let i = 0, length = this.length; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };

}