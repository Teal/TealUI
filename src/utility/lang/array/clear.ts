// #todo


interface Array<T> {

    /**
     * 清空数组所有项。
     * @example [1, 2].clear() // []
     */
    clear(): this;

}

/**
 * 清空数组所有项。
 * @example [1, 2].clear() // []
 */
Array.prototype.clear = function () {
    this.length = 0;
    return this;
};
