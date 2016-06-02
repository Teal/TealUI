// #todo


/**
 * 判断指定的年份是否是闰年。
 * @param {Number} year 要判断的年份。
 * @returns {Boolean} 如果 @year 是闰年，则返回 @true，否则返回 @false。
 * @example Date.isLeapYear(2002) // false
 */
Date.isLeapYear = function (year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};
