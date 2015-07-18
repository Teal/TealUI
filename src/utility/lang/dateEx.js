/**
 * @fileOverview 提供日期操作的辅助函数。
 * @author xuld
 */

// #region @Date.isLeapYear

/**
 * 判断指定的年份是否是闰年。
 * @param {Number} year 要进行判断的年份。
 * @return {Boolean} 指定的年份是闰年，则返回 true，否则返回 false。
 */
Date.isLeapYear = function (year) {
    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
};

// #endregion

// #region @Date.isValid

/**
 * 判断指定的数值所在的日期是否合法（如2月30日是不合法的）。
 * @return {Boolean} 指定的数值合法则返回 true，否则返回 false。
 */
Date.isValid = function (y, m, d, h, i, s, ms) {
    h = h || 0;
    i = i || 0;
    s = s || 0;
    ms = ms || 0;

    var dt = new Date(y, m - 1, d, h, i, s, ms);

    return y === dt.getFullYear() && m === dt.getMonth() + 1 && d === dt.getDate() && h === dt.getHours() && i === dt.getMinutes() && s === dt.getSeconds() && ms === dt.getMilliseconds();
};

// #endregion

// #region @Date.getDayInMonth

/**
 * 获取指定年的指定月有多少天。
 * @param {Number} year 指定的年。
 * @param {Number} month 指定的月。
 * @return {Number} 返回指定年的指定月的天数。
 */
Date.getDayInMonth = function (year, month) {
    return (new Date(year, month) - new Date(year, month - 1)) / 86400000;
};

// #endregion

// #region @Date.compareDay

/**
 * 比较2个日期返回相差的天数。
 * @param {Date} date1 日期
 * @param {Date} date2 日期
 * @param {Boolean} on 严格时间差.加上后效率会减小。
 * @return {Number} 天。
 */
Date.compareDay = function (date1, date2) {
    return Math.floor((date2 - date1) / 86400000);
};

// #endregion

// #region @Date#clone

/**
 * 克隆当前日期对象。
 */
Date.prototype.clone = function () {
    return new Date(+this);
};

// #endregion

// #region @Date#dayTo

/**
 * 计算和当前日期到指定最近的指定日期的天数。
 * @param {Number} month 月份。
 * @param {Number} day 天。
 * @return {Number} 天数。
 */
Date.prototype.dayTo = function (month, day) {
    var date = new Date(this.getFullYear(), this.getMonth(), this.getDate()),
        offset = new Date(this.getFullYear(), month - 1, day) - date;
    if (offset < 0) offset = new Date(this.getFullYear() + 1, month - 1, day) - date;
    return offset / 86400000;
};

// #endregion

// #region @Date#addYear

/**
 * 在当前日期添加指定的年数。
 * @param {Number} value 要添加的年数。
 * @returns {Date} 返回处理后的新日期对象。
 */
Date.prototype.addYear = function (value) {
    return this.addMonth(value * 12);
};

// #endregion

// #region @Date#addWeek

/**
 * 在当前日期添加指定的周数。
 * @param {Number} value 要添加的周数。
 * @returns {Date} 返回处理后的新日期对象。
 */
Date.prototype.addWeek = function (value) {
    return this.addDay(value * 7);
};

// #endregion

// #region @Date#getWeekFrom

/**
 * 获取当前日期从指定日期开始后的星期数。
 * @param {Date} date 日期
 * @return {Number} 天。
 */
Date.prototype.getWeekFrom = function (date) {
    return Math.floor((this - date) / 604800000) + 1;
};

// #endregion

// #region @Date#getTimezone

/**
 * 获取日期的时区。
 * @param {Date} date 日期
 * @return {Number} 天。
 */
Date.prototype.getTimezone = function () {
    return this.toString()
             .replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
             .replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
};

// #endregion

// #region @Date#getFirstDay

/**
 * 获取当月第一天。
 * @return {Date} 日期
 */
Date.prototype.getFirstDay = function () {
    var result = new Date(+this);
    result.setDate(1);
    return result;
};

// #endregion

// #region @Date#getLastDay

/**
 * 获取当月最后一天。
 * @return {Date} 日期
 */
Date.prototype.getLastDay = function () {
    var result = new Date(+this);
    result.setDate(1);
    result.setMonth(result.getMonth() + 1);
    result.setDate(result.getDate() - 1);
    return result;
};

// #endregion
