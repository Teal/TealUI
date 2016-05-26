
/**
 * 将字符串首字母大写。
 * @returns {String} 返回新字符串。
 * @example "qwert".capitalize() // "Qwert"
 */
String.prototype.capitalize = function () {
    return this.replace(/(\b[a-z])/g, function (w) {
        return w.toUpperCase();
    });
};
