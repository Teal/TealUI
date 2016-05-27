
/**
 * 获取指定年的指定月有多少天。
 * @param {Number} year 指定的年。
 * @param {Number} month 指定的月。
 * @returns {Number} 返回指定年的指定月的天数。
 * @example Date.getDayInMonth(2001, 2) // 28
 */
Date.getDayInMonth = function (year, month) {
    return (new Date(year, month) - new Date(year, month - 1)) / 86400000;
};
