// #todo


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
