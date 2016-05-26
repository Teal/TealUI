
/**
 * 删除字符串的公共缩进部分。
 * @param {String} str 要处理的字符串。
 * @returns {String} 返回处理后的字符串。
 * @example String.removeLeadingWhiteSpaces("  a") // "a"
 */
String.removeLeadingWhiteSpaces = function (str) {
    typeof console === "object" && console.assert(typeof str === "string", "String.removeLeadingWhiteSpaces(str: 必须是字符串)");
    str = str.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
    var space = /^\s+/.exec(str), i;
    if (space) {
        space = space[0];
        str = str.split(/[\r\n]/);
        for (i = str.length - 1; i >= 0; i--) {
            str[i] = str[i].replace(space, "");
        }
        str = str.join('\r\n');
    }
    return str;
}
