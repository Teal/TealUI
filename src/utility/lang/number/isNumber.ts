// #todo


/**
 * 判断一个对象是否是数字。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果是数字则返回 @true，否则返回 @false。
 * @example Number.isNumber(7) // true
 */
Number.isNumber = function (obj) {
    return typeof obj === 'number' && !isNaN(obj);
}
