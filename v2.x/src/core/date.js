/**
 * @author xuld
 * @fileOverview 提供日期操作的辅助函数。
 */

Date.prototype.toStdString = Date.prototype.toString;

/**
 * 改写 Date.toString 以实现支持 yyyy/MM/dd hh:mm:ss 格式化时间。
 * @param {String} format 格式。
 * @return {String} 字符串。
 */
Date.prototype.toString = function ( /*String?*/format) {
    var me = this,
        formats = {
            d: 'getDate',
            h: 'getHours',
            m: 'getMinutes',
            s: 'getSeconds'
        };

    return format ? format.replace(/(yy|M|d|h|m|s)\1?/g, function (matched, val) {
        if (val.length > 1) {
            val = me.getFullYear();
            return matched.length > 2 ? val : (val % 100);
        }
        val = val === 'M' ? me.getMonth() + 1 : me[formats[val]]();
        return val <= 9 && matched.length > 1 && ("0" + val) || val;
    }) : me.toStdString();
};

/**
 * 在当前日期添加指定的天数。
 * @param {Number} value 要添加的天数。
 */
Date.prototype.addDay = function (/*Number*/value) {
    this.setDate(this.getDate() + value);
    return this;
};
