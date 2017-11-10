define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 绑定指定的元素的 Ctrl/Command+回车事件。
     * @param elem 元素。
     * @param callback 要设置的回调函数。
     * @example ctrlEnter(elem, () => { console.log("CTRL+ENTER") })
     */
    function ctrlEnter(elem, callback) {
        elem.addEventListener("keypress", function (e) {
            if ((e.ctrlKey || e.metaKey) && (e.which === 13 || e.which === 10)) {
                callback(e);
            }
        }, false);
    }
    exports.default = ctrlEnter;
});
//# sourceMappingURL=ctrlEnter.js.map