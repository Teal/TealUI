define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 获取手机号码所属的移动运营商。
     * @param mobile 手机号码。
     * @return 返回运营商英文标识。
     */
    function getMNO(mobile) {
        if (/^(?:134[0-8]|13[5-9]|147|15[0-27-9]|178|18[2-478])/.test(mobile)) {
            return "chinaMobile";
        }
        if (/^(?:13[0-2]|145|15[56]|176|18[56])/.test(mobile)) {
            return "chinaUnion";
        }
        if (/^170([059])/.test(mobile)) {
            return "chinaTelcom";
        }
        return "unknown";
    }
    exports.default = getMNO;
});
//# sourceMappingURL=chineseMNO.js.map