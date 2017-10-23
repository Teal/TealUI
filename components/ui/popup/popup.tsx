import * as dom from "web/dom";
import pin, { PinAlign, PinResult } from "web/pin";
import popup, { Popup as UxPopup } from "web/popup";
import Control, { VNode, bind, from, data } from "ui/control";
import "typo/arrow";
import "./popup.scss";

/**
 * 表示一个弹层。
 */
export default class Popup extends Control {

    protected render() {
        return <div class="x-popup" style="display: none;"></div>;
    }
    
    /**
     * 触发弹层显示的元素。
     */
    get target(): UxPopup["target"] | null {
        return data(this).target;
    }
    set target(value) {
        const old = this.target;
        if (old !== value) {
            if (old) {
                UxPopup.prototype.disable.call(this);
            }
            data(this).target = value;
            if (value) {
                UxPopup.prototype.enable.call(this);
            }
        }
    }

    /**
     * 触发弹层显示的事件。
     * @desc
     * - `click`(默认): 点击 `target` 后弹出，点击屏幕空白处消失。
     * - `dblclick`: 双击 `target` 后弹出，点击屏幕空白处消失。
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
     * @default "click"
     */
    event: UxPopup["event"];

    /**
     * 显示弹层的延时毫秒数。仅对指针移动事件有效。
     * @default 100
     */
    delay: UxPopup["delay"];

    /**
     * 弹层对齐的目标节点或区域。
     * @default target
     */
    pinTarget?: UxPopup["pinTarget"];

    /**
     * 弹层对齐的位置。如果为 null 则不自动对齐。
     * @default "bottomLeft"
     */
    align: UxPopup["align"];

    /**
     * 元素的外边距，即对齐时元素和 *pinTarget* 的距离。
     * @default 0
     */
    margin?: UxPopup["margin"];

    /**
     * 容器节点或区域，定位超出容器后会自动调整。
     * @default document
     */
    container?: UxPopup["container"];

    /**
     * 容器的内边距。
     * @default 0
     */
    containerPadding?: UxPopup["containerPadding"];

    /**
     * 定位后的额外偏移距离。如果小于 1，则表示相对元素大小的百分比。
     * @default 0
     */
    offset?: UxPopup["offset"];

    /**
     * 如果容器比元素小，是否允许更改元素大小。
     * @default false
     */
    resize?: UxPopup["resize"];

    /**
     * 显示弹层时使用的动画。
     * @default "opacity"
     */
    animation: UxPopup["animation"];

    /**
     * 隐藏弹层时使用的动画。
     * @default animation
     */
    hideAnimation?: UxPopup["hideAnimation"];

    /**
     * 隐藏动画的持续毫秒数。
     * @default duration
     */
    hideDuration?: UxPopup["hideDuration"];

    /**
     * 显示弹层时使用的动画渐变函数。
     * @default "ease-in"
     */
    timingFunction: UxPopup["timingFunction"];

    /**
     * 隐藏弹层时使用的动画渐变函数。
     * @default timingFunction
     */
    hideTimingFunction: UxPopup["hideTimingFunction"];

    /**
     * 是否在点击屏幕空白处后消失。
     * @default true
     */
    autoHide: UxPopup["autoHide"];

    /**
     * 是否在滚动后自动重定位。
     * @default true
     */
    autoScroll: UxPopup["autoScroll"];

    /**
     * 弹层显示事件。
     * @param sender 事件源。
     */
    onShow?: (sender: this) => void;

    /**
     * 弹层隐藏事件。
     * @param sender 事件源。
     */
    onHide?: (sender: this) => void;

    /**
     * 弹层对齐事件。
     * @param r 对齐的结果。
     * @param sender 事件源。
     */
    onAlign?: (r: PinResult, sender: this) => void;

    /**
     * 是否禁用弹窗效果。
     */
    get disabled(): boolean {
        return data(this).disabled;
    }
    set disabled(value) {
        data(this).disabled = value;
        UxPopup.prototype[value ? "disable" : "enable"].call(this);
    }

    /**
     * 是否显示箭头。
     */
    get arrow() {
        return !!dom.first(this.elem, ".x-arrow");
    }
    set arrow(value) {
        const arrow = dom.first(this.elem, ".x-arrow");
        if (value) {
            if (!arrow) {
                dom.prepend(this.elem, `<span class="x-arrow"/>`);
            }
        } else {
            dom.remove(arrow);
        }
    }

    /**
     * 箭头指向位置偏移。如果小于 1 则表示相对于定位目标元素的偏移。
     */
    arrowOffset: number;

    protected render() {
        return <div class="x-popup" style="display: none"></div>;
    }

    layout() {
        let prev = dom.prev(this.elem);
        while (prev && from(prev) instanceof Popup) {
            prev = dom.prev(prev);
        }
        this.target = prev;
    }

