
/**
 * 对指定的字符串进行 GB2312 编码。
 * @param {String} str 要转换的字符串。
 * @returns {String} 转换后的字符串。
 * @example encodeGB2312("你") // "%C4%E3"
 */
function encodeGB2312(str) {
    typeof console === "object" && console.assert(typeof str === "string", "encodeGB2312(str: 必须是字符串)");
    var result = "";
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i) - 0x4e00;
        if (c >= 0) {
            c = encodeGB2312.dictionary[c];
            result += "%" + c.substr(0, 2) + "%" + c.substr(2);
        } else {
            c = str.charAt(i);
            if (c == " ") {
                result += "+";
            } else {
                result += escape(c);
            }
        }
    }
    return result;
}
