// #todo


interface String {

    /**
     * 重复当前字符串内容指定次数。
     * @returns 返回新字符串。
     * @example "a".repeat(4) // "aaaa"
     * @since ES6
     */
    repeat(): string;

}

if (!String.prototype.repeat) {

    /**
     * 重复当前字符串内容指定次数。
     * @returns {String} 返回新字符串。
     * @example "a".repeat(4) // "aaaa"
     * @since ES6
     */
    String.prototype.repeat || function (count) {
        return new Array(count + 1).join(this);
    };

}