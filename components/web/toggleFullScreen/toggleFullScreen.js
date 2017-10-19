define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 切换全屏状态。
     * @param elem 要全屏展示的元素。
     * @return 如果已进入全屏模式则返回 true，如果已退出全屏模式则返回 false。如果浏览器不支持全屏操作则返回 undefined。
     */
    function toggleFullScreen(elem) {
        if (elem === void 0) { elem = document.documentElement; }
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            var func = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
            if (func) {
                func.call(document);
                return false;
            }
        }
        else {
            var func = elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
            if (func) {
                func.call(elem, Element.ALLOW_KEYBOARD_INPUT);
                return true;
            }
        }
    }
    exports.default = toggleFullScreen;
});
//# sourceMappingURL=toggleFullScreen.js.map