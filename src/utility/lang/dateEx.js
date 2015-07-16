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
 * 判断指定的数值是否可以解释为正确的日期。
 * @return {Boolean} 指定的数值合法则返回 true，否则返回 false。
 */
Date.isValid = function (y, m, d, h, i, s, ms) {
    h = h || 0;
    i = i || 0;
    s = s || 0;
    ms = ms || 0;

    var dt = new Date(y, m - 1, d, h, i, s, ms);

    return y === dt.getFullYear() && m === dt.getMonth() + 1 && d === dt.getDate() && h === dt.getHours() && i === dt.getMinutes() && s === dt.getSeconds() &&  ms === dt.getMilliseconds();
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

// #region @Date#dayOff

/**
 * 计算和当前日期到指定最近的指定日期的天数。
 * @param {Number} month 月份。
 * @param {Number} day 天。
 * @return {Number} 天数。
 */
Date.prototype.dayOff = function (month, day) {
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

// #region @Date.from

/**
 * 计算和当前日期到指定最近的指定日期的天数。（支持格式解析）
 * @param {String/Date} value 要分析的对象。
 * @param {String} format 对应的格式。
 * @returns {Date} 返回分析出的日期对象。
 */
Date.from = function (value, format) {
    if (value && !(value instanceof Date)) {
        if (format) {
            
        }
        value = new Date(value.constructor === String ? value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3') : value);
    }
    return value;
};

// #endregion



Date.parseFunctions = {count:0};

Date.parseRegexes = [];

Date.formatFunctions = {count:0};

Date.parseDate = function(input, format) {
    if (Date.parseFunctions[format] == null) {
        Date.createParser(format);
    }
    var func = Date.parseFunctions[format];
    return Date[func](input);
};


Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;

    var code = "Date." + funcName + " = function(input){\n"
        + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n"
        + "var d = new Date();\n"
        + "y = d.getFullYear();\n"
        + "m = d.getMonth();\n"
        + "d = d.getDate();\n"
        + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
        + "if (results && results.length > 0) {";
    var regex = "";

    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        }
        else if (special) {
            special = false;
            regex +=ch;
        }
        else {
            var obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if (obj.g && obj.c) {
                code += obj.c;
            }
        }
    }

    code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
        + "{return new Date(y, m, d, h, i, s);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
        + "{return new Date(y, m, d, h, i);}\n"
        + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
        + "{return new Date(y, m, d, h);}\n"
        + "else if (y > 0 && m >= 0 && d > 0)\n"
        + "{return new Date(y, m, d);}\n"
        + "else if (y > 0 && m >= 0)\n"
        + "{return new Date(y, m);}\n"
        + "else if (y > 0)\n"
        + "{return new Date(y);}\n"
        + "}return null;}";

    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
    eval(code);
};


Date.formatCodeToRegex = function(character, currentGroup) {
    switch (character) {
    case "D":
        return {g:0,
        c:null,
        s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
    case "j":
    case "d":
        return {g:1,
            c:"d = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};
    case "l":
        return {g:0,
            c:null,
            s:"(?:" + Date.dayNames.join("|") + ")"};
    case "S":
        return {g:0,
            c:null,
            s:"(?:st|nd|rd|th)"};
    case "w":
        return {g:0,
            c:null,
            s:"\\d"};
    case "z":
        return {g:0,
            c:null,
            s:"(?:\\d{1,3})"};
    case "W":
        return {g:0,
            c:null,
            s:"(?:\\d{2})"};
    case "F":
        return {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
            s:"(" + Date.monthNames.join("|") + ")"};
    case "M":
        return {g:1,
            c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
            s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
    case "n":
    case "m":
        return {g:1,
            c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
            s:"(\\d{1,2})"};
    case "t":
        return {g:0,
            c:null,
            s:"\\d{1,2}"};
    case "L":
        return {g:0,
            c:null,
            s:"(?:1|0)"};
    case "Y":
        return {g:1,
            c:"y = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{4})"};
    case "y":
        return {g:1,
            c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
                + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s:"(\\d{1,2})"};
    case "a":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'am') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(am|pm)"};
    case "A":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'AM') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(AM|PM)"};
    case "g":
    case "G":
    case "h":
    case "H":
        return {g:1,
            c:"h = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};
    case "i":
        return {g:1,
            c:"i = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};
    case "s":
        return {g:1,
            c:"s = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};
    case "O":
        return {g:0,
            c:null,
            s:"[+-]\\d{4}"};
    case "T":
        return {g:0,
            c:null,
            s:"[A-Z]{3}"};
    case "Z":
        return {g:0,
            c:null,
            s:"[+-]\\d{1,5}"};
    default:
        return {g:0,
            c:null,
            s: character
        };
    }
};
 