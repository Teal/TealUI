import * as dom from "ux/dom";
import pin, { PinAlign, PinResult } from "ux/pin";

/**
 * 表示一个弹层。
 */
export class Popup {

    /**
     * 触发弹层显示的元素。
     */
    target: HTMLElement;

    /**
     * 触发弹层显示的事件。
     * @desc
     * - `click`(默认): 点击 `target` 后弹出，点击屏幕空白处消失。
     * - `auxclick`: 右击 `target` 后弹出，点击屏幕空白处消失。
     * - `pointerdown`: 指针在 `target` 按下后弹出，点击屏幕空白处消失。
     * - `pointerup`: 指针在 `target` 按出后弹出，点击屏幕空白处消失。
     * - `contextmenu`：作为 `target` 右键菜单后弹出，点击屏幕空白处消失。
     * - `pointerenter`: 指针移入 `target`  后自动弹出，移到屏幕空白处消失。
     * - `hover`: 指针移入 `target` 后自动弹出，移出 `target` 后消失。
     * - `pointermove`: 指针移入 `target`  后自动弹出，并跟随鼠标移动。
     * - `active`：指针在 `target` 按下时显示，松开后消失。
     * - `focus`： `target` 获取焦点后显示，失去焦点后后消失。
     * - `focusin`：`target` 获取焦点后显示，点击屏幕空白处消失。
     * - 其它：不绑定事件。
     */
    event: "click" | "auxclick" | "contextmenu" | "pointerdown" | "pointerup" | "pointerenter" | "pointermove" | "hover" | "active" | "focus" | "focusin" | null;

    /**
     * 显示弹层的延时。仅对指针移动事件有效。
     */
    delay: number;

    /**
     * 弹层对齐的目标节点或区域。如果为 null 则不对齐。默认同 *target*。
     */
    pinTarget?: Document | HTMLElement | dom.Rect | null;

    /**
     * 弹层对齐的位置。
     */
    align?: PinAlign;

    /**
     * 元素的外边距。
     */
    margin?: number;

    /**
     * 容器节点或区域，定位超出容器后会自动调整。
     */
    container?: Document | HTMLElement | null;

    /**
     * 容器的内边距。
     */
    containerPadding?: number;

    /**
     * 定位后的额外偏移距离。如果小于 1，则表示相对元素大小的百分比。
     */
    offset?: number;

    /**
     * 如果容器比元素小，是否允许更改元素大小。
     */
    resize?: boolean;

    /**
     * 显示弹层时使用的动画。
     */
    animation?: dom.ToggleAnimation;

    /**
     * 弹层显示事件。
     * @param sender 触发事件的源。
     */
    onShow?: (sender: this) => void;

    /**
     * 弹层隐藏事件。
     * @param sender 触发事件的源。
     */
    onHide?: (sender: this) => void;

    /**
     * 弹层对齐事件。
     * @param result 对齐的结果。
     * @param sender 事件源。
     */
    onAlign?: (result: PinResult, sender: this) => void;

    /**
     * 切换效果的动画毫秒数。
     */
    duration?: number;

    /**
     * 是否在点击屏幕空白处后消失。
     */
    autoHide?: boolean;

    /**
     * 是否在滚动后自动重定位。
     */
    autoScroll?: boolean;

    /**
     * 弹层元素。
     */
    elem: HTMLElement;

    /**
     * 实际绑定的事件处理函数。
     */
    private _handle: any;

    /**
     * 实际绑定的事件处理函数。
     */
    private _handle1: any;

    /**
     * 实际绑定的事件处理函数。
     */
    private _handle2: any;

    /**
     * 启用弹层。
     */
    enable() {
        const target = this.target;
        let event = this.event;
        switch (event) {
            case "focusin":
                event = "focus";
            // fall through
            case "click":
            case "auxclick":
            case "pointerdown":
            case "pointerup":
                dom.on(target, event, this._handle = () => {
                    this.toggle();
                });
                break;
            case "pointermove":
                dom.on(target, event, this._handle = (e: MouseEvent) => {
                    this.align = "rr-bb";
                    this.pinTarget = {
                        x: e.pageX,
                        y: e.pageY,
                        width: 16,
                        height: 16
                    };
                    this.realign();
                });
            // fall through
            case "pointerenter":
            case "hover":
                let showTimer: number;
                let hideTimer: number;
                const show = this._handle1 = (e: PointerEvent) => {

                    // 如果正在隐藏弹层，则放弃隐藏保持打开状态。
                    if (hideTimer) {
                        clearTimeout(hideTimer);
                        hideTimer = 0;
                    } else {

                        // 否则倒计时显示。
                        showTimer = showTimer || setTimeout(() => {
                            showTimer = 0;
                            this.target = target as HTMLElement;
                            this.show();
                        }, this.delay) as any;
                    }
                };
                const hide = this._handle2 = (e: PointerEvent) => {

                    // 如果正在打开弹层，则放弃打开保持关闭状态。
                    if (showTimer) {
                        clearTimeout(showTimer);
                        showTimer = 0;
                    } else {

                        // 否则倒计时开始关闭。
                        hideTimer = hideTimer || setTimeout(() => {
                            hideTimer = 0;
                            this.hide();
                        }, this.delay) as any;
                    }
                };
                dom.on(target, "pointerenter", show);
                dom.on(target, "pointerleave", hide);

                // pointerenter 事件在指针移到目标元素后不消失。
                if (event === "pointerenter") {
                    dom.on(this.elem, "pointerenter", show);
                    dom.on(this.elem, "pointerleave", hide);
                }
                break;
            case "focus":
                dom.on(target, "focus", this.show, this);
                dom.on(target, "blur", this.hide, this);
                break;
            case "active":
                dom.on(target, "pointerdown", this.show, this);
                dom.on(document, "pointerup", this.hide, this);
                break;
            case "contextmenu":
                dom.on(target, event, this._handle = (e: MouseEvent) => {
                    if (e.which === 3) {
                        e.preventDefault();
                        this.align = "rr-bb";
                        this.pinTarget = {
                            x: e.pageX,
                            y: e.pageY,
                            width: 1,
                            height: 1
                        };
                        this.show();
                    }
                });
                break;
        }
    }

