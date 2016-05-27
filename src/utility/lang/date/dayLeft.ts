
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
