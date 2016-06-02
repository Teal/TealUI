// #todo


interface String {

    left(): string;

}

/**
 * 获取字符串左边指定长度的子字符串。
 * @param {Number} length 要获取的子字符串长度。
 * @returns {String} 返回字符串左边 @length 长度的子字符串。
 * @example "abcde".left(3) // "abc"
 */
String.prototype.left = function (length) {
    return this.substr(0, length);
};
