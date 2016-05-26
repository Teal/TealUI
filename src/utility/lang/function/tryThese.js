/**
 * 运行多个函数，如果函数发生异常则继续执行下一个函数，否则返回其返回值。
 * @param {Funcion} ... 要运行的函数。
 * @returns {Object} 返回第一个未发生异常函数的返回值。如果所有函数都发生异常则返回 @undefined。
 * @example
 * var xhr = Function.tryThese(function(){
 *      return new ActiveXObject("Microsoft.XMLHttp");
 * }, function(){
 *      return new XMLHttpRequest();
 * })
 */
Function.tryThese = function () {
    var result;
    for (var i = 0, l = arguments.length; i < l; i++) {
        typeof console === "object" && console.assert(arguments[i] instanceof Function, "Function.tryThese(...: 必须是函数)");
        try {
            result = arguments[i].apply(this, arguments);
        }
        catch (e) { }
    }
    return result;
};
