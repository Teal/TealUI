
/**
 * 串联多个函数并返回一个将依次执行串联的函数新函数。
 * @param {Function} ... 要串联的函数。
 * @returns {Functin} 返回一个新函数。该函数无返回值。
 * @example Function.concat(function(){}, function(){})()
 */
Function.concat = function () {
    var s = Array.prototype.slice.call(arguments, 0);
    return function () {
        for (var i = 0; i < s.length; i++) {
            typeof console === "object" && console.assert(!s[i] || s[i] instanceof Function, "Function.concat(...: 必须是函数)");
            s[i] && s[i].apply(this, arguments);
        }
    };
};
