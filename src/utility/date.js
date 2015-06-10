/**
 * @author xuld
 * @fileOverview 提供日期操作的辅助函数。
 */

/**
 * 提供日期格式化参数扩展支持。
 */
Date.formators = {

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

/**
 * 尝试从指定对象中分析出日期对象。
 * @param {String/Date} value 要分析的对象。
 * @returns {date} 返回分析出的日期对象。
 */
Date.from = function (value) {
    if (value && !(value instanceof Date)) {
        value = new Date(value.constructor === String ? value.replace(/(\d{4})\D*(\d\d?)\D*(\d\d?)/, '$1/$2/$3') : value);
    }
    return value;
};

/**
 * 将日期对象格式化为字符串。
 * @param {String} format 日期的格式。默认为 yyyy/MM/dd HH:mm:ss。y: 年, M: 月, d: 天, H: 小时（24小时制）,m:分, s:秒, e:星期
 * @return {String} 格式化后的字符串。
 */
Date.prototype.format = function (format) {
    var me = this;
    return (format || 'yyyy/MM/dd HH:mm:ss').replace(/(\w)\1*/g, function (all, key) {
        if (key in Date.formators) {
            key = '' + Date.formators[key](me, all.length);
            while (key.length < all.length) {
                key = '0' + key;
            }
            all = key;
        }
        return all;
    });
};

/**
 * 在当前日期添加指定的天数。
 * @param {Number} value 要添加的天数。
 * @returns {Date} 返回处理后的新日期对象。
 */
Date.prototype.addDay = function (value) {
    return new Date(+this + value * 86400000);
};

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

/**
 * 获取当前日期的无小时部分。
 * @returns {Date} 返回处理后的新日期对象。
 */
Date.prototype.toDay = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};
