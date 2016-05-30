
interface String {

    ellipsisByWord(): string;

}

/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。同时确保不强制分割单词。
 * @param {String} str 要处理的字符串。
 * @param {Number} length 最终期望的最大长度。
 * @example String.ellipsisByWord("abc def", 8) //   "abc..."
 */
String.ellipsisByWord = function (str, length) {
    typeof console === "object" && console.assert(!str || typeof str === "string", "String.ellipsisByWord(str: 必须是字符串, length)");
    if (str && str.length > length) {
        length -= 3;
        if (/[\x00-\xff]/.test(str.charAt(length))) {
            var p = str.lastIndexOf(' ', length);
            if (p !== -1) {
                length = p;
            }
        }
        str = str.substr(0, length) + '...';
    }
    return str || '';
};
