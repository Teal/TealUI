// #todo


/**
 * 在当前日期添加指定的周数。
 * @param {Number} value 要添加的周数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addWeek(1)
 */
Date.prototype.addWeek = function (value) {
    return this.addDay(value * 7);
};
