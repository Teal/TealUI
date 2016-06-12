/**
 * @fileOverflow 排序算法
 * @author xuld@vip.qq.com
 */

/**
 * 冒泡排序。
 * @param iteratable 要排序的类数组。
 * @param compareFn 用于排序时确定优先级的函数。函数的参数为：
 *      @@param x 比较的第一个参数。
 *      @@param y 比较的第二个参数。
 *      @@returns 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
 * @param start 开始排序的索引。
 * @param end 结束排序的索引。
 * @returns 返回 *iteratable*。
 * @remark 冒泡排序是稳定排序算法。
 * @example bubbleSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
*/
export function bubbleSort<T>(iteratable: ArrayLike<T>, compareFn?: (x: T, y: T) => boolean, start?: number, end?: number) {
    compareFn = compareFn || ((x: T, y: T) => x < y);
    start = start || 0;
    end = end || iteratable.length;
    for (; start < end; start++) {
        for (let i = start + 1; i < end; i++) {
            if (compareFn(iteratable[i], iteratable[start])) {
                const t = iteratable[start];
                iteratable[start] = iteratable[i];
                iteratable[i] = t;
            }
        }
    }
    return iteratable;
}

/** 对类数组进行希尔排序。
 * @param iteratable 要排序的类数组。
 * @param compareFn 用于排序时确定优先级的函数。函数的参数为：
 *      @@param x 比较的第一个参数。
 *      @@param y 比较的第二个参数。
 *      @@returns 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
 * @param start 开始排序的索引。
 * @param end 结束排序的索引。
 * @returns 返回 *iteratable*。
 * @remark 希尔排序不是稳定排序算法。
 * @example shellSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
 */
export function shellSort<T>(iteratable: ArrayLike<T>, compareFn?: (x: T, y: T) => boolean, start?: number, end?: number) {
    compareFn = compareFn || ((x: T, y: T) => x < y);
    start = start || 0;
    end = end || iteratable.length;
    for (let gap = (end - start) >> 1; gap > 0; gap = gap >> 1) {
        for (let i = gap + start; i < end; i++) {
            const t = iteratable[i];
            let j = i;
            for (; (j - gap >= start) && compareFn(t, iteratable[j - gap]); j -= gap) {
                iteratable[j] = iteratable[j - gap];
            }
            iteratable[j] = t;
        }
    }
    return iteratable;
}

/**
 * 对类数组进行快速排序。
 * @param iteratable 要排序的类数组。
 * @param compareFn 用于排序时确定优先级的函数。函数的参数为：
 *      @@param x 比较的第一个参数。
 *      @@param y 比较的第二个参数。
 *      @@returns 如果返回 true，则说明 *x* 应该排在 *y* 之前。否则 *x* 应该排在 *y* 之后。
 * @param start 开始排序的索引。
 * @param end 结束排序的索引。
 * @returns 返回 *iteratable*。
 * @remark 快速排序不是稳定排序算法。
 * @example quickSort([1, 3, 5, 4, 3]) // [1, 3, 3, 4, 5]
*/
export function quickSort<T>(iteratable: ArrayLike<T>, compareFn?: (x: T, y: T) => boolean, start?: number, end?: number) {
    qsort(iteratable, compareFn || ((x: T, y: T) => x < y), start || 0, end || iteratable.length);
    return iteratable;

    function qsort(iteratable: ArrayLike<T>, compareFn?: (x: T, y: T) => boolean, start?: number, end?: number) {
        if (start < end) {
            const t = iteratable[start];
            let low = start;
            let high = end;
            do {

                while (high > low && !compareFn(iteratable[high], t)) high--;
                if (low < high) iteratable[low++] = iteratable[high];

                while (low < high && compareFn(iteratable[low], t)) low++;
                if (low < high) iteratable[high--] = iteratable[low];

            } while (low < high);
            iteratable[low] = t;

            qsort(iteratable, compareFn, start, high - 1);
            qsort(iteratable, compareFn, high + 1, end);
        }
    }

}
