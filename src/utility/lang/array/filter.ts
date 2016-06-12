// #todo


interface Array<T> {

    /**
     * 筛选当前数组中符合要求的项组成一个新数组。
     * @param callback 对每一项执行的回调函数。函数的参数依次为:
     *      @param value 当前项的值。
     *      @param index 当前项的索引或键。
     *      @param target 当前正在遍历的数组。
     *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回一个新数组。
     * @example Object.filter([1, 2], function(item){return item > 1;}) // [2]
     * @example Object.filter({a:1, b:2}, function(item){ return item > 1; }) // {b:2}
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    filter(callback: (value: T, index: number, target: Array<T>) => boolean, scope?: any): Array<T>;

}

if (!Array.prototype.filter) {

    /**
     * 筛选当前数组中符合要求的项组成一个新数组。
     * @param callback 对每一项执行的回调函数。函数的参数依次为:
     *      @param value 当前项的值。
     *      @param index 当前项的索引或键。
     *      @param target 当前正在遍历的数组。
     *      @returns 如果当前项符合条件则应该返回 true，否则返回 false。
     * @param scope 设置 *callback* 执行时 this 的值。
     * @returns 返回一个新数组。
     * @example Object.filter([1, 2], function(item){return item > 1;}) // [2]
     * @example Object.filter({a:1, b:2}, function(item){ return item > 1; }) // {b:2}
     * @since ES5
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     */
    Array.prototype.filter = function (callback: (value: any, index: number, target: any[]) => boolean, scope?: any) {
        let result = [];
        for (let i = 0, length = this.length; i < length; i++) {
            if ((i in this) && callback.call(scope, this[i], i, this)) {
                result.push(this[i]);
            }
        }
        return result;
    };

}
