
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
