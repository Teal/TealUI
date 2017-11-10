define(["require", "exports", "web/dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 滚动元素到指定的位置。
     * @param elem 元素或文档。
     * @param value 要滚动的目标坐标。允许只设置部分属性。
     * @param duration 滚动的动画时间。如果为 0 则不使用动画。
     * @param callback 滚动动画结束的回调函数。
     * @example scrollTo(document, {y: 400})
     */
    function scrollTo(elem, value, duration, callback) {
        if (duration === void 0) { duration = 200; }
        var start = dom_1.getScroll(elem);
        var last = start;
        if (duration === 0) {
            dom_1.setScroll(elem, value);
        }
        else if (value.x != null || value.y != null) {
            var deltaX_1 = value.x - start.x;
            var deltaY_1 = value.y - start.y;
            var maxCount_1 = duration / 20;
            var count_1 = 0;
            var step_1 = function () {
                value = dom_1.getScroll(elem);
                if (value.x === last.x && value.y === last.y) {
                    if (deltaX_1) {
                        value.x = start.x + (1 - Math.pow((1 - count_1 / maxCount_1), 3)) * deltaX_1;
                    }
                    if (deltaY_1) {
                        value.y = start.y + (1 - Math.pow((1 - count_1 / maxCount_1), 3)) * deltaY_1;
                    }
                    dom_1.setScroll(elem, value);
                    if (count_1++ < maxCount_1) {
                        last = dom_1.getScroll(elem);
                        setTimeout(step_1, 20);
                    }
                    else {
                        callback && callback(last);
                    }
                }
            };
            step_1();
            return;
        }
        callback && callback(last);
    }
    exports.scrollTo = scrollTo;
    /**
     * 滚动元素指定的偏移量。
     * @param elem 要滚动的元素或文档。
     * @param value 要滚动的距离坐标。允许只设置部分属性。
     * @param duration 滚动的动画时间。如果为 0 则不使用动画。
     * @param callback 滚动动画结束的回调函数。
     * @example scrollBy(document, {y: 400})
     */
    function scrollBy(elem, value, duration, callback) {
        var scroll = dom_1.getScroll(elem);
        if (value.x != null)
            scroll.x += value.x;
        if (value.y != null)
            scroll.y += value.y;
        scrollTo(elem, scroll, duration, callback);
    }
    exports.scrollBy = scrollBy;
    /**
     * 获取元素的滚动区域大小。
     * @param elem 要获取的元素或文档。
     * @return 返回一个大小。
     * @example scrollSize(document.body)
     */
    function scrollSize(elem) {
        return {
            width: elem.nodeType === 9 ? Math.max(elem.documentElement.scrollWidth || 0, elem.body.scrollWidth || 0, elem.clientWidth || 0) : elem.scrollWidth,
            height: elem.nodeType === 9 ? Math.max(elem.documentElement.scrollHeight || 0, elem.body.scrollHeight || 0, elem.clientHeight || 0) : elem.scrollHeight
        };
    }
    exports.scrollSize = scrollSize;
    /**
     * 判断指定元素是否在可见区域内。
     * @param elem 要判断的元素或文档。
     * @param scrollable 滚动的容器元素。
     * @param padding 判断是否在区域内的最小距离。
     * @return 如果元素部分或全部在可见区域内则返回 true，否则返回 false。
     * @example isScrollIntoView(document.body)
     */
    function isScrollIntoView(elem, scrollable, padding) {
        if (scrollable === void 0) { scrollable = scrollParent(elem); }
        if (padding === void 0) { padding = 0; }
        var container = dom_1.getRect(scrollable);
        var rect = dom_1.getRect(elem);
        var deltaY = rect.y - container.y;
        var deltaX = rect.x - container.x;
        return (deltaY < padding ? deltaY + rect.height > padding : deltaY < container.height) && (deltaX < padding ? deltaX + rect.width > padding : deltaX < container.width);
    }
    exports.isScrollIntoView = isScrollIntoView;
    /**
     * 将元素滚动到可见区域。
     * @param elem 要滚动的元素或文档。
     * @param position 滚动的位置。
     * @param scrollable 滚动的容器元素。
     * @param duration 滚动的动画时间。如果为 0 则不使用动画。
     * @param offset 如果需要滚动则额外偏移的距离。
     * @param callback 滚动动画结束的回调函数。
     */
    function scrollIntoView(elem, position, scrollable, duration, offset, callback) {
        if (scrollable === void 0) { scrollable = scrollParent(elem); }
        if (offset === void 0) { offset = 0; }
        var container = dom_1.getRect(scrollable);
        var rect = dom_1.getRect(elem);
        var deltaY = rect.y - container.y;
        var deltaX = rect.x - container.x;
        var value = dom_1.getScroll(scrollable);
        if (!position || position === "start" || position === "nearest" && deltaY <= (container.height - rect.height) / 2) {
            value.y += deltaY - offset;
        }
        else {
            value.y += deltaY - container.height + rect.height + offset;
            if (position === "center") {
                value.y += (container.height - rect.height) / 2;
            }
        }
        if (!position || position === "start" || position === "nearest" && deltaX <= (container.width - rect.width) / 2) {
            value.x -= -deltaX + offset;
        }
        else {
            value.x -= -deltaX + container.width - rect.width - offset;
            if (position === "center") {
                value.x += (container.width - rect.width) / 2;
            }
        }
        scrollTo(scrollable, value, duration, callback);
    }
    exports.scrollIntoView = scrollIntoView;
    /**
     * 如果元素可见区域内则将元素滚动到可见区域。
     * @param elem 要滚动的元素或文档。
     * @param scrollable 滚动的容器元素。
     * @param padding 判断是否在区域内的最小距离。
     * @param offset 如果需要滚动则额外偏移的距离。
     * @param duration 滚动的动画时间。如果为 0 则不使用动画。
     * @param callback 滚动动画结束的回调函数。
     * @example scrollIntoViewIfNeeded(document.body)
     */
    function scrollIntoViewIfNeeded(elem, scrollable, duration, padding, offset, callback) {
        if (scrollable === void 0) { scrollable = scrollParent(elem); }
        if (padding === void 0) { padding = 0; }
        if (offset === void 0) { offset = 0; }
        var container = dom_1.getRect(scrollable);
        var rect = dom_1.getRect(elem);
        var deltaY = rect.y - container.y;
        var deltaX = rect.x - container.x;
        var value = dom_1.getScroll(scrollable);
        if (deltaY < padding) {
            value.y += deltaY - offset;
        }
        else if (deltaY + rect.height + padding > container.height) {
            value.y += deltaY - container.height + rect.height + offset;
        }
        else {
            delete value.y;
        }
        if (deltaX < padding) {
            value.x += deltaX - offset;
        }
        else if (deltaX + rect.width + padding > container.width) {
            value.x += deltaX - container.width + rect.width + offset;
        }
        else {
            delete value.x;
        }
        scrollTo(scrollable, value, duration, callback);
    }
    exports.scrollIntoViewIfNeeded = scrollIntoViewIfNeeded;
    /**
     * 设置滚动到当前指定元素或文档时的回调。
     * @param elem 要绑定事件的元素或文档。
     * @param callback 滚动到当前指定元素时的回调。
     * @param once 是否只在第一次滚动时执行。
     * @param scrollable 滚动的容器元素。
     * @param padding 判断是否在区域内的最小距离。
     * @example scrollShow(document.body, () => { alert("hi"); })
     */
    function scrollShow(elem, callback, once, scrollable, padding) {
        if (once === void 0) { once = true; }
        if (scrollable === void 0) { scrollable = scrollParent(elem); }
        if (padding === void 0) { padding = 0; }
        var container = scrollable.nodeType === 9 ? scrollable.defaultView : scrollable;
        var inView = false;
        var handleScroll = function () {
            var oldInView = inView;
            if ((inView = isScrollIntoView(elem, scrollable, padding))) {
                if (!oldInView) {
                    callback();
                }
                if (once) {
                    container.removeEventListener("scroll", handleScroll, false);
                }
            }
        };
        container.addEventListener("scroll", handleScroll, false);
        handleScroll();
    }
    exports.scrollShow = scrollShow;
    /**
     * 获取指定元素第一个可滚动的父元素。
     * @param elem 要搜索的元素。
     * @return 返回父元素。
     */
    function scrollParent(elem) {
        if (elem.nodeType !== 9) {
            while ((elem = elem.parentNode) && elem.nodeType === 1 && !/^(?:auto|scroll)$/.test(dom_1.getStyle(elem, "overflow")))
                ;
        }
        return elem;
    }
    exports.scrollParent = scrollParent;
});
//# sourceMappingURL=scroll.js.map