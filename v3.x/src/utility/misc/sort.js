/**
 * @author xuld
 */

// #region @bubbleSort

/**
 * 冒泡排序。
 * @param {Array} iteratable 要排序的类数组。
 * @param {Function} [compareFn] 用于排序时确定优先级的函数。函数的参数为：
 * * @param {Object} x 比较的第一个参数。
 * * @param {Object} y 比较的第二个参数。
 * * @returns {Boolean} 如果返回 @true，则说明 @x 应该排在 @y 之前。否则 @y 应该排在 @x 之前。
 * @param {Number} [start] 开始排序的索引。
 * @param {Number} [end] 结束排序的索引。
 * @returns {Array} 返回 @iteratable。
 * @remark 冒泡排序是稳定排序算法。
 * @example bubbleSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
*/
function bubbleSort(iteratable, compareFn, start, end) {
    compareFn = compareFn || function (x, y) { return x < y; };
    typeof console === "object" && console.assert(compareFn instanceof Function, "bubbleSort(iteratable, compareFn: 必须是函数, [start], [end])");
    start = start || 0;
    end = end || iteratable.length;
    for (; start < end; start++) {
        for (var k = start + 1; k < end; k++) {
            if (compareFn(iteratable[k], iteratable[start])) {
                var c = iteratable[start];
                iteratable[start] = iteratable[k];
                iteratable[k] = c;
            }
        }
    }
    return iteratable;
}

// #endregion

// #region @shellSort

/** 对类数组进行希尔排序。
 * @param {Array} iteratable 要排序的类数组。
 * @param {Function} [compareFn] 用于排序时确定优先级的函数。函数的参数为：
 * * @param {Object} x 比较的第一个参数。
 * * @param {Object} y 比较的第二个参数。
 * * @returns {Boolean} 如果返回 @true，则说明 @x 应该排在 @y 之前。否则 @y 应该排在 @x 之前。
 * @param {Number} [start] 开始排序的索引。
 * @param {Number} [end] 结束排序的索引。
 * @returns {Array} 返回 @iteratable。
 * @remark 希尔排序不是稳定排序算法。
 * @example shellSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
 */
function shellSort(iteratable, compareFn, start, end) {
    compareFn = compareFn || function (x, y) { return x < y; };
    typeof console === "object" && console.assert(compareFn instanceof Function, "shellSort(iteratable, compareFn: 必须是函数, [start], [end])");
    start = start || 0;
    end = end || iteratable.length;
    for (var gap = (end - start) >> 1; gap > 0; gap = gap >> 1) {
        for (var i = gap + start; i < end; i++) {
            for (var temp = iteratable[i], j = i; (j - gap >= start) && compareFn(temp, iteratable[j - gap]) ; j -= gap) {
                iteratable[j] = iteratable[j - gap];
            }
            iteratable[j] = temp;
        }
    }
    return iteratable;
}

// #endregion

// #region @quickSort

/**
 * 对类数组进行快速排序。
 * @param {Array} iteratable 要排序的类数组。
 * @param {Function} [compareFn] 用于排序时确定优先级的函数。函数的参数为：
 * * @param {Object} x 比较的第一个参数。
 * * @param {Object} y 比较的第二个参数。
 * * @returns {Boolean} 如果返回 @true，则说明 @x 应该排在 @y 之前。否则 @y 应该排在 @x 之前。
 * @param {Number} [start] 开始排序的索引。
 * @param {Number} [end] 结束排序的索引。
 * @returns {Array} 返回 @iteratable。
 * @remark 快速排序不是稳定排序算法。
 * @example quickSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
*/
function quickSort(iteratable, compareFn, start, end) {
    typeof console === "object" && console.assert(!compareFn || compareFn instanceof Function, "quickSort(iteratable, compareFn: 必须是函数, [start], [end])");

    function qsort(iteratable, compareFn, start, end){
            
        if (start < end) {

            var temp = iteratable[start], low = start, high = end;
            do {

                while (high > low && !compareFn(iteratable[high], temp)) high--;
                if (low < high) iteratable[low++] = iteratable[high];

                while (low < high && compareFn(iteratable[low], temp)) low++;
                if (low < high) iteratable[high--] = iteratable[low];

            } while (low < high);
            iteratable[low] = temp;

            qsort(iteratable, compareFn, start, high - 1);
            qsort(iteratable, compareFn, high + 1, end);

        }

    }

    qsort(iteratable, compareFn || function (x, y) { return x < y;}, start || 0, end || iteratable.length);
    return iteratable;
}

// #endregion
