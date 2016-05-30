
interface String {

    clean(): string;

}

/**
 * 删除当前字符串内所有空格。
 * @returns {String} 返回新字符串。
 * @example " a b   ".clean() // "ab"
 */
String.prototype.clean = function () {
    return this.replace(/\s+/g, ' ');
};
