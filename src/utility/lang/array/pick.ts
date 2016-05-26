
/**
 * 获取数组中第一个不为空的元素。
 * @returns {Object} 返回不为空的元素，如果所有元素都为空则返回 @undefined。
 * @example [undefined, null, 1, 2].pick() // 1
 */
Array.prototype.pick = function () {
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] != undefined) {
            return this[i];
        }
    }
};
