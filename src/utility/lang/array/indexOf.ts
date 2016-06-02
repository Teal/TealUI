// #todo


interface Array<T> {

    /**
     * 获取指定项在数组内的索引。
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
    indexOf<T>(callback: (value: T, index: number, target: Array<T>) => boolean, scope?: any): number;

}

/*@cc_on if(!+"\v1") {

/// 获取指定项在数组内的索引。
/// @param {Object} value 一个类数组对象。
/// @param {Number} [startIndex=0] 转换开始的位置。
/// @returns {Number} 返回索引。如果找不到则返回 -1。
/// @example ["b", "c", "a", "a"].indexOf("a"); // 2
/// @since ES4
Array.prototype.indexOf = Array.prototype.indexOf || function (value, startIndex) {
    startIndex = startIndex || 0;
    for (var len = this.length; startIndex < len; startIndex++) {
        if (this[startIndex] === value) {
            return startIndex;
        }
    }
    return -1;
};

} @*/
