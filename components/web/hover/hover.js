define(["require", "exports", "web/dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 设置指针悬停时的回调函数。
     * @param elem 元素。
     * @param pointerEnter 指针移入后的回调函数。
     * @param pointerLeave 指针移出后的回调函数。
     * @param delay 触发事件延时执行的毫秒数。指针进入后指定时间内不触发函数。
     * @example hover(elem, () => console.log("进"), () => console.log("出"))
     */
    function hover(elem, pointerEnter, pointerLeave, delay) {
        if (delay === void 0) { delay = 30; }
        var timer;
        dom_1.on(elem, "pointerenter", function (e) {
            timer = setTimeout(function () {
                timer = 0;
                pointerEnter && pointerEnter(e);
            }, delay);
        });
        dom_1.on(elem, "pointerleave", function (e) {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            else {
                pointerLeave && pointerLeave(e);
            }
        });
    }
    exports.default = hover;
});
//# sourceMappingURL=hover.js.map