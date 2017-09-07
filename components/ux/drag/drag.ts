import { on, off, getStyle, getOffset, Rect, animate, getRect } from "ux/dom";
import { scrollIntoViewIfNeeded } from "ux/scroll";

/**
 * 表示一个可拖动对象。
 */
export class Draggable {

    /**
     * 拖动手柄元素。只有点击手柄才能开始拖动。
     */
    handle: HTMLElement;

    /**
     * 指针按下不动到开始拖动的等待毫秒数。如果为 -1 则忽略指针按下不动的操作。
     */
    delay: number;

    /**
     * 开始拖动的最小距离。拖动距离小于这个值时认为是点击操作。
     */
    distance: number;

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
     * 拖动的元素。
     */
    elem: HTMLElement;

    /**
     * 启用拖动。
     */
    enable() { on(this.handle, "pointerdown", this.handlePointerDown, this); }

    /**
     * 禁用拖动。
     */
    disable() { off(this.handle, "pointerdown", this.handlePointerDown); }

    /**
     * 获取开始拖动的水平坐标。
     */
    startX: number;

    /**
     * 获取开始拖动的垂直坐标。
     */
    startY: number;

    /**
     * 获取当前的水平坐标。
     */
    endX: number;

    /**
     * 获取当前的垂直坐标。
     */
    endY: number;

    /**
     * 开始拖动的倒计时。
     */
    private _timer: number;

    /**
     * 当前正在拖动的对象。
     */
    static current?: Draggable;

    /**
     * 当前实际处理拖动鼠标移动的函数。可能是 start 或 dragMove。
     */
    private _handler: (e: MouseEvent) => void;

    /**
     * 是否禁止拖动。
     * @param e 事件对象。
     */
    cancel(e: MouseEvent) {
        return e.target !== this.handle && /^(?:input|textarea|button|select|option)/i.test((e.target as HTMLElement).tagName);
    }

    /**
     * 处理指针按下事件。
     * @param e 事件对象。
     */
    protected handlePointerDown(e: MouseEvent) {
        if (e.which === 1 && !this.cancel(e)) {

            // 禁用选区。
            e.preventDefault();

            // 不允许两个对象同时拖动。
            if (Draggable.current) {
                Draggable.current.stopDragging(e);
            }

            // 记录当前的开始位置。
            this.endX = this.startX = e.pageX;
            this.endY = this.startY = e.pageY;

            // 设置下一步处理句柄。
            this._handler = this.startDragging;

            // 延时以避免将简单的点击作为拖动处理。
            this._timer = this.delay >= 0 ? setTimeout(() => {
                this._timer = 0;
                this._handler(e);
            }, this.delay) as any : -1;

            // 绑定拖动和停止拖动事件。
            const doc = this.handle.ownerDocument;
            on(doc, "pointerup", this.handlePointerUp, this);
            on(doc, "pointermove", this.handlePointerMove, this);
        }
    }

    /**
     * 处理指针移动事件。
     * @param e 事件对象。
     */
    protected handlePointerMove(e: MouseEvent) {

        // 禁用选区。
        e.preventDefault();

        // 更新当前的鼠标位置。
        this.endX = e.pageX;
        this.endY = e.pageY;

        // 调用当前的处理句柄来处理此函数。
        this._handler(e);
    }

    /**
     * 处理指针松开事件。
     * @param e 事件对象。
     */
    protected handlePointerUp(e: MouseEvent) {
        // 只有鼠标左键松开， 才认为是停止拖动。
        if (e.which === 1) {
            e.preventDefault();
            this.stopDragging(e);
        }
    }

    /**
     * 拖动前鼠标样式。
     */
    private _orignalCursor: string | null;

    /**
     * 进入拖动状态。
     * @param e 事件对象。
     */
    private startDragging(e: MouseEvent) {
        // 进入拖动状态有两种可能：
        // 1. 鼠标按下超时。
        // 2. 鼠标按下然后移动超过一定距离。

        // 如果 _timer 非 0 说明是通过移动鼠标进入。
        if (this._timer) {
            // 忽略移动距离太小的调用。
            if ((this.endY - this.startY) ** 2 + (this.endX - this.startX) ** 2 < this.distance ** 2) {
                return;
            }
            clearTimeout(this._timer);
            this._timer = 0;
        }

        // 更新当前正在拖动的对象。
        Draggable.current = this;

        // 锁定鼠标样式。
        this._orignalCursor = document.documentElement.style.cursor;
        document.documentElement.style.cursor = getStyle(this.handle, "cursor");
        if ("pointerEvents" in document.body.style) {
            document.body.style.pointerEvents = "none";
        } else if ((document.body as any).setCapture) {
            (document.body as any).setCapture();
        }

        // 执行开始拖动回调，如果用户阻止和强制停止拖动。
        if (this.dragStart(e) !== false) {
            this._handler = this.dragMove;
            this.dragMove(e);
        } else {
            this.stopDragging(e);
        }
    }

    /**
     * 退出拖动状态。
     * @param e 事件对象。
     */
    private stopDragging(e: MouseEvent) {

        // 解绑全局指针松开事件。
        const doc = this.handle.ownerDocument;
        off(doc, "pointermove", this.handlePointerMove, this);
        off(doc, "pointerup", this.handlePointerUp, this);

        // 清空计时器。
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = 0;
        }

