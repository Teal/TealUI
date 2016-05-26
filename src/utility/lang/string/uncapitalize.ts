
/**
 * 将字符串首字母小写。
 * @returns {String} 返回新字符串。
 * @example "Qwert".uncapitalize() // "qwert"
 */
String.prototype.uncapitalize = function () {
    return this.replace(/(\b[A-Z])/g, function (w) {
        return w.toLowerCase();
    });
};
