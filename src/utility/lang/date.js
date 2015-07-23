/**
 * @fileOverview 提供日期操作的辅助函数。
 * @author xuld
 */

// #region @Date#format

/**
 * 将日期对象格式化为字符串。
 * @param {String} [format="yyyy/MM/dd HH:mm:ss"] 日期的格式，其中的元字符会被替换。支持的元字符见下表：
 * 
 * 元字符 | 意义 | 实例
 * y     | 年  | yyyy:2014, yy:14
 * M     | 月  | MM:09, M:9
 * d     | 日  | dd:09, d:9
 * H     | 小时 | HH:13, h:13
 * y     | 分钟 | mm:06, m:6
 * y     | 秒  | ss:06, s:6
 * e     | 星期 | e:天, ee:周日, eee: 星期天
 * 
 * <blockquote class="doc-note"><h4>注意</h4>元字符区分大小写。</blockquote>
 * 
 * @returns {String} 格式化后的字符串。
 * @example new Date().format("yyyy/MM/dd HH:mm:ss")
 */
Date.prototype.format = function (format) {
    var me = this, formators = Date._formators;
    if (!formators) {
        Date._formators = formators = {

            y: function (date, length) {
                date = date.getFullYear();
                return date < 0 ? 'BC' + (-date) : length < 3 && date < 2000 ? date % 100 : date;
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
            key = formators[key](me, all.length);
            while (key.length < all.length) key = '0' + key;
            all = key;
        }
        return all;
    });
};

// #endregion

// #region @Date.parseDate

/**
 * 将指定对象解析为日期对象。
 * @param {String/Date} value 要解析的对象。
 * @param {String} [format] 解析的格式。
 * 如果未指定格式，则支持标准的几种时间格式。
 * 如果指定了格式，则其中的元字符会被提取。支持的元字符见下表：
 * 
 * 元字符 | 意义 | 实例
 * y     | 年  | 2014
 * M     | 月  | 9
 * d     | 日  | 9
 * H     | 小时 | 9
 * y     | 分钟 | 6
 * y     | 秒  | 6
 * 
 * <blockquote class="doc-note"><h4>注意</h4>元字符区分大小写。</blockquote>
 * 
 * @returns {Date} 返回分析出的日期对象。
 * @example
 * Date.parseDate("2014-1-1")
 * Date.parseDate("2013年12月1日", "yyyy年MM月dd日")
 */
Date.parseDate = function (value, format) {
    if (value && !(value instanceof Date)) {
        if (format) {
            var groups = [0],
                obj = {},
                match = new RegExp(format.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1').replace(/([yMdHms])\1*/g, function (all, w) {
                    groups.push(w);
                    return "\\s*(\\d+)?\\s*";
                })).exec(value),
                i;
            if (match)
                for (i = 1; i < match.length; i++)
                    obj[groups[i]] = +match[i];
            value = new Date(obj.y || new Date().getFullYear(), obj.M ? obj.M - 1 : new Date().getMonth(), obj.d || 1, obj.H || 0, obj.m || 0, obj.s || 0);
        } else {
            value = new Date(value.constructor === String ? value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3') : value);
        }

    }
    return value;
};

// #endregion

// #region @Date#addDay

/**
 * 在当前日期添加指定的天数并返回新日期。
 * @param {Number} value 要添加的天数。如果小于 0 则倒数指定天数。
 * @returns {Date} 返回新日期对象。
 * @example new Date().addDay(1)
 */
Date.prototype.addDay = function (value) {
    return new Date(+this + value * 86400000);
};

// #endregion

// #region @Date#addMonth

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

// #endregion

// #region @Date#toDay

/**
 * 获取当前日期的日期部分。
 * @returns {Date} 返回新日期对象，其小时部分已被清零。
 * @example new Date().toDay()
 */
Date.prototype.toDay = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

// #endregion
