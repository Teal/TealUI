
/**
 * 在当前日期添加指定的年数。
 * @param {Number} value 要添加的年数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addYear(1)
 */
Date.prototype.addYear = function (value) {
    return this.addMonth(value * 12);
};
