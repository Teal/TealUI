
interface Array<T> {

    /**
     * 计算数组中所有数值的算术平均值。
     * @returns 返回数组中所有数值的算术平均值。计算时会忽略 NaN 项。
     * @example [1, 2].avg() // 1.5
     */
    avg(): number;

}

/**
 * 计算数组中所有数值的算术平均值。
 * @returns 返回数组中所有数值的算术平均值。计算时会忽略 NaN 项。
 * @example [1, 2].avg() // 1.5
 */
Array.prototype.avg = function () {
    let result = 0, i = this.length, c = 0;
    while (--i >= 0) {
        if (this[i] === 0 || +this[i]) {
            result += +this[i];
            c++;
        }
    }
    return c ? result / c : 0;
};
