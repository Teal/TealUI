define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 解析字符串为布尔值。
     * @param value 要解析的字符串。
     * @return 如果字符串为 `""`、`"false"`（不区分大小写）或 `"0"` 则返回 false，否则返回 true。
     * @example parse("false") // false
     * @example parse("False") // false
     * @example parse("true") // true
     */
    function parse(value) {
        return !!value && !/^(false|0)$/i.test(value);
    }
    exports.parse = parse;
});
//# sourceMappingURL=boolean.js.map