
/**
 * 将指定的值插入到当前数组的指定位置。
 * @param {Number} index 要插入的位置。索引从 0 开始。如果 *index* 大于数组的长度，则插入到末尾。
 * @param {Object} value 要插入的内容。
 * @returns {Object} 返回 *value*。
 * @example ["I", "you"].insert(1, "love"); // ["I", "love", "you"]
 */
Array.prototype.insert = function (index, value) {
    this.splice(index, 0, value);
    return value;
};
