// #todo


interface String {

    trimRight(): string;

}

/**
 * 去除当前字符串结尾空格。
 * @returns {String} 返回新字符串。
 * @example "a  ".trimStart() // "a"
 * @since ES6
 */
String.prototype.trimRight = String.prototype.trimRight || function () {
    return this.replace(/\s+$/, '');
};
