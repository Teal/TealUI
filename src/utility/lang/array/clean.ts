
interface Array<T> {

    /**
     * 删除数组中值为 false 的项。
     * @example ["", false, 0, undefined, null, {}].clean(); // [{}]
     */
    clean(): this;

}

/**
 * 删除数组中值为 false 的项。
 * @example ["", false, 0, undefined, null, {}].clean(); // [{}]
 */
Array.prototype.clean = function () {
    for (let i = this.length - 1; i >= 0; i--) {
        if (!this[i]) this.splice(i, 1);
    }
    return this;
};
