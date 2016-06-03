// #todo


interface StringConstructor {

    ellipsisByWord(): string;

}

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。同时确保不强制分割单词。
 * @param {String} value 要处理的字符串。
 * @param {Number} length 最终期望的最大长度。
 * @example String.ellipsisByWord("abc def", 8) //   "abc..."
 */
String.ellipsisByWord = function (value: string, length) {
    typeof console === "object" && console.assert(!value || typeof value === "string", "String.ellipsisByWord(str: 必须是字符串, length)");
    if (value && value.length > length) {
        length -= 3;
        if (/[\x00-\xff]/.test(value.charAt(length))) {
            var p = value.lastIndexOf(' ', length);
            if (p !== -1) {
                length = p;
            }
        }
        value = value.substr(0, length) + '...';
    }
    return value || '';
};
