// #todo


interface String {

    endsWith(): string;

}

/**
 * 判断当前字符串是否以某个特定字符串结尾。
 * @param {String} str 开头的字符串。
 * @returns {Boolean} 返回符合要求则返回 @true，否则返回 @false。
 * @example "1234567".endsWith("67") // true
 */
String.prototype.endsWith = String.prototype.endsWith || function (str) {
    typeof console === "object" && console.assert(typeof str === "string", "string.endsWith(str: 必须是字符串)");
    return this.substr(this.length - str.length) === str;
};
