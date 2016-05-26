
/**
 * 将字符串转为骆驼规则（如 fontSize）。
 * @returns {String} 处理后的字符串。
 * @example
 * <pre>
 * "font-size".toCamelCase() // "fontSize"
 * </pre>
 */
String.prototype.toCamelCase = function () {
    return this.replace(/-(\w)/g, function (w) {
        return w.toUpperCase();
    });
};
