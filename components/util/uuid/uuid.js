define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 随机生成新的通用唯一识别码（UUID）。
     * @return 返回全小写的 UUID。
     */
    function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var v = Math.random() * 16 | 0;
            return (c == "x" ? v : (v & 0x3 | 0x8)).toString(16);
        });
    }
    exports.default = uuid;
});
//# sourceMappingURL=uuid.js.map