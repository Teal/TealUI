// #todo


/**
 * 获取两个日期相差的天数。
 * @param {Date} date1 比较的第一个日期。
 * @param {Date} date2 比较的第二个日期
 * @returns {Number} 返回 @date2 减去 @date1 相差的天数。不足一天的部分被忽略。
 * @example Date.compareDay(new Date(2014, 1, 1), new Date(2014, 1, 2)) // 1
 */
Date.compareDay = function (date1, date2) {
    return Math.floor((date2 - date1) / 86400000);
};
