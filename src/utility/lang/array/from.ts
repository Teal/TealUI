// #todo


interface Array<T> {

}

/**
 * 将一个类数组对象转为原生数组。
 * @param {Object} iterable 一个类数组对象。
 * @param {Number} [startIndex=0] 转换开始的位置。
 * @returns {Array} 返回新数组，其值和 @iterable 一一对应。
 * @example
 * // 将 arguments 对象转为数组。
 * (function(){return Array.parseArray(arguments)})(); // 返回一个数组
 *
 * // 获取数组的子集。
 * Array.parseArray([4,6], 1); // [6]
 *
 * // 处理伪数组。
 * Array.parseArray({length: 1, "0": "value"}); // ["value"]
 */
Array.parseArray = function (iterable, startIndex) {
    if (!iterable) return [];

    // IE6-8: [DOM Object] 。
    /*@cc_on if(!+"\v1") {
    var result = [], length = iterable.length;
    for (startIndex = startIndex || 0; startIndex < length; startIndex++) {
        result.push(iterable[startIndex]);
    }
    return result;
    } @*/

    return Array.prototype.slice.call(iterable, startIndex);
};
