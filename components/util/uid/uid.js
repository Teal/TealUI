define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 生成用户唯一标识。
     * @param length 标识的长度。
     * @param chars 所有可用的字符。
     */
    function uid(length, chars) {
        if (length === void 0) { length = 36; }
        if (chars === void 0) { chars = "0123456789abcdef"; }
        var r = [chars.charAt(Date.now() % chars.length)];
        for (var i = 1; i < length; i++) {
            r[i] = chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return r.join("");
    }
    exports.default = uid;
});
//# sourceMappingURL=uid.js.map