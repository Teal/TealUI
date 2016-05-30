
interface String {

    /**
     * 删除字符串内的重复字符。
     * @returns 返回新字符串。
     * @example "aabbcc".unique() // "abc"
     */
    unique(): string;

}

/**
 * 删除字符串内的重复字符。
 * @returns 返回新字符串。
 * @example "aabbcc".unique() // "abc"
 */
String.prototype.unique = function () {
    return this.replace(/(^|\s)(\S+)(?=\s(?:\S+\s)*\2(?:\s|$))/g, '');
};
