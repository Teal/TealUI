/**
 * 计算数组中所有数值的算术平均值。
 * @returns {Number} 返回数组中所有数值的算术平均值。
 * @example [1, 2].avg() // 1.5
 */
Array.prototype.avg = function () {
    var result = 0, i = this.length, c = 0;
    while (--i >= 0) {
        if (this[i] === 0 || +this[i]) {
            result += +this[i];
            c++;
        }
    }
    return c ? result / c : 0;
};
