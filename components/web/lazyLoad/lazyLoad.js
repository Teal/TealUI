define(["require", "exports", "web/dom", "web/scroll"], function (require, exports, dom_1, scroll_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 懒加载图片。
     * @param elem 要加载的图片。
     * @param url 加载的地址。
     * @param scrollParent 可滚动的元素。
     * @param callback 图片已加载的回调函数。
     * @example lazyLoad(img)
     */
    function lazyLoad(elem, url, scrollParent, callback) {
        scroll_1.scrollShow(elem, function () {
            var proxy = new Image();
            proxy.src = url;
            proxy.onload = function () {
                elem.src = proxy.src;
                dom_1.show(elem, "opacity");
                callback && callback();
            };
        }, true, scrollParent);
    }
    exports.default = lazyLoad;
});
//# sourceMappingURL=lazyLoad.js.map