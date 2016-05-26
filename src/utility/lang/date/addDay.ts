
/**
 * 在当前日期添加指定的天数并返回新日期。
 * @param {Number} value 要添加的天数。如果小于 0 则倒数指定天数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addDay(1)
 */
Date.prototype.addDay = function (value) {
    return new Date(+this + value * 86400000);
};
