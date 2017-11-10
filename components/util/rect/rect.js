define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 判断一个点是否在指定的矩形区域（含边框）内。
     * @param rect 矩形区域。
     * @param point 要判断的点。
     * @return 如果在区域内或区域边界上则返回 true，否则返回 false。
     * @example inRect({x: 0, y: 0, width: 10, height: 10}, {x: 20, y: 20}) // false
     * @example inRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5}) // true
     * @example inRect({x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 0}) // true
     */
    function inRect(rect, point) {
        return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
    }
    exports.inRect = inRect;
    /**
     * 判断一个点是否在指定的矩形区域的边框上。
     * @param rect 矩形区域。
     * @param point 要判断的点。
     * @return 如果在区域边界上则返回 true，否则返回 false。
     * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 20,y: 20}) // false
     * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5}) // false
     * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 0}) // true
     * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 3}) // true
     */
    function onRect(rect, point) {
        return point.y >= rect.y && point.y <= rect.y + rect.height && (point.x === rect.x || point.x === rect.x + rect.width) || point.x >= rect.x && point.x <= rect.x + rect.width && (point.y === rect.y || point.y === rect.y + rect.height);
    }
    exports.onRect = onRect;
    /**
     * 计算区域偏移指定距离后的新区域。
     * @param rect 区域。
     * @param offset 要偏移的距离。
     * @return 返回新区域。
     * @example offsetRect({x: 0, y: 0, width: 10, height: 10}, {x: 10, y: 20}) // {x: 10, y: 20, width: 10, height: 10}
     */
    function offsetRect(rect, offset) {
        rect.x += offset.x;
        rect.y += offset.y;
        return rect;
    }
    exports.offsetRect = offsetRect;
    /**
     * 计算两个区域的交集部分。
     * @param rect1 要计算的第一个区域。
     * @param rect2 要计算的第二个区域。
     * @return 返回公共区域。如果区域无交集则返回长宽为 0 的区域。
     * @example intersectRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5, width: 10, height: 10}) // {x: 5, y: 5, width: 5, height: 5}
     * @example intersectRect({x: 0, y: 0, width: 10, height: 10}, {x: 11, y: 11, width: 10, height: 10}) // {x: 0, y: 0, width: 0, height: 0}
     */
    function intersectRect(rect1, rect2) {
        if (inRect(rect2, rect1)) {
            var t = rect1;
            rect1 = rect2;
            rect2 = t;
        }
        if (inRect(rect1, rect2)) {
            return {
                x: rect2.x,
                y: rect2.y,
                width: Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - rect2.x,
                height: Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - rect2.y
            };
        }
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }
    exports.intersectRect = intersectRect;
    /**
     * 计算两个区域的并集部分。
     * @param rect1 要计算的第一个区域。
     * @param rect2 要计算的第二个区域。
     * @return 返回并集区域。如果区域无交集则返回长宽为 0 的区域。
     * @example unionRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5, width: 10, height: 10}) // {x: 0, y: 0, width: 15, height: 15}
     * @example unionRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5, width: 2, height: 2}) // {x: 0, y: 0, width: 10, height: 10}
     * @example unionRect({x: 0, y: 0, width: 10, height: 10}, {x: 15, y: 15, width: 10, height: 10}) // {x: 0, y: 0, width: 25, height: 25}
     */
    function unionRect(rect1, rect2) {
        var r = {
            x: rect1.x < rect2.x ? rect1.x : rect2.x,
            y: rect1.y < rect2.y ? rect1.y : rect2.y
        };
        r.width = Math.max(rect1.x + rect1.width, rect2.x + rect2.width) - r.x;
        r.height = Math.max(rect1.y + rect1.height, rect2.y + rect2.height) - r.y;
        return r;
    }
    exports.unionRect = unionRect;
    /**
     * 判断一个点是否在指定的正圆区域（含边框）内。
     * @param circle 要判断的正圆区域。
     * @param point 要判断的点。
     * @return 如果在区域内或区域边界上则返回 true，否则返回 false。
     * @example inCircle({x: 2, y: 2, r: 1}, {x: 2, y: 2}) // true
     * @example inCircle({x: 2, y: 2, r: 1}, {x: 3, y: 2}) // true
     * @example inCircle({x: 2, y: 2, r: 1}, {x: 4, y: 2}) // false
     * @example inCircle({x: 2, y: 2, r: 1}, {x: 3, y: 3}) // false
     */
    function inCircle(circle, point) {
        return Math.pow((circle.x - point.x), 2) + Math.pow((circle.y - point.y), 2) <= Math.pow(circle.r, 2);
    }
    exports.inCircle = inCircle;
    /**
     * 判断一个点是否在指定的正圆区域边框上。
     * @param circle 要判断的正圆区域。
     * @param point 要判断的点。
     * @return 如果在区域内或区域边界上则返回 true，否则返回 false。
     * @example onCircle({x: 2, y: 2, r: 1}, {x: 3, y: 2}) // true
     * @example onCircle({x: 2, y: 2, r: 1}, {x: 2, y: 2}) // false
     * @example onCircle({x: 2, y: 2, r: 1}, {x: 4, y: 2}) // false
     * @example onCircle({x: 2, y: 2, r: 1}, {x: 3, y: 3}) // false
     */
    function onCircle(circle, point) {
        return Math.pow((circle.x - point.x), 2) + Math.pow((circle.y - point.y), 2) === Math.pow(circle.r, 2);
    }
    exports.onCircle = onCircle;
});
//# sourceMappingURL=rect.js.map