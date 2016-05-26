
/**
 * 创建一个从 0 到指定指定值组成的数组。
 * @param {Number} [start=0] 开始的数值。
 * @param {Number} stop 结束的数值。
 * @param {Number} [step=1] 步长，即相邻数字的值。
 * @returns {Array} 返回一个新数组。
 * @example 
 * Array.range(6) // [0, 1, 2, 3, 4, 5]
 * 
 * Array.range(2, 11, 3) // [2, 5, 8]
 */
Array.range = function (start, stop, step) {
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var result = Array(length);

    for (var i = 0; i < length; i++ , start += step) {
        result[i] = start;
    }

    return result;
};
