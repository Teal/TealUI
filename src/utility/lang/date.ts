/**
 * @fileOverview 日期(Date)扩展
 * @author xuld@vip.qq.com
 * @keywords 时间, time, 刚刚, 天前
 */

declare global {

    interface DateConstructor {

    }

    interface Date {

    }

}

export module format {

    /**
     * 将日期对象格式化为字符串。
     * @param {String} [format="yyyy/MM/dd HH:mm:ss"] 格式字符串。具体见下文。
     * @returns {String} 格式化后的字符串。
     * @example new Date().format("yyyy/MM/dd HH:mm:ss")
     * @remark
     * #### 格式化语法
     * 格式字符串中，以下元字符会被替换：
     * 
     * 元字符 | 意义 | 实例
     * ------|-----|--------------------
     * y     | 年  | yyyy:2014, yy:14
     * M     | 月  | MM:09, M:9
     * d     | 日  | dd:09, d:9
     * H     | 小时 | HH:13, h:13
     * y     | 分钟 | mm:06, m:6
     * y     | 秒  | ss:06, s:6
     * e     | 星期 | e:天, ee:周日, eee: 星期天
     * 
     * > #### !注意
     * > 元字符区分大小写。
     */
    Date.prototype.format = function (format) {
        typeof console === "object" && console.assert(!format || typeof format === "string", "date.format([format: 必须是字符串])");
        var me = this, formators = Date._formators;
        if (!formators) {
            Date._formators = formators = {

                y: function (date, length) {
                    date = date.getFullYear();
                    return date < 0 ? 'BC' + (-date) : length < 3 ? date % 100 : date;
                },

                M: function (date) {
                    return date.getMonth() + 1;
                },

                d: function (date) {
                    return date.getDate();
                },

                H: function (date) {
                    return date.getHours();
                },

                m: function (date) {
                    return date.getMinutes();
                },

                s: function (date) {
                    return date.getSeconds();
                },

                e: function (date, length) {
                    return (length === 1 ? '' : length === 2 ? '周' : '星期') + [length === 2 ? '日' : '天', '一', '二', '三', '四', '五', '六'][date.getDay()];
                }

            };
        }
        return (format || 'yyyy/MM/dd HH:mm:ss').replace(/(\w)\1*/g, function (all, key) {
            if (key in formators) {
                key = String(formators[key](me, all.length));
                while (key.length < all.length) {
                    key = '0' + key;
                }
                all = key;
            }
            return all;
        });
    };

}

export module Date.from {

    /**
     * 将指定对象解析为日期对象。
     * @param {String/Date} value 要解析的对象。
     * @param {String} [format] 解析的格式。
     * 如果未指定，则支持标准的几种时间格式。
     * 如果指定了格式，则按照格式指定的方式解析。具体见下文。
     * @returns {Date} 返回分析出的日期对象。
     * @example
     * Date.parseDate("2014-1-1")
     * 
     * Date.parseDate("20140101")
     * 
     * Date.parseDate("2013年12月1日", "yyyy年MM月dd日")
     * @remark
     * #### 格式化语法
     * 格式化字符串中，以下元字符会被反向替换为对应的值。
     * 
     * 元字符 | 意义 | 实例
     * ------|-----|------
     * y     | 年  | 2014
     * M     | 月  | 9
     * d     | 日  | 9
     * H     | 小时 | 9
     * y     | 分钟 | 6
     * y     | 秒  | 6
     * 
     * > #### !注意
     * > 元字符区分大小写。
     */
    Date.from = function (value, format) {
        if (value && !(value instanceof Date)) {
            if (format) {
                var groups = [0],
                    obj = {},
                    match = new RegExp(format.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1').replace(/([yMdHms])\1*/g, function (all, w) {
                        groups.push(w);
                        return "\\s*(\\d+)?\\s*";
                    })).exec(value);
                if (match) {
                    for (var i = 1; i < match.length; i++) {
                        obj[groups[i]] = +match[i];
                    }
                }
                value = new Date(obj.y || new Date().getFullYear(), obj.M ? obj.M - 1 : new Date().getMonth(), obj.d || 1, obj.H || 0, obj.m || 0, obj.s || 0);
            } else {
                value = new Date(value) || new Date(String(value).replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3'));
            }

        }
        return value;
    };

}

export module addDay {

    /**
     * 在当前日期添加指定的天数并返回新日期。
     * @param {Number} value 要添加的天数。如果小于 0 则倒数指定天数。
     * @returns {Date} 返回新日期对象。
     * @example new Date().addDay(1)
     */
    Date.prototype.addDay = function (value) {
        return new Date(+this + value * 86400000);
    };

}

export module addMonth {

    /**
     * 在当前日期添加指定的月数。
     * @param {Number} value 要添加的月数。如果小于 0 则倒数指定月数。
     * @returns {Date} 返回新日期对象。
     * @example new Date().addMonth(1)
     */
    Date.prototype.addMonth = function (value) {
        var date = new Date(+this);
        date.setMonth(date.getMonth() + value);
        if (this.getDate() !== date.getDate()) {
            date.setDate(0);
        }
        return date;
    };

}

export module toDay {

    /**
     * 获取当前日期的日期部分。
     * @returns {Date} 返回新日期对象，其小时部分已被清零。
     * @example new Date().toDay()
     */
    Date.prototype.toDay = function () {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate());
    };

}

export module Date.now {

    /**
     * 获取当前时间的时间戳。
     * @returns {Number} 返回当前时间的时间戳。
     * @example Date.now(); // 相当于 new Date().getTime()
     * @since ES5
     */
    Date.now = Date.now || function () {
        return +new Date;
    };

}

export module Date.isLeapYear {

    /**
     * 判断指定的年份是否是闰年。
     * @param {Number} year 要判断的年份。
     * @returns {Boolean} 如果 @year 是闰年，则返回 @true，否则返回 @false。
     * @example Date.isLeapYear(2002) // false
     */
    Date.isLeapYear = function (year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    };

}

export module Date.isValid {

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

}

export module Date.getDayInMonth {

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

}

export module addMinute {

    /**
     * 在当前分钟添加指定的分钟数并返回新日期。
     * @param {Number} value 要添加的分钟数。如果小于 0 则倒数指定分钟数。
     * @returns {Date} 返回新日期对象。
     * @example new Date().addMinutes(1)
     */
    Date.prototype.addMinute = function (value) {
        return new Date(+this + value * 60000);
    };

}

export module Date.compareDay {

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

}

export module dayLeft {

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

}

export module clone {

    /**
     * 创建当前日期对象的副本。
     * @returns {Date} 返回新日期对象。
     * @example new Date().clone();
     */
    Date.prototype.clone = function () {
        return new Date(+this);
    };

}

export module addYear {

    /**
     * 在当前日期添加指定的年数。
     * @param {Number} value 要添加的年数。
     * @returns {Date} 返回新日期对象。
     * @example new Date().addYear(1)
     */
    Date.prototype.addYear = function (value) {
        return this.addMonth(value * 12);
    };

}

export module addWeek {

    /**
     * 在当前日期添加指定的周数。
     * @param {Number} value 要添加的周数。
     * @returns {Date} 返回新日期对象。
     * @example new Date().addWeek(1)
     */
    Date.prototype.addWeek = function (value) {
        return this.addDay(value * 7);
    };

}

export module getWeek {

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

}

export module getTimezone {

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

}

export module getFirstDay {

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

}

export module getLastDay {

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

}
