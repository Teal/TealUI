define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 让文本域随输入内容自动调整高度。
     * @param elem 文本域元素。
     */
    function autoResizeTextArea(elem) {
        var min = elem.offsetHeight;
        function autoResize() {
            elem.style.height = "auto";
            elem.style.height = Math.max(min, elem.scrollHeight) + "px";
        }
        elem.style.overflow = "hidden";
        elem.addEventListener("keydown", autoResize, false);
        elem.addEventListener("input", autoResize, false);
        elem.addEventListener("keyup", autoResize, false);
        autoResize();
    }
    exports.default = autoResizeTextArea;
});
//# sourceMappingURL=autoResizeTextArea.js.map