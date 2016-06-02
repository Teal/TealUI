// #todo


/**
 * 判断一个对象是否是函数。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是函数则返回 @true，否则返回 @false。
 * @example
 * Function.isFunction(function () {}); // true
 * 
 * Function.isFunction(null); // false
 * 
 * Function.isFunction(new Function); // true
 */
Function.isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
}
