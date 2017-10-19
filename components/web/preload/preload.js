define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 预加载一个资源。
     * @param url 要加载的地址。
     * @return 返回图片对象。
     * @example preload("../../../assets/resources/200x150.png")
     */
    function preload(url) {
        var r = new Image();
        r.src = url;
        return r;
    }
    exports.default = preload;
});
//# sourceMappingURL=preload.js.map