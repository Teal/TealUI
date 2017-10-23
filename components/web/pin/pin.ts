import { getRect, setRect, Rect, getStyle } from "web/dom";
import { scrollParent } from "web/scroll";

const knownAligns = {
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
 * 表示对齐的位置。
 * @desc
 * 位置使用格式为“xx-yy”的字符串表示。
 *
 * 其中 xx 表示水平方向的位置，可取以下值之一：
 * - `ll`: 对齐到 `target` 左边框的左侧。
 * - `lr`: 对齐到 `target` 左边框的右侧。
 * - `cc`: 对齐到 `target` 水平居中位置。
 * - `rl`: 对齐到 `target` 右边框的左侧。
 * - `rr`: 对齐到 `target` 右边框的右侧。
 *
 * 其中 yy 表示垂直方向的位置，可取以下值之一：
 * - `tt`: 对齐到 `target` 上边框的上侧。
 * - `tb`: 对齐到 `target` 上边框的下侧。
 * - `cc`: 对齐到 `target` 垂直居中位置。
 * - `bt`: 对齐到 `target` 下边框的上侧。
 * - `bb`: 对齐到 `target` 下边框的下侧。
 *
 * 对于常见的位置，也可以直接使用下图中的字符串表示：
 * ```
 * |        topLeft   top   topRight
 * |           ┌───────────────┐
 * |   leftTop │               │ rightTop
 * |           │               │
 * |      left │     center    │ right
 * |           │               │
 * |leftBottom │               │ rightBottom
 * |           └───────────────┘
 * |     bottomLeft bottom bottomRight
 * ```
 */
export type PinAlign = keyof typeof knownAligns | PinResult["align"];

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
export default function pin(elem: HTMLElement, target: Document | Element | Rect, align: PinAlign = "bottomLeft", margin = 0, container: Document | Element | Rect | null = scrollParent(elem), containerPadding = 10, offset = 0, resize = /^(?:auto|scroll)$/.test(getStyle(elem, "overflow"))) {

    // 如果上一次定位更新了大小则先恢复默认大小。
    if (resize !== false) {
        const style = elem.style;
        if ((style as any).__width__ != null) {
            style.width = (style as any).__width__;
            delete (style as any).__width__;
        }
        if ((style as any).__height__ != null) {
            style.height = (style as any).__height__;
            delete (style as any).__height__;
        }
    }

    // 计算相关的矩形。
    const r = getRect(elem) as PinResult;
    r.align = align = (knownAligns[align as keyof typeof knownAligns] || align) as PinResult["align"];
    r.target = target = (target as Document | Element).nodeType ? getRect(target as Document | Element) : target as Rect;
    if (container) {
        r.container = container = (container as Document | Element).nodeType ? getRect(container as Document | Element) : { ...container as Rect };
        container.x += containerPadding;
        container.y += containerPadding;
        container.width -= containerPadding + containerPadding;
        container.height -= containerPadding + containerPadding;
    }

    const proc = (x: "x" | "y", width: "width" | "height", center: boolean, left1: boolean, left2: boolean, offset: number) => {

        // 检测是否超出容器大小。
        if (resize && container && r[width] > (container as Rect)[width]) {
            r["scale" + x.toUpperCase() as "scaleX" | "scaleY"] = true;
            (elem.style as any)["__" + width + "__"] = elem.style[width];
            r[width] = (container as Rect)[width];
        }

        // 计算实际偏移。
        if (offset && offset < 1 && offset > -1) {
            offset *= r[width];
        }

        // 计算理论位置。
        let value = (target as Rect)[x] + (center ?
            ((target as Rect)[width] - r[width]) / 2 + offset :
            (left1 ? 0 : (target as Rect)[width]) + (left2 ? -r[width] - offset : offset));

        // 检测位置是否超出容器。
        if (container) {
            const leftBound = (container as Rect)[x];
            const rightBound = leftBound + (container as Rect)[width] - r[width];
            if ((left2 || center) && value < leftBound || (!left2 || center) && value > rightBound) {
                if (center) {
                    value = value <= rightBound ? Math.min((target as Rect)[x] + (target as Rect)[width] / 2, leftBound) : Math.max((target as Rect)[x] + (target as Rect)[width] / 2 - r[width], rightBound);
                } else {
                    // 对于左右边对齐的布局，先尝试翻转布局。
                    const rotateX = "rotate" + x.toUpperCase() as "rotateX" | "rotateY";
                    if (!r[rotateX]) {
                        r[rotateX] = true;
                        proc(x, width, center, !left1, !left2, offset);
                        return;
                    }

                    // 如果翻转后仍然超出位置再移动位置。
                    value = left1 ? Math.min((target as Rect)[x], leftBound) : Math.max((target as Rect)[x] + (target as Rect)[width] - r[width], rightBound);
                }
                r["transform" + x.toUpperCase() as "transformX" | "transformY"] = true;
            }
        }

        // 对位置进行四舍五入以避免因 < 1px 误差产生的抖动。
        r[x] = Math.round(value);
    };

    const center = align.charCodeAt(0) === 99 /*c*/;
    const left1 = align.charCodeAt(0) === 108 /*l*/;
    const left2 = align.charCodeAt(1) === 108 /*l*/;

    const middle = align.charCodeAt(3) === 99 /*c*/;
    const top1 = align.charCodeAt(3) === 116 /*t*/;
    const top2 = align.charCodeAt(4) === 116 /*t*/;

    proc("x", "width", center, left1, left2, center || left1 !== left2 && top1 === top2 ? offset : margin);
    proc("y", "height", middle, top1, top2, middle || top1 !== top2 && left1 === left2 ? offset : margin);
    setRect(elem, r.scaleX || r.scaleY ? r : { x: r.x, y: r.y });
    return r;
}

/**
 * 表示定位的结果。
 */
export interface PinResult extends Rect {

    /**
     * 目标区域。
     */
    target: Rect;

    /**
     * 容器区域。
     */
    container: Rect;

    /**
     * 对齐方式。
     */
    align: "ll-tt" | "ll-tb" | "ll-cc" | "ll-bt" | "ll-bb" | "lr-tt" | "lr-tb" | "lr-cc" | "lr-bt" | "lr-bb" | "cc-tt" | "cc-tb" | "cc-cc" | "cc-bt" | "cc-bb" | "rl-tt" | "rl-tb" | "rl-cc" | "rl-bt" | "rl-bb" | "rr-tt" | "rr-tb" | "rr-cc" | "rr-bt" | "rr-bb";

    /**
     * 是否水平翻转了位置。
     */
    rotateX?: boolean;

    /**
     * 是否垂直翻转了位置。
     */
    rotateY?: boolean;

    /**
     * 是否调整了水平位置。
     */
    transformX?: boolean;

    /**
     * 是否调整了垂直位置。
     */
    transformY?: boolean;

    /**
     * 是否调整了宽度。
     */
    scaleX?: boolean;

    /**
     * 是否调整了高度。
     */
    scaleY?: boolean;

}
