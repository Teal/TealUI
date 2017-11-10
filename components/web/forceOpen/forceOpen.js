define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 在新窗口打开指定的地址，如果弹出窗口被阻止则等待下次点击后打开。
     * @param url 要打开的地址。
     * @example forceOpen("http://tealui.com/")
     */
    function forceOpen(url) {
        if (!window.open(url)) {
            var open_1 = function () {
                document.removeEventListener("click", open_1, false);
                window.open(url);
            };
            document.addEventListener("click", open_1, false);
        }
    }
    exports.default = forceOpen;
});
//# sourceMappingURL=forceOpen.js.map