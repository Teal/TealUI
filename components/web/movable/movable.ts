import * as dom from "web/dom";

/**
 * 创建一个可移动对象。
 * @param elem 要移动的元素。
 * @param options 移动的选项。
 * @return 返回一个移动对象。
 */
export default function movable(elem: HTMLElement, options?: Partial<Movable>) {
    const r = new Movable();
    r.elem = elem;
    Object.assign(r, options).enable();
    return r;
}

/**
 * 表示一个可移动的对象。
 */
export class Movable {

    /**
     * 移动的元素。
     */
    elem: HTMLElement;

    /**
     * 从指针按下到触发移动事件的等待毫秒数。如果为 -1 则忽略指针按下不动的操作。
     * @default -1
     */
    delay: number;

    /**
     * 允许触发移动事件的最小指针移动距离（单位：像素）。当移动距离小于这个值时忽略移动操作。
     * @default 3
     */
    distance: number;

    /**
     * 判断是否取消指定事件引发的移动效果。
     * @param e 事件对象。
     * @return 如果返回 true 则取消移动，否则允许开始移动。
     * @desc 默认地，如果是点击输入域则取消移动。
     */
    cancel(e: MouseEvent) {
        return e.target !== this.elem && /^(?:INPUT|TEXTAREA|BUTTON|SELECT|OPTION)/i.test((e.target as HTMLElement).tagName);
    }

    /**
     * 启用移动效果。
     */
    enable() {
        dom.on(this.elem, "pointerdown", this.handlePointerDown, this, { passive: false });
    }

    /**
     * 禁用移动效果。
     */
    disable() {
        dom.off(this.elem, "pointerdown", this.handlePointerDown, this, { passive: false });
    }

    /**
     * 获取开始移动的水平坐标（单位：像素）。
     */
    startX: number;

    /**
     * 获取开始移动的垂直坐标（单位：像素）。
     */
    startY: number;

    /**
     * 获取当前的水平坐标（单位：像素）。
     */
    endX: number;

    /**
     * 获取当前的垂直坐标（单位：像素）。
     */
    endY: number;

    /**
     * 获取移动的水平距离（单位：像素）。
     */
    get offsetX() { return this.endX - this.startX; }

    /**
     * 获取移动的垂直距离（单位：像素）。
     */
    get offsetY() { return this.endY - this.startY; }

    /**
     * 当前正在移动的对象。
     */
    static current?: Movable;

    /**
     * 处理指针按下事件。
     * @param e 事件对象。
     */
    protected handlePointerDown(e: MouseEvent) {
        if (!e.button && !this.cancel(e)) {

            // 不允许两个对象同时移动。
            if (Movable.current) {
                Movable.current.uninit(e);
            }

            // 记录开始位置。
            this.endX = this.startX = e.pageX;
            this.endY = this.startY = e.pageY;

            // 设置下一次移动时初始化移动。
            this._handler = this.init;

            // 延时以避免将简单的点击作为移动处理。
            this._timer = this.delay >= 0 ? setTimeout(() => {
                this._timer = 0;
                this._handler(e);
            }, this.delay) : -1;

            // 绑定指针移动和松开事件。
            const doc = this.elem.ownerDocument;
            dom.on(doc, "pointerup", this.handlePointerUp, this, { passive: true });
            dom.on(doc, "pointermove", this.handlePointerMove, this, { passive: false });

            // 禁用页面选择。
            e.preventDefault();
        }
    }

    /**
     * 处理指针移动事件。
     * @param e 事件对象。
     */
    protected handlePointerMove(e: MouseEvent) {

        // 禁用页面滚动。
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
        if (!e.button) {
            this.uninit(e);
        }
    }

    /**
     * 当前实际处理移动指针移动的函数。可能是 *init* 或 *move*。
     */
    private _handler: (e: MouseEvent) => void;

    /**
     * 开始移动的计时器。
     */
    private _timer: any;

    /**
     * 进入移动状态。
     * @param e 事件对象。
     */
    protected init(e: MouseEvent) {
        // 进入移动状态有两种可能：
        // 1. 鼠标按下并移动，触发 pointermove 事件，此时 _timer 为等待超时的计时器。
        // 2. 鼠标按下且不动时间超过 delay，触发 setTimeout，此时 _timer 为 0。
        if (this._timer) {
            // 如果移动距离过小，则不进入移动状态。
            if (this.offsetX ** 2 + this.offsetY ** 2 < this.distance ** 2) {
                return;
            }
            clearTimeout(this._timer);
            this._timer = 0;
        }

        // 更新当前正在移动的对象。
        Movable.current = this;

        // 锁定全局样式。
        this._originalCursor = document.documentElement.style.cursor;
        document.documentElement.style.cursor = dom.getStyle(this.elem, "cursor");
        this._originalPointerEvents = document.body.style.pointerEvents;
        document.body.style.pointerEvents = "none";
        if ((document.body as any).setCapture) {
            (document.body as any).setCapture();
        }

        // 开始移动，并允许强制撤销移动操作。
        if (this.moveStart(e) === false) {
            this.uninit(e);
            return;
        }

        // 移动。
        this._handler = this.move;
        this.move(e);
    }

    /**
     * 退出移动状态。
     * @param e 事件对象。
     */
    protected uninit(e: MouseEvent) {

        // 解绑全局指针松开事件。
        const doc = this.elem.ownerDocument;
        dom.off(doc, "pointermove", this.handlePointerMove, this, { passive: false });
        dom.off(doc, "pointerup", this.handlePointerUp, this, { passive: true });

        // 清空计时器。
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = 0;
        }

        if (Movable.current === this) {

            // 恢复全局样式。
            document.documentElement.style.cursor = this._originalCursor;
            document.body.style.pointerEvents = this._originalPointerEvents;
            if ((document.body as any).releaseCapture) {
                (document.body as any).releaseCapture();
            }

            // 结束移动。
            this.moveEnd(e);
            Movable.current = undefined;
        }

    }

    /**
     * 移动前鼠标样式。
     */
    private _originalCursor: string | null;

    /**
     * 移动前指针事件。
     */
    private _originalPointerEvents: string | null;

    /**
     * 触发移动开始事件。
     * @param e 事件对象。
     * @return 如果返回 false 则忽略本次移动。
     */
    moveStart(e: MouseEvent): boolean | void { }

    /**
     * 触发移动事件。
     * @param e 事件对象。
     */
    move(e: MouseEvent) { }

    /**
     * 触发移动结束事件。
     * @param e 事件对象。
     */
    moveEnd(e: MouseEvent) { }

}

Movable.prototype.delay = -1;
Movable.prototype.distance = 3;
