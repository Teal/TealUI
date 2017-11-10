define(["require", "exports", "web/dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 设置指针按住时的回调函数。
     * @param elem 相关的元素。
     * @param pointerDown 指针按下后的回调函数。
     * @param pointerUp 指针松开后的回调函数。
     * @param duration 当指针保持按下状态时持续触发按下事件的间隔时间。
     * @example active(elem, () => console.log("下"), () => console.log("上"))
     */
    function active(elem, pointerDown, pointerUp, duration) {
        if (duration === void 0) { duration = 50; }
        var timer;
        var handlePointUp = function (e) {
            if (timer) {
                clearInterval(timer);
                timer = 0;
            }
            dom_1.off(document, "pointerup", handlePointUp);
            pointerUp && pointerUp(e);
        };
        dom_1.on(elem, "pointerdown", function (e) {
            dom_1.on(document, "pointerup", handlePointUp);
            if (pointerDown) {
                timer = setInterval(pointerDown, duration, e);
                pointerDown(e);
            }
        });
    }
    exports.default = active;
});
//# sourceMappingURL=active.js.map