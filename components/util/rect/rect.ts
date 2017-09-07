/**
 * 表示一个点。
 */
export interface Point {

    /**
     * X 坐标值。
     */
    x: number;

    /**
     * Y 坐标值。
     */
    y: number;

}

/**
 * 表示一个大小。
 */
export interface Size {

    /**
     * 宽度。
     */
    width: number;

    /**
     * 高度。
     */
    height: number;

}

/**
 * 表示一个矩形区域。
 */
export interface Rect extends Point, Size { }

/**
 * 计算指定区域偏移指定坐标后的新区域。
 * @param rect 要处理的区域或点。
 * @param p 要偏移的距离。
 * @return 返回新区域。
 * @example offsetRect({x: 0, y: 0, width: 10, height: 10}, {x: 10, y: 20}) // {x: 10, y: 20, width: 10, height: 10}
 */
export function offsetRect(rect: Rect, p: Point) {
    rect.x += p.x;
    rect.y += p.y;
    return rect;
}

/**
 * 判断一个点是否在指定的矩形区域(含边框)内。
 * @param rect 要判断的矩形区域。
 * @param p 要判断的点。
 * @return 如果在区域内或区域边界上则返回 true，否则返回 false。
 * @example inRect({x: 0, y: 0, width: 10, height: 10}, {x: 20, y: 20}) // false
 * @example inRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5}) // true
 * @example inRect({x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 0}) // true
 */
export function inRect(rect: Rect, p: Point) {
    const beginX = rect.x;
    const endX = rect.x + rect.width;
    const beginY = rect.y;
    const endY = rect.y + rect.height;
    if (p.x >= beginX && p.x <= endX) {
        if (p.y >= beginY && p.y <= endY) {
            return true;
        }
    }
    return false;
}

/**
 * 判断一个点是否在指定的矩形区域边框上。
 * @param rect 要判断的矩形区域。
 * @param p 要判断的点。
 * @return 如果在区域边界上则返回 true，否则返回 false。
 * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 20,y: 20}) // false
 * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5}) // false
 * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 0}) // true
 * @example onRect({x: 0, y: 0, width: 10, height: 10}, {x: 0, y: 3}) // true
 */
export function onRect(rect: Rect, p: Point) {
    const beginX = rect.x;
    const endX = rect.x + rect.width;
    const beginY = rect.y;
    const endY = rect.y + rect.height;
    if (p.x == beginX || p.x == endX) {
        if (p.y >= beginY && p.y <= endY) {
            return true;
        }
    }
    if (p.y == beginY || p.y == endY) {
        if (p.x >= beginX && p.x <= endX) {
            return true;
        }
    }
    return false;
}

/**
 * 计算两个区域的交集部分。
 * @param rectX 要处理的第一个区域。
 * @param rectY 要处理的第二个区域。
 * @return 返回公共区域。如果区域无交集则返回长宽为 0 的区域。
 * @example intersectRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5, width: 10, height: 10}) // {x: 5, y: 5, width: 5, height: 5}
 * @example intersectRect({x: 0, y: 0, width: 10, height: 10}, {x: 11, y: 11, width: 10, height: 10}) // {x: 0, y: 0, width: 0, height: 0}
 */
export function intersectRect(rectX: Rect, rectY: Rect) {
    const pointX = { x: rectX.x, y: rectX.y };
    const pointY = { x: rectY.x, y: rectY.y };
    const result = {} as Rect;
    const rectXendX = rectX.x + rectX.width;
    const rectXendY = rectX.y + rectX.height;
    const rectYendX = rectY.x + rectY.width;
    const rectYendY = rectY.y + rectY.height;
    const pointEnd = {
        x: rectXendX <= rectYendX ? rectXendX : rectYendX,
        y: rectXendY <= rectYendY ? rectXendY : rectYendY
    };
    if (inRect(rectX, pointY)) {
        result.x = pointY.x;
        result.y = pointY.y;
        result.width = pointEnd.x - pointY.x;
        result.height = pointEnd.y - pointY.y;
        return result;
    }
    if (inRect(rectY, pointX)) {
        result.x = pointX.x;
        result.y = pointX.y;
        result.width = pointEnd.x - pointX.x;
        result.height = pointEnd.y - pointX.y;
        return result;
    }
    return {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0
    };
}

/**
 * 计算两个区域的并集部分。
 * @param rectX 要处理的第一个区域。
 * @param rectY 要处理的第二个区域。
 * @return 返回并集区域。如果区域无交集则返回长宽为 0 的区域。
 * @example unionRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5, width: 10, height: 10}) // {x: 0, y: 0, width: 15, height: 15}
 * @example unionRect({x: 0, y: 0, width: 10, height: 10}, {x: 5, y: 5, width: 2, height: 2}) // {x: 0, y: 0, width: 10, height: 10}
 * @example unionRect({x: 0, y: 0, width: 10, height: 10}, {x: 15, y: 15, width: 10, height: 10}) // {x: 0, y: 0, width: 25, height: 25}
 */
export function unionRect(rectX: Rect, rectY: Rect) {
    const pointEndX = {
        x: rectX.x + rectX.width,
        y: rectX.y + rectX.height
    };
    const pointEndY = {
        x: rectY.x + rectY.width,
        y: rectY.y + rectY.height
    };
    const pointStart = {
        x: rectX.x < rectY.x ? rectX.x : rectY.x,
        y: rectX.y < rectY.y ? rectX.y : rectY.y
    };
    const pointEnd = {
        x: pointEndX.x > pointEndY.x ? pointEndX.x : pointEndY.x,
        y: pointEndX.y > pointEndY.y ? pointEndX.y : pointEndY.y
    };
    return {
        x: pointStart.x,
        y: pointStart.y,
        width: pointEnd.x - pointStart.x,
        height: pointEnd.y - pointStart.y
    };
}

/**
 * 表示一个正圆区域。
 */
export interface Circle extends Point {

    /**
     * 圆型的半径。
     */
    r: number;

}

/**
 * 判断一个点是否在指定的正圆区域(含边框)内。
 * @param circle 要判断的正圆区域。
 * @param p 要判断的点。
 * @return 如果在区域内或区域边界上则返回 true，否则返回 false。
 * @example inCircle({x: 2, y: 2, r: 1}, {x: 2, y: 2}) // true
 * @example inCircle({x: 2, y: 2, r: 1}, {x: 3, y: 2}) // true
 * @example inCircle({x: 2, y: 2, r: 1}, {x: 4, y: 2}) // false
 * @example inCircle({x: 2, y: 2, r: 1}, {x: 3, y: 3}) // false
 */
export function inCircle(circle: Circle, p: Point) {
    const a = circle.x - p.x;
    const b = circle.y - p.y;
    const c = Math.sqrt(a * a + b * b);
    return c <= circle.r ? true : false;
}
