define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 如果页面被内嵌在 `<iframe>` 则代替主页面。
     */
    function noIFrame() {
        if (self !== top) {
            top.location = self.location;
        }
    }
    exports.default = noIFrame;
});
//# sourceMappingURL=noIFrame.js.map