define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 对类数组进行冒泡排序。
     * @param list 要排序的类数组。
     * @param compareFn 用于排序时确定顺序的函数。函数接收以下参数：
     * - x：要比较的第一个参数。
     * - y：要比较的第二个参数。
     *
     * 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
     * @param start 开始排序的索引（从 0 开始）。
     * @param end 结束排序的索引（从 0 开始）。
     * @return 返回原类数组。
     * @desc 冒泡排序是稳定排序算法，时间复杂度为 O(n²)。
     * @example bubbleSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
     */
    function bubbleSort(list, compareFn, start, end) {
        if (compareFn === void 0) { compareFn = function (x, y) { return x < y; }; }
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = list.length; }
        for (; start < end; start++) {
            for (var i = start + 1; i < end; i++) {
                if (compareFn(list[i], list[start]) > 0) {
                    var t = list[start];
                    list[start] = list[i];
                    list[i] = t;
                }
            }
        }
        return list;
    }
    exports.bubbleSort = bubbleSort;
    /**
     * 对类数组进行快速排序。
     * @param list 要排序的类数组。
     * @param compareFn 用于排序时确定顺序的函数。函数接收以下参数：
     * - x：要比较的第一个参数。
     * - y：要比较的第二个参数。
     *
     * 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
     * @param start 开始排序的索引（从 0 开始）。
     * @param end 结束排序的索引（从 0 开始）。
     * @return 返回原类数组。
     * @desc 快速排序是不稳定排序算法，时间复杂度为 O(n*log(n))。
     * @example quickSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
     */
    function quickSort(list, compareFn, start, end) {
        if (compareFn === void 0) { compareFn = function (x, y) { return x < y; }; }
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = list.length; }
        if (start < end) {
            var t = list[start];
            var low = start;
            var high = end;
            do {
                while (high > low && !compareFn(list[high], t) > 0) {
                    high--;
                }
                if (low < high) {
                    list[low++] = list[high];
                }
                while (low < high && compareFn(list[low], t) > 0) {
                    low++;
                }
                if (low < high) {
                    list[high--] = list[low];
                }
            } while (low < high);
            list[low] = t;
            quickSort(list, compareFn, start, high - 1);
            quickSort(list, compareFn, high + 1, end);
        }
        return list;
    }
    exports.quickSort = quickSort;
    /**
     * 对类数组进行希尔排序。
     * @param list 要排序的类数组。
     * @param compareFn 用于排序时确定顺序的函数。函数接收以下参数：
     * - x：要比较的第一个参数。
     * - y：要比较的第二个参数。
     *
     * 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
     * @param start 开始排序的索引（从 0 开始）。
     * @param end 结束排序的索引（从 0 开始）。
     * @return 返回原类数组。
     * @desc 快速排序是不稳定排序算法，适用于数据量不大的情况。
     * @example shellSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
     */
    function shellSort(list, compareFn, start, end) {
        if (compareFn === void 0) { compareFn = function (x, y) { return x < y; }; }
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = list.length; }
        for (var gap = (end - start) >> 1; gap > 0; gap >>= 1) {
            for (var i = gap + start; i < end; i++) {
                var t = list[i];
                var j = i;
                for (; j - gap >= start && compareFn(t, list[j - gap]) > 0; j -= gap) {
                    list[j] = list[j - gap];
                }
                list[j] = t;
            }
        }
        return list;
    }
    exports.shellSort = shellSort;
});
//# sourceMappingURL=sort.js.map