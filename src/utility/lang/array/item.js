/**
 * 获取数组指定索引的项。
 * @param {Number} index 要获取的索引。如果值为负数，则获取倒数的项。
 * @returns {Object} 返回指定索引的项。
 * @example ['a', 'b'].item(-1) // 'b'
 */
Array.prototype.item = function (index) {
    return this[index < 0 ? this.length + index : index];
};
