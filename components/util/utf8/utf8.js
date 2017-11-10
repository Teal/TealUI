define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 使用 UTF-8 编码字符串。
     * @param value 要编码的字符串。
     * @return 返回编码后的字符串，使用 JavaScript 转义格式。
     * @example encodeUTF8("你") // "\\u4f60"
     */
    function encodeUTF8(value) {
        var r = "";
        for (var i = 0; i < value.length; i++) {
            var t = value.charCodeAt(i).toString(16);
            r += "\\u" + new Array(5 - t.length).join("0") + t;
        }
        return r;
    }
    exports.encodeUTF8 = encodeUTF8;
    /**
     * 解码使用 UTF-8 编码的字符串。
     * @param value 要解码的字符串。
     * @return 返回解码后的字符串。
     * @example decodeUTF8("\\u4f60") // "你"
     */
    function decodeUTF8(value) {
        return value.replace(/\\u(\w{4}|\w{2})/gi, function (_, unicode) { return String.fromCharCode(parseInt(unicode, 16)); });
    }
    exports.decodeUTF8 = decodeUTF8;
});
//# sourceMappingURL=utf8.js.map