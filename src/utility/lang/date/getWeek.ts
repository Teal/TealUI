// #todo


/**
 * 获取当前日期的周数。
 * @param {Date} [date] 作为第一周的日期。如果未指定则使用今年第一天作为第一周。
 * @returns {Number} 返回周数。
 * @example 
 * new Date(2014, 2, 1).getWeek(new Date(2014, 1, 1)) // 3
 * 
 * new Date(2014, 2, 1).getWeek() // 9
 */
Date.prototype.getWeek = function (date) {
    return Math.floor((this - (date || new Date(this.getFullYear(), 0, 1))) / 604800000) + 1;
};
