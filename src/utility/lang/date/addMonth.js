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
