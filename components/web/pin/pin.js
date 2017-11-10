var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "web/dom", "web/scroll"], function (require, exports, dom_1, scroll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var knownAligns = {
        center: "cc-cc",
        leftTop: "ll-tb",
        left: "ll-cc",
        leftBottom: "ll-bt",
        rightBottom: "lr-bb",
        right: "rr-cc",
        rightTop: "rr-tb",
        topRight: "rl-tt",
        top: "cc-tt",
        topLeft: "lr-tt",
        bottomLeft: "lr-bb",
        bottom: "cc-bb",
        bottomRight: "rl-bb"
    };
    /**
     * 将元素对齐到其它节点或区域。
     * @param elem 要定位的元素。
     * @param target 对齐的目标节点或区域。
     * @param align 对齐的位置。
     * @param margin 元素的外边距。如果小于 1，则表示相对元素大小的百分比。
     * @param container 容器节点或区域，定位超出容器后会自动调整。如果为 null 则不自动调整位置。
     * @param containerPadding 容器的内边距。
     * @param offset 定位后的额外偏移距离。如果小于 1，则表示相对元素大小的百分比。
     * @param resize 如果容器比元素小，是否允许更改元素大小。
     * @return 返回定位结果。
     * @example pin(document.getElementById("pin_elem"), document.getElementById("pin_target"))
     */
    function pin(elem, target, align, margin, container, containerPadding, offset, resize) {
        if (align === void 0) { align = "bottomLeft"; }
        if (margin === void 0) { margin = 0; }
        if (container === void 0) { container = scroll_1.scrollParent(elem); }
        if (containerPadding === void 0) { containerPadding = 10; }
        if (offset === void 0) { offset = 0; }
        if (resize === void 0) { resize = /^(?:auto|scroll)$/.test(dom_1.getStyle(elem, "overflow")); }
        // 如果上一次定位更新了大小则先恢复默认大小。
        if (resize !== false) {
            var style = elem.style;
            if (style.__width__ != null) {
                style.width = style.__width__;
                delete style.__width__;
            }
            if (style.__height__ != null) {
                style.height = style.__height__;
                delete style.__height__;
            }
        }
        // 计算相关的矩形。
        var r = dom_1.getRect(elem);
        r.align = align = (knownAligns[align] || align);
        r.target = target = target.nodeType ? dom_1.getRect(target) : target;
        if (container) {
            r.container = container = container.nodeType ? dom_1.getRect(container) : __assign({}, container);
            container.x += containerPadding;
            container.y += containerPadding;
            container.width -= containerPadding + containerPadding;
            container.height -= containerPadding + containerPadding;
        }
        var proc = function (x, width, center, left1, left2, offset) {
            // 检测是否超出容器大小。
            if (resize && container && r[width] > container[width]) {
                r["scale" + x.toUpperCase()] = true;
                elem.style["__" + width + "__"] = elem.style[width];
                r[width] = container[width];
            }
            // 计算实际偏移。
            if (offset && offset < 1 && offset > -1) {
                offset *= r[width];
            }
            // 计算理论位置。
            var value = target[x] + (center ?
                (target[width] - r[width]) / 2 + offset :
                (left1 ? 0 : target[width]) + (left2 ? -r[width] - offset : offset));
            // 检测位置是否超出容器。
            if (container) {
                var leftBound = container[x];
                var rightBound = leftBound + container[width] - r[width];
                if ((left2 || center) && value < leftBound || (!left2 || center) && value > rightBound) {
                    if (center) {
                        value = value <= rightBound ? Math.min(target[x] + target[width] / 2, leftBound) : Math.max(target[x] + target[width] / 2 - r[width], rightBound);
                    }
                    else {
                        // 对于左右边对齐的布局，先尝试翻转布局。
                        var rotateX = "rotate" + x.toUpperCase();
                        if (!r[rotateX]) {
                            r[rotateX] = true;
                            proc(x, width, center, !left1, !left2, offset);
                            return;
                        }
                        // 如果翻转后仍然超出位置再移动位置。
                        value = left1 ? Math.min(target[x], leftBound) : Math.max(target[x] + target[width] - r[width], rightBound);
                    }
                    r["transform" + x.toUpperCase()] = true;
                }
            }
            // 对位置进行四舍五入以避免因 < 1px 误差产生的抖动。
            r[x] = Math.round(value);
        };
        var center = align.charCodeAt(0) === 99 /*c*/;
        var left1 = align.charCodeAt(0) === 108 /*l*/;
        var left2 = align.charCodeAt(1) === 108 /*l*/;
        var middle = align.charCodeAt(3) === 99 /*c*/;
        var top1 = align.charCodeAt(3) === 116 /*t*/;
        var top2 = align.charCodeAt(4) === 116 /*t*/;
        proc("x", "width", center, left1, left2, center || left1 !== left2 && top1 === top2 ? offset : margin);
        proc("y", "height", middle, top1, top2, middle || top1 !== top2 && left1 === left2 ? offset : margin);
        dom_1.setRect(elem, r.scaleX || r.scaleY ? r : { x: r.x, y: r.y });
        return r;
    }
    exports.default = pin;
});
//# sourceMappingURL=pin.js.map