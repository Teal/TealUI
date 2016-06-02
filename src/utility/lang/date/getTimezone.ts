// #todo


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
