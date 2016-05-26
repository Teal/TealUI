if (!Array.prototype.lastIndexOf) {
    /**
     * 获取指定项在数组内的最后一个索引。
     * @param {Object} value 一个类数组对象。
     * @param {Number} [startIndex=0] 转换开始的位置。
     * @returns {Number} 返回索引。如果找不到则返回 -1。
     * @example ["b", "c", "a", "a"].lastIndexOf("a"); // 3
     * @since ES4
     */
    Array.prototype.lastIndexOf = function (value, startIndex) {
        startIndex = startIndex || 0;
        for (var i = this.length - 1; i >= startIndex; i--) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };
}
