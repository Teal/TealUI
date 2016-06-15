/**
 * @fileOverview 日期(Date)扩展
 * @author xuld@vip.qq.com
 * @keywords 时间, time, 刚刚, 天前
 * @description 提供 JavaScript 内置对象 Date 的扩展 API。
 * @namespace Date
 */

// #region 语言内置

/**
 * 获取当前时间的时间戳。
 * @returns 返回当前时间的时间戳。
 * @example Date.now(); // 相当于 new Date().getTime()
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 */
export function now() {
    return +new Date;
}

// #endregion

// #region 日期格式化和转换

/**
 * 将日期对象格式化为字符串。
 * @param formatString 格式字符串。具体见下文。
 * @returns 格式化后的字符串。
 * @example new Date().format("yyyy/MM/dd HH:mm:ss")
 * @see https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
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
 * > 注意：元字符区分大小写。
 */
export function format(_this: Date, formatString = 'yyyy/MM/dd HH:mm:ss') {
    let formators = format.formators;
    if (!formators) {
        format.formators = formators = {

            y: (date, length) => {
                let year = date.getFullYear();
                return year < 0 ? '公元前' + (-year) : length < 3 ? year % 100 : year;
            },

            M: date => date.getMonth() + 1,

            d: date => date.getDate(),

            H: date => date.getHours(),

            m: date => date.getMinutes(),

            s: date => date.getSeconds(),

            e: (date, length) => (length === 1 ? '' : length === 2 ? '周' : '星期') + [length === 2 ? '日' : '天', '一', '二', '三', '四', '五', '六'][date.getDay()]

        };
    }
    return formatString.replace(/(\w)\1*/g, (all: string, key: string) => {
        if (key in formators) {
            key = String(formators[key](_this, all.length));
            while (key.length < all.length) {
                key = '0' + key;
            }
            all = key;
        }
        return all;
    });
}

export namespace format {
    export var formators: { [key: string]: (date: Date, length: number) => number | string };
}

/**
 * 将指定对象解析为日期对象。
 * @param value 要解析的对象。
 * @param formatString 解析的格式。
 * 如果未指定，则支持标准的几种时间格式。
 * 如果指定了格式，则按照格式指定的方式解析。具体见下文。
 * @returns 返回分析出的日期对象。
 * @example Date.from("2014-1-1")
 * @example Date.from("20140101")
 * @example Date.from("2013年12月1日", "yyyy年MM月dd日")
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
 * > 注意: 元字符区分大小写。
 */
export function from(value, formatString) {
    if (value && !(value instanceof Date)) {
        if (formatString) {
            let groups = [0];
            let obj: any = {};
            const match = new RegExp(formatString.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1')
                .replace(/([yMdHms])\1*/g, (all, w) => {
                    groups.push(w);
                    return "\\s*(\\d+)?\\s*";
                })).exec(value);
            if (match) {
                for (let i = 1; i < match.length; i++) {
                    obj[groups[i]] = +match[i];
                }
            }
            value = new Date(obj.y || new Date().getFullYear(), obj.M ? obj.M - 1 : new Date().getMonth(), obj.d || 1, obj.H || 0, obj.m || 0, obj.s || 0);
        } else {
            value = new Date(value) || new Date(String(value).replace(/(\d{4})\D*(\d\d?)\D*(\d\d?).*(\d\d?)\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3 $4:$5:$6').replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3'));
        }

    }
    return value;
}

/**
 * 创建当前日期对象的副本。
 * @returns 返回新日期对象。
 * @example new Date().clone();
 */
export function clone(_this: Date) {
    return new Date(+_this);
}

// #endregion

// #region 日期计算

/**
 * 在当前日期添加指定的天数并返回新日期。
 * @param value 要添加的天数。如果小于 0 则倒数指定天数。
 * @returns 返回新日期对象。
 * @example new Date().addDay(1)
 */
export function addDay(_this: Date, value: number) {
    return new Date(+_this + value * 86400000);
}

/**
 * 在当前日期添加指定的月数。
 * @param value 要添加的月数。如果小于 0 则倒数指定月数。
 * @returns 返回新日期对象。
 * @example new Date().addMonth(1)
 */
export function addMonth(_this: Date, value: number) {
    var date = new Date(+_this);
    date.setMonth(date.getMonth() + value);
    if (_this.getDate() !== date.getDate()) {
        date.setDate(0);
    }
    return date;
}

/**
 * 在当前日期添加指定的年数。
 * @param value 要添加的年数。
 * @returns 返回新日期对象。
 * @example new Date().addYear(1)
 */
export function addYear(_this: Date, value: number) {
    return addMonth(_this, value * 12);
}

/**
 * 在当前分钟添加指定的分钟数并返回新日期。
 * @param value 要添加的分钟数。如果小于 0 则倒数指定分钟数。
 * @returns 返回新日期对象。
 * @example new Date().addMinutes(1)
 */
