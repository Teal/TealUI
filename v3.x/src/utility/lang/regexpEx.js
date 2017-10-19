/**
 * @author xuld
 */

// #region @RegExp.isRegExp

/**
 * 判断一个对象是否是正则。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是正则则返回 @true，否则返回 @false。
 * @example RegExp.isRegExp("") // true
 */
RegExp.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
};

// #endregion
