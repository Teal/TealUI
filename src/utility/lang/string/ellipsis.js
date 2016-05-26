/**
 * 将字符串限定在指定长度内，超出部分用 ... 代替。
 * @param {String} str 要处理的字符串。
 * @param {Number} length 最终期望的最大长度。
 * @example
 * String.ellipsis("1234567", 6) //   "123..."
 *
 * String.ellipsis("1234567", 9) //   "1234567"
 */
String.ellipsis = function (str, length) {
    typeof console === "object" && console.assert(!str || typeof str === "string", "String.ellipsis(str: 必须是字符串, length)");
    return str ? str.length > length ? str.substr(0, length - 3) + "..." : str : "";
};
