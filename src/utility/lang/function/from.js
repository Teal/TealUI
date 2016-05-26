/**
 * 返回一个新函数，这个函数始终返回指定值。
 * @param {Object} value 新函数的返回值。
 * @returns {Function} 返回一个新函数，这个函数始终返回指定值。
 * @example Function.from(false)() // false
 */
Function.from = function (value) {
    return function () {
        return value;
    };
};
