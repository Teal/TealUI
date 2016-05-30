
interface String {

    right(): string;

}

/**
 * 获取字符串右边指定长度的子字符串。
 * @param {Number} length 要获取的子字符串长度。
 * @returns {String} 返回字符串右边 @length 长度的子字符串。
 * @example "abcde".right(3); // "cde"
 */
String.prototype.right = function (length) {
    return this.substr(this.length - length, length);
};
