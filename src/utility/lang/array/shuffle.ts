
interface Array<T> {

}

/**
 * 随机打乱数组的内容。
 * @returns this
 * @example [1, 2, 3].shuffle()
 */
Array.prototype.shuffle = function () {
    for (var i = this.length; --i >= 0;) {
        var r = Math.floor((i + 1) * Math.random());
        var temp = this[i];
        this[i] = this[r];
        this[r] = temp;
    }
    return this;
};
