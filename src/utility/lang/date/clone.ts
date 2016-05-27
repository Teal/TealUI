
/**
 * 创建当前日期对象的副本。
 * @returns {Date} 返回新日期对象。
 * @example new Date().clone();
 */
Date.prototype.clone = function () {
    return new Date(+this);
};
