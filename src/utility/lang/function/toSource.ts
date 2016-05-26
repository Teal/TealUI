
/**
 * 获取指定函数的源码。
 * @param {Function} fn 要获取的函数。
 * @returns {String} 返回函数源码。
 * @example Function.getSource(function(x){ return x; })
 */
Function.getSource = function (fn) {
    return fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
        return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
    });
};
