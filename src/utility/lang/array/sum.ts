
interface Array<T> {

    /**
     * 计算数组中所有数值的和。
     * @returns 返回数组中所有数值的和。
     * @example [1, 2].sum() // 3
     */
    sum(): number;

}

/**
 * 计算数组中所有数值的和。
 * @returns 返回数组中所有数值的和。
 * @example [1, 2].sum() // 3
 */
Array.prototype.sum = function () {
    let result = 0, i = this.length;
    while (--i >= 0) result += +this[i] || 0;
    return result;
};
