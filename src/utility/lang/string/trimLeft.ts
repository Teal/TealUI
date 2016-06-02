// #todo


interface String {

    trimLeft(): string;

}

/**
 * 去除当前字符串开始空格。
 * @returns {String} 返回新字符串。
 * @example "  a".trimStart() // "a"
 * @since ES6
 */
String.prototype.trimLeft = String.prototype.trimLeft || function () {
    return this.replace(/^\s+/, '');
};
