// #todo


/**
 * 对指定的字符串进行 UTF-8 解码。
 * @param {String} str 要转换的字符串。
 * @returns {String} 转换后的字符串。
 * @example decodeUTF8("\\u4f60") // "你"
 */
function decodeUTF8(str) {
    typeof console === "object" && console.assert(typeof str === "string", "decodeUTF8(str: 必须是字符串)");
    return str.replace(/\\u(\w{4}|\w{2})/gi, function (_, unicode) {
        return String.fromCharCode(parseInt(unicode, 16));
    });
}
