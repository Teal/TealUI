define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 使用位移加密字符串。
     * @param value 要加密的字符串。
     * @param key 加密的密钥。
     * @return 返回加密后的字符串。
     * @example encryptString("abc", 123) // "``e"
     */
    function encryptString(value, key) {
        if (key === void 0) { key = 19901206; }
        var end = value.length - 1;
        var rkey = ~key;
        var t = [];
        for (var i = 0; i <= end; i++) {
            t[i] = String.fromCharCode(~((value.charCodeAt(i) & rkey | (i === end ? value.charCodeAt(0) : value.charCodeAt(i + 1)) & key) ^ ~(i + end)));
        }
        return t.join("");
    }
    exports.encryptString = encryptString;
    /**
     * 解密使用位移加密的字符串。
     * @param value 要解密的字符串。
     * @param key 解密的密钥。
     * @return 返回解密后的字符串。
     * @example dencryptString("abc", 123) // "cce"
     */
    function dencryptString(value, key) {
        if (key === void 0) { key = 19901206; }
        var end = value.length - 1;
        var rkey = ~key;
        var t = [];
        for (var i = end; i >= 0; i--) {
            t[i] = ~(value.charCodeAt(i) ^ (~(i + end)));
        }
        var last = t[end];
        for (var i = end; i >= 0; i--) {
            t[i] = ((t[i] & rkey) | ((i === 0 ? last : (t[i - 1])) & key));
        }
        for (var i = end; i >= 0; i--) {
            t[i] = String.fromCharCode(t[i]);
        }
        return t.join("");
    }
    exports.dencryptString = dencryptString;
});
//# sourceMappingURL=encryptString.js.map