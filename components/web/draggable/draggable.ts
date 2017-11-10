import { movable, getOffset, Rect, getRect, animate } from "web/dom";
import { Movable } from "web/movable";
import { scrollIntoViewIfNeeded } from "web/scroll";

/**
 * 设置指定的元素可拖动。
 * @param elem 要拖动的元素。
 * @param options 拖动的选项。
 * @return 返回一个拖动对象。
 */
export default function draggable(elem: HTMLElement, options?: Partial<Draggable>) {
    let r = (elem as any).__draggable__ as  Draggable;
    if(!r) {
        ((elem as any).__draggable__ = r = new Draggable());
        r.proxy = r.elem = elem;
    }
    Object.assign(r, options).enable();
    movable(r.proxy);
    return r;
}

/**
 * 表示一个可拖动对象。
 */
export class Draggable extends Movable {

    /**
     * 从指针按下到触发移动事件的等待毫秒数。如果为 -1 则忽略指针按下不动的操作。
     * @default 500
     */
    delay: number;

    /**
     * 实际移动的元素。
     */
    proxy: HTMLElement;

    /**
     * 拖动开始事件。
     * @param e 事件对象。
     * @param sender 事件源。
     * @return 如果返回 false 则忽略本次拖动。
     */
    onDragStart?: (e: MouseEvent, sender: this) => boolean | void;

    /**
     * 拖动移动事件。
     * @param e 事件对象。
     * @param sender 事件源。
     * @return 如果返回 false 则不更改元素的位置。
     */
    onDragMove?: (e: MouseEvent, sender: this) => boolean | void;

    /**
     * 拖动结束事件。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    onDragEnd?: (e: MouseEvent, sender: this) => void;

    /**
     * 拖动取消事件。
     * @param e 事件对象。
     * @param sender 事件源。
     */
    onDragCancel?: (e: MouseEvent, sender: this) => void;

    /**
     * 开始拖动时拖动元素的水平偏移距离（单位：像素）。
     */
    startClientX: number;

    /**
     * 开始拖动时拖动元素的垂直偏移距离（单位：像素）。
     */
    startClientY: number;

    /**
     * 当前拖动元素的水平偏移距离（单位：像素）。
     */
    endClientX: number;

    /**
     * 当前拖动元素的垂直偏移距离（单位：像素）。
     */
    endClientY: number;

    /**
     * 触发拖动开始事件。
     * @param e 事件对象。
     * @return 如果返回 false 则忽略本次拖动。
     */
    moveStart(e: MouseEvent) {
        if (this.onDragStart && this.onDragStart(e, this) === false) {
            return false;
        }
        const offset = getOffset(this.proxy);
        this.endClientX = this.startClientX = offset.x;
        this.endClientY = this.startClientY = offset.y;
        return true;
    }

    /**
     * 触发拖动移动事件。
     * @param e 事件对象。
     */
    move(e: MouseEvent) {
        this.endClientX = this.startClientX + this.offsetX;
        this.endClientY = this.startClientY + this.offsetY;
        if (this.onDragMove && this.onDragMove(e, this) === false) {
            return false;
        }
        this.proxy.style.top = this.endClientY + "px";
        this.proxy.style.left = this.endClientX + "px";
    }

    /**
     * 触发拖动结束事件。
     * @param e 事件对象。
     */
    moveEnd(e: MouseEvent) {
        this.onDragEnd && this.onDragEnd(e, this);
    }

    /**
     * 自动滚动屏幕。
     * @param scrollable 滚动的容器元素。
     * @param padding 判断是否在区域内的最小距离。
     * @param offset 如果需要滚动则额外偏移的距离。
     */
    autoScroll(scrollable?: Element | Document, padding?: number, offset?: number) {
        scrollIntoViewIfNeeded(this.proxy, scrollable, 0, padding, offset);
    }

