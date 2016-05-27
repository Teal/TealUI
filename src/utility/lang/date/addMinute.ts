
/**
 * 在当前分钟添加指定的分钟数并返回新日期。
 * @param {Number} value 要添加的分钟数。如果小于 0 则倒数指定分钟数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addMinutes(1)
 */
Date.prototype.addMinute = function (value) {
    return new Date(+this + value * 60000);
};