        // 如果在停止拖动时仍未开始拖动则作为点击事件触发。
        if (this._handler === this.startDragging && this.onDragCancel) {
            this.onDragCancel(e, this);
        }

        // 拖动结束。
        if (Draggable.current === this) {

            // 恢复鼠标样式。
            if (document.body.style.pointerEvents === "none") {
                document.body.style.pointerEvents = "";
            } else if ((document.body as any).releaseCapture)
                (document.body as any).releaseCapture();
            document.documentElement.style.cursor = this._orignalCursor;

            this.dragEnd(e);
            Draggable.current = undefined;

        }

    }

    /**
     * 开始拖动时的水平偏移距离。
     */
    startClientX: number;

    /**
     * 开始拖动时的垂直偏移距离。
     */
    startClientY: number;

    /**
     * 当前的水平偏移距离。
     */
    endClientX: number;

    /**
     * 当前的垂直偏移距离。
     */
    endClientY: number;

    /**
     * 触发拖动开始事件。
     * @param e 事件对象。
     * @return 如果返回 false 则忽略本次拖动。
     */
    protected dragStart(e: MouseEvent) {
        if (this.onDragStart && this.onDragStart(e, this) === false) {
            return false;
        }
        const offset = getOffset(this.elem);
        this.endClientX = this.startClientX = offset.x;
        this.endClientY = this.startClientY = offset.y;
        return true;
    }

    /**
     * 触发拖动移动事件。
     * @param e 事件对象。
     */
    protected dragMove(e: MouseEvent) {
        this.endClientX = this.startClientX + this.endX - this.startX;
        this.endClientY = this.startClientY + this.endY - this.startY;
        if (!this.onDragMove || this.onDragMove(e, this) !== false) {
            this.elem.style.top = this.endClientY + "px";
            this.elem.style.left = this.endClientX + "px";
        }
    }

    /**
     * 触发拖动结束事件。
     * @param e 事件对象。
     */
    protected dragEnd(e: MouseEvent) {
        this.onDragEnd && this.onDragEnd(e, this);
    }

    /**
     * 自动滚动屏幕。
     * @param scrollable 滚动的容器元素。
     * @param padding 判断是否在区域内的最小距离。
     * @param offset 如果需要滚动则额外偏移的距离。
     */
    autoScroll(scrollable?: HTMLElement | Document, padding?: number, offset?: number) {
        scrollIntoViewIfNeeded(this.elem, scrollable, 0, padding, offset);
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
    limit(container: Document | HTMLElement | Rect, padding = 0) {
        container = (container as Document | HTMLElement).nodeType ? getRect(container as Document | HTMLElement) : container as Rect;
        this.elem.style.top = this.endClientY + "px";
        this.elem.style.left = this.endClientX + "px";
        const currentRect = getRect(this.elem);
        let delta: number;
        if ((delta = currentRect.x - container.x - padding) <= 0 || (delta = currentRect.x + currentRect.width - container.x - container.width + padding) >= 0) {
            this.endClientX -= delta;
        }
        if ((delta = currentRect.y - container.y - padding) <= 0 || (delta = currentRect.y + currentRect.height - container.y - container.height + padding) >= 0) {
            this.endClientY -= delta;
        }
    }

    /**
     * 设置当前拖动的步长。
     * @param value 拖动的步长。
     */
    step(value: number) {
        this.endClientY = this.startClientY + Math.floor((this.endClientY - this.startClientY + value / 2) / value) * value;
        this.endClientX = this.startClientX + Math.floor((this.endClientX - this.startClientX + value / 2) / value) * value;
    }

    /**
     * 还原节点位置。
     * @param duration 渐变的总毫秒数。
     */
    revert(duration?: number) {
        this.disable();
        animate(this.elem, {
            left: this.startClientX,
            top: this.startClientY,
        }, () => {
            this.enable();
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
    snap(target: Document | HTMLElement | Rect, padding = 0, distance = 15, position: "both" | "inside" | "outside" = "both") {
        target = (target as Document | HTMLElement).nodeType ? getRect(target as Document | HTMLElement) : target as Rect;
        const inside = position !== "outside";
        const outside = position !== "inside";

        this.elem.style.top = this.endClientY + "px";
        this.elem.style.left = this.endClientX + "px";
        const rect = getRect(this.elem);

        let result = 0;

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
            result += 1;
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
            result += 2;
        }

        return result;
    }

}

Draggable.prototype.delay = 500;
Draggable.prototype.distance = 3;

/**
 * 设置指定的元素可拖动。
 * @param elem 要拖动的元素。
 * @param options 拖动的选项。
 * @return 返回一个拖动对象。
 */
export default function draggable(elem: HTMLElement, options?: Partial<Draggable>) {
    const position = getStyle(elem, "position");
    if (!position || position === "static") {
        elem.style.position = "relative";
    }
    const result = new Draggable();
    result.handle = result.elem = elem;
    Object.assign(result, options);
    result.enable();
    return result;
}
