/**
 * @fileOverview 提供日期操作的辅助函数。
 * @author xuld
 */

// #region @Date.now

/**
 * 获取当前时间的时间戳。
 * @returns {Number} 返回当前时间的时间戳。
 * @example Date.now(); // 相当于 new Date().getTime()
 * @since ES5
 */
Date.now = Date.now || function () {
    return +new Date;
};

// #endregion

// #region @Date.isLeapYear

/**
 * 判断指定的年份是否是闰年。
 * @param {Number} year 要判断的年份。
 * @returns {Boolean} 如果 @year 是闰年，则返回 @true，否则返回 @false。
 * @example Date.isLeapYear(2002) // false
 */
Date.isLeapYear = function (year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

// #endregion

// #region @Date.isValid

/**
 * 判断指定的数值所表示的日期是否合法。（如2月30日是不合法的）
 * @param {Number} [year=0] 要判断的年。
 * @param {Number} [month=0] 要判断的月。
 * @param {Number} [day=0] 要判断的日。
 * @param {Number} [hour=0] 要判断的时。
 * @param {Number} [minute=0] 要判断的分。
 * @param {Number} [second=0] 要判断的秒。
 * @param {Number} [milliSecond=0] 要判断的毫秒。
 * @returns {Boolean} 如果指定的数值合法则返回 @true，否则返回 @false。
 * @example Date.isValid(2004, 2, 29) // true
 */
Date.isValid = function (year, month, day, hour, minute, second, milliSecond) {
    hour = hour || 0;
    minute = minute || 0;
    second = second || 0;
    milliSecond = milliSecond || 0;

    var dt = new Date(year, month - 1, day, hour, minute, second, milliSecond);

    return year === dt.getFullYear() && month === dt.getMonth() + 1 && day === dt.getDate() && hour === dt.getHours() && minute === dt.getMinutes() && second === dt.getSeconds() && milliSecond === dt.getMilliseconds();
};

// #endregion

// #region @Date.getDayInMonth

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

// #endregion

// #region @Date.compareDay

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

// #endregion

// #region @Date#dayLeft

/**
 * 计算当前日期到同年某月某日的剩余天数。如果今年指定日期已过，则计算到明年同月日的剩余天数。
 * @param {Number} month 月。
 * @param {Number} day 天。
 * @returns {Number} 返回剩余天数。
 * @example new Date().dayLeft(12, 5)
 */
Date.prototype.dayLeft = function (month, day) {
    var date = new Date(this.getFullYear(), this.getMonth(), this.getDate()),
        offset = new Date(this.getFullYear(), month - 1, day) - date;
    if (offset < 0) offset = new Date(this.getFullYear() + 1, month - 1, day) - date;
    return offset / 86400000;
};

// #endregion

// #region @Date#clone

/**
 * 创建当前日期对象的副本。
 * @returns {Date} 返回新日期对象。
 * @example new Date().clone();
 */
Date.prototype.clone = function () {
    return new Date(+this);
};

// #endregion

// #region @Date#addYear

/**
 * 在当前日期添加指定的年数。
 * @param {Number} value 要添加的年数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addYear(1)
 */
Date.prototype.addYear = function (value) {
    return this.addMonth(value * 12);
};

// #endregion

// #region @Date#addWeek

/**
 * 在当前日期添加指定的周数。
 * @param {Number} value 要添加的周数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addWeek(1)
 */
Date.prototype.addWeek = function (value) {
    return this.addDay(value * 7);
};

// #endregion

// #region @Date#getWeek

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

// #endregion

// #region @Date#getTimezone

/**
 * 获取当前日期的时区部分。
 * @returns {String} 返回时区部分。
 * @example new Date().getTimezone() // "GMT"
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
 * @returns {Date} 返回新日期对象。
 * @example new Date().getFirstDay()
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
 * @returns {Date} 返回新日期对象。
 * @example new Date().getLastDay()
 */
Date.prototype.getLastDay = function () {
    var result = new Date(+this);
    result.setDate(1);
    result.setMonth(result.getMonth() + 1);
    result.setDate(result.getDate() - 1);
    return result;
};

// #endregion