    /**
     * 禁用弹层。
     */
    disable() {
        const target = this.target;
        let event = this.event;
        switch (event) {
            case "focusin":
                event = "focus";
            // fall through
            case "click":
            case "auxclick":
            case "pointerdown":
            case "pointerup":
            case "contextmenu":
                dom.off(target, event, this._handle);
                delete this._handle;
                break;
            case "pointerenter":
                dom.off(this.elem, "pointerenter", this._handle1);
                dom.off(this.elem, "pointerleave", this._handle2);
            // fall through
            case "hover":
            case "pointermove":
                dom.off(target, "pointerenter", this._handle1);
                dom.off(target, "pointerleave", this._handle2);
                if (event === "pointermove") {
                    dom.off(target, event, this._handle);
                }
                delete this._handle1;
                delete this._handle2;
                delete this._handle;
                break;
            case "focus":
                dom.off(target, "focus", this.show, this);
                dom.off(target, "blur", this.hide, this);
                break;
            case "active":
                dom.off(target, "pointerdown", this.show, this);
                dom.off(document, "pointerup", this.hide, this);
                break;
        }
    }

    /**
     * 判断当前元素是否已隐藏。
     */
    get hidden() { return dom.isHidden(this.elem); }

    /**
     * 显示当前浮层。
     */
    show() {
        if (this.hidden) {
            dom.show(this.elem);
            this.realign();
            dom.show(this.elem, this.animation, undefined, this.duration, undefined, this.target);
            this.autoHide && dom.on(document, "pointerdown", this.handleDocumentPointerDown, this);
            this.autoScroll && dom.on(document, "scroll", this.handleDocumentScroll, this);
            this.onShow && this.onShow(this);
        } else {
            this.realign();
        }
    }

    /**
     * 隐藏当前浮层。
     */
    hide() {
        if (!this.hidden) {
            dom.hide(this.elem, this.animation, () => {
                this.onHide && this.onHide(this);
            }, this.duration, undefined, this.target);
            dom.off(document, "pointerdown", this.handleDocumentPointerDown, this);
            dom.off(document, "scroll", this.handleDocumentScroll, this);
        }
    }

    /**
     * 切换显示或隐藏当前浮层。
     * @param value 如果为 true 则强制显示。如果为 false 则强制隐藏。
     */
    toggle(value = this.hidden) {
        value ? this.show() : this.hide();
    }

    /**
     * 处理文档指针按下事件。
     * @param e 事件参数。
     */
    protected handleDocumentPointerDown(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!dom.contains(this.elem, target) && !dom.contains(this.target, target)) {
            this.hide();
        }
    }

    /**
     * 处理文档滚动事件。
     * @param e 事件参数。
     */
    protected handleDocumentScroll(e: MouseEvent) {
        this.realign();
    }

    /**
     * 重新对齐浮层的位置。
     * @return 如果已重新定位则返回定位的结果。
     */
    realign() {
        if (this.align && !this.hidden) {
            const pinResult = pin(this.elem, this.pinTarget || this.target, this.align, this.margin, this.container === undefined ? this.target.ownerDocument : this.container, this.containerPadding, this.offset, this.resize);
            this.onAlign && this.onAlign(pinResult, this);
            return pinResult;
        }
    }

}

Popup.prototype.event = "click";
Popup.prototype.delay = 100;
Popup.prototype.animation = "opacity";
Popup.prototype.align = "bottomLeft";
Popup.prototype.autoHide = Popup.prototype.autoScroll = true;

/**
 * 创建一个弹层。
 * @param elem 弹层的元素。
 * @param options 弹层的选项。
 * @return 返回一个弹层对象。
 */
export default function popup(elem: HTMLElement, options?: Partial<Popup>) {
    const result = new Popup();
    result.elem = elem;
    Object.assign(result, options);
    result.target = result.target || dom.prev(elem);
    result.enable();
    return result;
}
