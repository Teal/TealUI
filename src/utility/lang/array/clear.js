/**
 * 清空数组所有项。
 * @returns this
 * @example [1, 2].clear() // []
 */
Array.prototype.clear = function () {
    this.length = 0;
    return this;
};
