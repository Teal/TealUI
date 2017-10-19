define(["require", "exports", "web/dom"], function (require, exports, dom) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 获取元素的状态。
     * @param elem 元素。
     * @param classPrefix CSS 类名前缀。
     * @return 返回状态。
     */
    function getStatus(elem, classPrefix) {
        for (var _i = 0, _a = ["error", "warning", "info", "success"]; _i < _a.length; _i++) {
            var status_1 = _a[_i];
            if (dom.hasClass(elem, "" + classPrefix + status_1)) {
                return status_1;
            }
        }
    }
    exports.getStatus = getStatus;
    /**
     * 设置元素的状态。
     * @param elem 元素。
     * @param classPrefix CSS 类名前缀。
     * @param value 要设置的状态。
     */
    function setStatus(elem, classPrefix, value) {
        for (var _i = 0, _a = ["error", "warning", "info", "success"]; _i < _a.length; _i++) {
            var status_2 = _a[_i];
            dom.removeClass(elem, "" + classPrefix + status_2);
        }
        if (value != null) {
            dom.addClass(elem, "" + classPrefix + value);
        }
    }
    exports.setStatus = setStatus;
});
//# sourceMappingURL=status.js.map