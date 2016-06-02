// #todo


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
