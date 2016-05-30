
interface String {

    startsWith(): string;

}

/**
 * 判断当前字符串是否以某个特定字符串开头。
 * @param {String} str 开头的字符串。
 * @returns {Boolean} 返回符合要求则返回 @true，否则返回 @false。
 * @example "1234567".startsWith("123") // true
 */
String.prototype.startsWith = String.prototype.startsWith || function (str) {
    typeof console === "object" && console.assert(typeof str === "string", "string.startsWith(str: 必须是字符串)");
    return this.substr(0, str.length) === str;
};