    get hidden() { return dom.isHidden(this.elem); }

    /**
     * 显示当前弹层。
     */
    show() {
        dom.ready(() => {
            if (!dom.contains(document.body, this.elem)) {
                document.body.appendChild(this.elem);
            }
            UxPopup.prototype.show.call(this);
        });
    }

    /**
     * 隐藏当前弹层。
     */
    hide() {
        UxPopup.prototype.hide.call(this);
    }

    /**
     * 切换显示或隐藏当前弹层。
     * @param value 如果为 true 则强制显示。如果为 false 则强制隐藏。
     */
    toggle(value?: boolean) {
        UxPopup.prototype.toggle.call(this, value);
    }

    /**
     * 重新对齐弹层的位置。
     */
    realign() {
        const arrow = dom.first(this.elem, ".x-arrow");
        if (arrow && this.margin == undefined) {
            this.margin = arrow.offsetHeight / 2 + 2;
        }
        const pinResult = UxPopup.prototype.realign.call(this) as PinResult;

        // 根据定位的结果更新箭头。
        if (pinResult && arrow) {
            arrow.className = "x-arrow";
            switch (pinResult.align) {
                case "lr-tt":
                case "lr-bb":
                case "cc-tt":
                case "cc-bb":
                case "rl-tt":
                case "rl-bb":
                    if (!pinResult.transformY) {
                        const arrowSize = arrow.offsetWidth / 2;
                        const arrowPos = pinResult.target.x + pinResult.target.width / 2 - pinResult.x;
                        if (arrowPos >= arrowSize && arrowPos <= pinResult.width - arrowSize) {
                            arrow.className += ` x-arrow-${(pinResult.align.charAt(4) === "t") !== !!pinResult.rotateY ? "bottom" : "top"}`;
                            arrow.style.left = arrowPos + (this.arrowOffset ? this.arrowOffset < 1 ? pinResult.target.width * this.arrowOffset : this.arrowOffset : 0) + "px";
                        }
                    }
                    break;
                case "ll-tb":
                case "ll-cc":
                case "ll-bt":
                case "rr-tb":
                case "rr-cc":
                case "rr-bt":
                    if (!pinResult.transformX) {
                        const arrowSize = arrow.offsetHeight / 2;
                        const arrowPos = pinResult.target.y + pinResult.target.height / 2 - pinResult.y;
                        if (arrowPos >= arrowSize && arrowPos <= pinResult.height - arrowSize) {
                            arrow.className += ` x-arrow-${(pinResult.align.charAt(0) === "l") !== !!pinResult.rotateX ? "right" : "left"}`;
                            arrow.style.top = arrowPos + (this.arrowOffset ? this.arrowOffset < 1 ? pinResult.target.height * this.arrowOffset : this.arrowOffset : 0) + "px";
                        }
                    }
                    break;
            }
        }

        return pinResult;
    }

    /**
     * 处理文档指针按下事件。
     * @param e 事件参数。
     */
    protected handleDocumentPointerDown(e: MouseEvent) {
        (UxPopup.prototype as any).handleDocumentPointerDown.call(this, e);
    }

    /**
     * 处理文档滚动事件。
     * @param e 事件参数。
     */
    protected handleDocumentScroll(e: MouseEvent) {
        (UxPopup.prototype as any).handleDocumentScroll.call(this, e);
    }

    /**
     * 创建一个弹层。
     * @param elem 要弹出的元素或控件。
     * @param target 触发弹层显示的元素或控件。
     * @param event 触发弹层显示的事件。
     * @param align 显示弹层时使用的动画。如果为 null 则保留默认位置。
     * @param arrow 是否显示箭头。
     * @param animation 显示弹层时使用的动画。
     * @return 返回创建的弹层对象。
     */
    static create(elem: HTMLElement | Control, target: HTMLElement | Control, event?: Popup["event"], align?: Popup["align"], arrow?: Popup["arrow"], animation?: Popup["animation"]) {
        const r = new this();
        r.body.appendChild(elem instanceof Control ? elem.elem : elem);
        if (event) r.event = event;
        if (align) r.align = align;
        if (arrow) r.arrow = arrow;
        if (animation) r.animation = animation;
        r.target = target instanceof Control ? target.elem : target;
        return r;
    }

}

Popup.prototype.event = UxPopup.prototype.event;
Popup.prototype.delay = UxPopup.prototype.delay;
Popup.prototype.autoHide = UxPopup.prototype.autoHide;
Popup.prototype.autoScroll = UxPopup.prototype.autoScroll;
Popup.prototype.animation = UxPopup.prototype.animation;
Popup.prototype.align = UxPopup.prototype.align;
