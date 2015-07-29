/**
 * @author xuld
 */

/**
 * 提供排序的几种算法。
 */
var Sorter = {

    // #region @Sorter.bubble

    /**
     * 冒泡排序。
     * @param {Object} iteratable 要排序的类数组。
     * @param {Function} [compareFn] 用于排序时确定优先级的函数。
     * @param {Number} [start] 开始排序的位置。
     * @param {Number} [end] 结束排序的位置。
     * @remark 冒泡排序是稳定排序算法。
     * @example Sorter.bubble([1,3,5,4,3]) // [1, 3, 3, 4, 5]
    */
    bubble: function (iteratable, compareFn, start, end) {
        compareFn = compareFn || function (x, y) { return x < y;};
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
    },

    // #endregion

    // #region @Sorter.shell

    /** 对类数组进行希尔排序。
     * @param {Object} iteratable 要排序的类数组。
     * @param {Function} [compareFn] 用于排序时确定优先级的函数。
     * @param {Number} [start] 开始排序的位置。
     * @param {Number} [end] 结束排序的位置。
     * @remark 希尔排序不是稳定排序算法。
     * @example Sorter.shell([1,3,5,4,3]) // [1, 3, 3, 4, 5]
     */
    shell: function (iteratable, compareFn, start, end) {
        compareFn = compareFn || function (x, y) { return x < y;};
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
    },

    // #endregion

    // #region @Sorter.quick

    /**
     * 对类数组进行快速排序。
     * @param {Object} iteratable 要排序的类数组。
     * @param {Function} [compareFn] 用于排序时确定优先级的函数。
     * @param {Number} [start] 开始排序的位置。
     * @param {Number} [end] 结束排序的位置。
     * @remark 快速排序不是稳定排序算法。
     * @example Sorter.quick([1,3,5,4,3]) // [1, 3, 3, 4, 5]
    */
    quick: function (iteratable, compareFn, start, end) {

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

};
    