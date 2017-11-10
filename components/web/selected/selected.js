define(["require", "exports", "web/dom"], function (require, exports, dom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 获取列表中的元素的选中元素。
     * @param items 所有元素列表。
     * @param className 选中的 CSS 类名。
     * @return 返回选中的元素。如果不存在则返回 null。
     */
    function getSelected(items, className) {
        for (var _i = 0, _a = items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (dom.hasClass(item, className)) {
                return item;
            }
        }
        return null;
    }
    exports.getSelected = getSelected;
    /**
     * 设置列表中指定的元素为选中样式。
     * @param items 所有元素列表。
     * @param className 选中的 CSS 类名。
     * @param value 要选中的元素。如果为 null 则表示撤销已有的选中元素。
     */
    function setSelected(items, className, value) {
        for (var _i = 0, _a = items; _i < _a.length; _i++) {
            var item = _a[_i];
            dom.toggleClass(item, className, item === value);
        }
    }
    exports.setSelected = setSelected;
});
//# sourceMappingURL=selected.js.map