define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 禁用 TAB 切换焦点并改为输入。
     * @param elem 输入框元素。
     * @param tab 按下 TAB 键后要输入的内容。
     */
    function disableTab(elem, tab) {
        if (tab === void 0) { tab = "\t"; }
        elem.addEventListener("keydown", function (e) {
            if (e.keyCode == 9) {
                e.preventDefault();
                elem.ownerDocument.execCommand("insertHTML", false, tab);
            }
        }, false);
    }
    exports.default = disableTab;
});
//# sourceMappingURL=disableTab.js.map