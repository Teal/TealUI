
interface StringConstructor {

    /**
     * 删除字符串的公共缩进部分。
     * @param str 要处理的字符串。
     * @returns 返回处理后的字符串。
     * @example String.removeLeadingWhiteSpaces("  a\n  b") // "a\nb"
     */
    removeLeadingWhiteSpaces(str: string): string;

}

/**
 * 删除字符串的公共缩进部分。
 * @param str 要处理的字符串。
 * @returns 返回处理后的字符串。
 * @example String.removeLeadingWhiteSpaces("  a\n  b") // "a\nb"
 */
String.removeLeadingWhiteSpaces = function (str: string) {
    str = str.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
    let space = /^\s+/.exec(str), i;
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
