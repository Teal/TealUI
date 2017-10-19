define(["require", "exports", "web/dom"], function (require, exports, dom) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 判断元素是否和指定区域存在交集。
     * @param elem 元素。
     * @param container 要判断的容器元素或区域。
     * @param containerPadding 容器的内边距。即将元素和容器判定为相交时的最小的距离。
     * @return 如果元素和目标容器有任一交集则返回 true，否则返回 false。
     * @example within(elem, { x:0, y:0, width: 400, height: 500 });
     */
    function within(elem, container, containerPadding) {
        if (containerPadding === void 0) { containerPadding = 0; }
        container = container.nodeType ? dom.getRect(container) : container;
        var rect = dom.getRect(elem);
        var deltaY = rect.y - container.y;
        var deltaX = rect.x - container.x;
        return (deltaY < containerPadding ? deltaY + rect.height >= containerPadding : deltaY <= container.height) && (deltaX < containerPadding ? deltaX + rect.width >= containerPadding : deltaX <= container.width);
    }
    exports.default = within;
});
//# sourceMappingURL=within.js.map