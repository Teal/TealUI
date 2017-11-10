define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 测试密码的复杂度。
     * @param value 要测试的密码。
     * @return 返回一个整数。值越大表示复杂度越高。具体范围如下：
     * - < 0：太简单（如 123456）。
     * - = 0：简单（如 901206）。
     * - \> 0：复杂（如 abc123）。
     * - \>= 3：很复杂（如 a1b2c3）。
     * @example checkPassword("123456") // -1
     */
    function checkPassword(value) {
        value = value.replace(/1q2w(?:3e(?:4r(?:5t)?)?)?/, "1")
            .replace(/(?:qwe(?:rty(?:ui)?)?)+/, "q")
            .replace(/(?:asd(?:fgh(?:jk)?)?)+/, "a")
            .replace(/1?qaz(?:1?qaz|2?wsx)?/, "q")
            .replace(/(?:147|258|369)+/, "1")
            .replace(/[a-zA-Z]+123/, "1")
            .replace(/(?:123){2,}/, "1")
            .replace(/7891?0/, "789")
            .replace(/\.1415/, "5");
        var complexLevel = Math.floor(value.length / 10);
        var equalCount = 0;
        var chainCount = 0;
        var oldCharCode;
        var oldCharType;
        for (var i = 0; i < value.length; i++) {
            var newCharCode = value.charCodeAt(i);
            var newCharType = newCharCode >= 48 && newCharCode <= 57 ? 0 : newCharCode >= 97 && newCharCode <= 122 ? 1 : newCharCode >= 65 && newCharCode <= 90 ? 2 : 3;
            if (i) {
                if (oldCharType !== newCharType) {
                    complexLevel++;
                }
                else if (Math.abs(newCharCode - oldCharCode) <= 1) {
                    if (newCharCode === oldCharCode) {
                        equalCount++;
                    }
                    else {
                        chainCount++;
                    }
                }
            }
            oldCharCode = newCharCode;
            oldCharType = newCharType;
        }
        return complexLevel - (value.length - equalCount <= 1 ? 2 : value.length - chainCount <= 1 ? 1 : 0);
    }
    exports.default = checkPassword;
});
//# sourceMappingURL=checkPassword.js.map