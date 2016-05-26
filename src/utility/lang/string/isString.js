/**
 * 判断一个对象是否是字符串。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是字符串则返回 @true，否则返回 @false。
 * @example String.isString("") // true
 */
String.isString = function (obj) {
    return typeof obj === 'string';
};
