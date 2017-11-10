define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 禁止指定元素的浏览器默认右键菜单。
     * @param elem 元素。
     */
    function noContextMenu(elem) {
        if (elem === void 0) { elem = document; }
        elem.addEventListener("contextmenu", function (e) { return e.preventDefault(); });
    }
    exports.default = noContextMenu;
});
//# sourceMappingURL=noContextMenu.js.map