    /**
     * 限制拖动的方向。
     * @param value 要设置的方向。
     */
    direction(value: "vertical" | "horizontal") {
        this[value === "vertical" ? "endClientX" : "endClientY"] = this[value === "vertical" ? "startClientX" : "startClientY"];
    }

    /**
     * 限制只能在指定区域内拖动。
     * @param container 限制的区域或元素。
     * @param padding 容器的内边距。
     */
    limit(container: Document | Element | Rect, padding = 0) {
        container = (container as Document | Element).nodeType ? getRect(container as Document | Element) : container as Rect;
        this.proxy.style.top = this.endClientY + "px";
        this.proxy.style.left = this.endClientX + "px";
        const currentRect = getRect(this.proxy);
        let t: number;
        if ((t = currentRect.x - container.x - padding) <= 0 || (t = currentRect.x + currentRect.width - container.x - container.width + padding) >= 0) {
            this.endClientX -= t;
        }
        if ((t = currentRect.y - container.y - padding) <= 0 || (t = currentRect.y + currentRect.height - container.y - container.height + padding) >= 0) {
            this.endClientY -= t;
        }
    }

    /**
     * 设置拖动的步长。
     * @param value 拖动的步长。
     */
    step(value: number) {
        this.endClientY = this.startClientY + Math.floor((this.endClientY - this.startClientY + value / 2) / value) * value;
        this.endClientX = this.startClientX + Math.floor((this.endClientX - this.startClientX + value / 2) / value) * value;
    }

    /**
     * 还原位置。
     * @param callback 渐变结束的回调函数。
     * @param duration 渐变的总毫秒数。
     */
    revert(callback?: () => void, duration?: number) {
        this.disable();
        animate(this.proxy, {
            left: this.startClientX,
            top: this.startClientY,
        }, () => {
            this.enable();
            callback && callback();
        }, duration);
    }

    /**
     * 使当前元素吸附于目标位置。
     * @param target 吸附的目标区域或元素。
     * @param padding 容器的内边距。
     * @param distance 吸附的最小距离，当距离小于这个值后产生吸附效果。
     * @param position 吸附的位置。
     * @return 如果未吸附成功则返回 0，如果水平吸附成功则返回 1，如果垂直吸附成功则返回 2，如果都吸附成功则返回 3。
     */
    snap(target: Document | Element | Rect, padding = 0, distance = 15, position: "both" | "inside" | "outside" = "both") {
        target = (target as Document | Element).nodeType ? getRect(target as Document | Element) : target as Rect;
        const inside = position !== "outside";
        const outside = position !== "inside";

        this.proxy.style.top = this.endClientY + "px";
        this.proxy.style.left = this.endClientX + "px";
        const rect = getRect(this.proxy);

        let r = 0;

        let deltaX = distance;
        if (inside) {
            deltaX = target.x + padding - rect.x;
            if (Math.abs(deltaX) >= distance) {
                deltaX = target.x + target.width - padding - rect.x - rect.width;
            }
        }
        if (Math.abs(deltaX) >= distance && outside) {
            deltaX = target.x + padding - rect.x - rect.width;
            if (Math.abs(deltaX) >= distance) {
                deltaX = target.x + target.width - padding - rect.x;
            }
        }
        if (Math.abs(deltaX) < distance) {
            this.endClientX += deltaX;
            r += 1;
        }

        let deltaY = distance;
        if (inside) {
            deltaY = target.y + padding - rect.y;
            if (Math.abs(deltaY) >= distance) {
                deltaY = target.y + target.height - padding - rect.y - rect.height;
            }
        }
        if (Math.abs(deltaY) >= distance && outside) {
            deltaY = target.y + padding - rect.y - rect.height;
            if (Math.abs(deltaY) >= distance) {
                deltaY = target.y + target.height - padding - rect.y;
            }
        }
        if (Math.abs(deltaY) < distance) {
            this.endClientY += deltaY;
            r += 2;
        }

        return r;
    }

}

Draggable.prototype.delay = 500;
