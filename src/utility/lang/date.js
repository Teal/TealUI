/**
 * @fileOverview 提供日期操作的辅助函数。
 * @author xuld
 */

// #region @Date#format

/**
 * 将日期对象格式化为字符串。
 * @param {String} format 日期的格式。默认为 yyyy/MM/dd HH:mm:ss。y: 年, M: 月, d: 天, H: 小时（24小时制）,m:分, s:秒, e:星期
 * @return {String} 格式化后的字符串。
 */
Date.prototype.format = function (format) {
    var formators = Date._formators;
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
    var me = this;
    return (format || 'yyyy/MM/dd HH:mm:ss').replace(/(\w)\1*/g, function (all, key) {
        if (key in formators) {
            key = '' + formators[key](me, all.length);
            while (key.length < all.length) {
                key = '0' + key;
            }
            all = key;
        }
        return all;
    });
};

// #endregion

// #region @Date.from

/**
 * 尝试从指定对象中分析出日期对象。（支持格式解析）
 * @param {String/Date} value 要分析的对象。
 * @param {String} [format] 对应的格式。
 * @returns {Date} 返回分析出的日期对象。
 */
Date.from = function (value, format) {
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
 * 在当前日期添加指定的天数。
 * @param {Number} value 要添加的天数。
 * @returns {Date} 返回处理后的新日期对象。
 */
Date.prototype.addDay = function (value) {
    return new Date(+this + value * 86400000);
};

// #endregion

// #region @Date#addMonth

/**
 * 在当前日期添加指定的月数。
 * @param {Number} value 要添加的月数。
 * @returns {Date} 返回处理后的新日期对象。
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
 * 获取当前日期的无小时部分。
 * @returns {Date} 返回处理后的新日期对象。
 */
Date.prototype.toDay = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

// #endregion