export function addMinute(_this: Date, value: number) {
    return new Date(+_this + value * 60000);
}

/**
 * 在当前日期添加指定的周数。
 * @param value 要添加的周数。
 * @returns 返回新日期对象。
 * @example new Date().addWeek(1)
 */
export function addWeek(_this: Date, value: number) {
    return addDay(_this, value * 7);
}

/**
 * 获取当前日期的日期部分。
 * @returns 返回新日期对象，其小时部分已被清零。
 * @example new Date().toDay()
 */
export function toDay(_this: Date) {
    return new Date(_this.getFullYear(), _this.getMonth(), _this.getDate());
}

/**
 * 计算当前日期到同年某月某日的剩余天数。如果今年指定日期已过，则计算到明年同月日的剩余天数。
 * @param month 月。
 * @param day 天。
 * @returns 返回剩余天数。
 * @example new Date().dayLeft(12, 5)
 */
export function dayLeft(_this: Date, month: number, day: number) {
    const date = new Date(_this.getFullYear(), _this.getMonth(), _this.getDate());
    let offset = new Date(_this.getFullYear(), month - 1, day) as any - (date as any);
    if (offset < 0) offset = new Date(_this.getFullYear() + 1, month - 1, day) as any - (date as any);
    return offset / 86400000;
}

/**
 * 获取两个日期相差的天数。
 * @param dateX 比较的第一个日期。
 * @param dateY 比较的第二个日期
 * @returns 返回 *dateY* 减去 *dateX* 相差的天数。不足一天的部分被忽略。
 * @example Date.compareDay(new Date(2014, 1, 1), new Date(2014, 1, 2)) // 1
 */
export function compareDay(dateX, dateY) {
    return Math.floor((dateY - dateX) / 86400000);
}

// #endregion

// #region 日期判断和读取

/**
 * 判断指定的年份是否是闰年。
 * @param year 要判断的年份。
 * @returns 如果 *year* 是闰年，则返回 true，否则返回 false。
 * @example Date.isLeapYear(2004) // true
 * @example Date.isLeapYear(2000) // true
 * @example Date.isLeapYear(2100) // false
 * @example Date.isLeapYear(2002) // false
 */
export function isLeapYear(year: number) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

/**
 * 判断指定的数值所表示的日期是否合法。（如2月30日是不合法的）
 * @param year 要判断的年。
 * @param month 要判断的月。
 * @param day 要判断的日。
 * @param hour 要判断的时。
 * @param minute 要判断的分。
 * @param second 要判断的秒。
 * @param milliSecond 要判断的毫秒。
 * @returns 如果指定的数值合法则返回 true，否则返回 false。
 * @example Date.isValid(2004, 2, 29) // true
 */
export function isValid(year: number, month: number, day = 1, hour = 0, minute = 0, second = 0, milliSecond = 0) {
    const date = new Date(year, month - 1, day, hour, minute, second, milliSecond);
    return year === date.getFullYear() && month === date.getMonth() + 1 && day === date.getDate() && hour === date.getHours() && minute === date.getMinutes() && second === date.getSeconds() && milliSecond === date.getMilliseconds();
}

/**
 * 获取指定年的指定月有多少天。
 * @param year 指定的年。
 * @param month 指定的月。
 * @returns 返回指定年的指定月的天数。
 * @example Date.getDayInMonth(2001, 2) // 28
 */
export function getDayInMonth(year: number, month: number) {
    return (new Date(year, month) as any - (new Date(year, month - 1) as any)) / 86400000;
}

/**
 * 获取当前日期的周数。
 * @param date 作为第一周的日期。如果未指定则使用今年第一天作为第一周。
 * @returns 返回周数。
 * @example new Date(2014, 2, 1).getWeek(new Date(2014, 1, 1)) // 3
 * @example new Date(2014, 2, 1).getWeek() // 9
 */
export function getWeek(_this: Date, date = new Date(_this.getFullYear(), 0, 1)) {
    return Math.floor((_this as any) - (date as any) / 604800000) + 1;
}


/**
 * 获取当前日期的时区部分。
 * @returns 返回时区部分。
 * @example new Date().getTimezone() // "GMT"
 */
export function getTimezone(_this: Date) {
    return _this.toString()
        .replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
        .replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
}

/**
 * 获取当月第一天。
 * @returns 返回新日期对象。
 * @example new Date().toFirstDay()
 */
export function toFirstDay(_this: Date) {
    var result = new Date(+_this);
    result.setDate(1);
    return result;
}

/**
 * 获取当月最后一天。
 * @returns 返回新日期对象。
 * @example new Date().toLastDay()
 */
export function toLastDay(_this: Date) {
    var result = new Date(+_this);
    result.setDate(1);
    result.setMonth(result.getMonth() + 1);
    result.setDate(result.getDate() - 1);
    return result;
}

// #endregion
