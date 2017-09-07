import { Draggable } from "ux/drag";
import { getRect, setRect, addClass, removeClass, computeStyle } from "ux/dom";
import "./splitter.scss";

/**
 * 表示一个分割条。
 */
export class Splitter extends Draggable {

    /**
     * 分割的第一个目标。
     */
    target1: HTMLElement;

    /**
     * 分割的第二个目标。
     */
    target2: HTMLElement;

    /**
     * 是否是水平分割条。
     */
    horizontal: boolean;

    /**
     * 当前滑块的最小位置（0-1 之间）。
     */
    minValue: number;

    /**
     * 当前滑块的最大位置（0-1 之间）。
     */
    maxValue: number;

    /**
     * 获取当前滑块的值（0-1 之间）。
     */
    getValue() {
        const prop = this.horizontal ? "height" : "width";
        return computeStyle(this.target1, prop) / computeStyle(this.target1.parentNode as HTMLElement, prop);
    }

    /**
     * 设置当前滑块的值。
     * @param value 要设置的值（0-1 之间）。
     */
    setValue(value: number) {
        const prop = this.horizontal ? "height" : "width";
        this.target1.style[prop] = value * 100 + "%";
        this.target2.style[prop] = (1 - value) * 100 + "%";
        this.realign();
    }

    /**
     * 重新对齐分割条的位置。
     */
    realign() {
        const rect = getRect(this.target2);
        delete rect[this.horizontal ? "height" : "width"];
        rect[this.horizontal ? "y" : "x"] -= this.elem[this.horizontal ? "offsetHeight" : "offsetWidth"] / 2;
        setRect(this.elem, rect);
    }

    /**
     * 本次拖动的开始值。
     */
    startValue: number;

    /**
     * 本次拖动的当前值。
     */
    endValue: number;

    /**
     * 触发拖动开始事件。
     * @param e 事件对象。
     * @return 如果返回 false 则忽略本次拖动。
     */
    protected dragStart(e: MouseEvent) {
        addClass(this.elem, "x-splitter-active");
        if (this.onDragStart && this.onDragStart(e, this) === false) {
            return false;
        }
        this.startValue = this.getValue();
        return true;
    }

    /**
     * 触发拖动移动事件。
     * @param e 事件对象。
     */
    protected dragMove(e: MouseEvent) {
        this.endValue = Math.min(Math.max(this.startValue + (this.horizontal ? this.endY - this.startY : this.endX - this.startX) / computeStyle(this.target1.parentNode as HTMLElement, this.horizontal ? "height" : "width"), this.minValue), this.maxValue);
        if (!this.onDragMove || this.onDragMove(e, this) !== false) {
            this.setValue(this.endValue);
        }
    }

    /**
     * 触发拖动结束事件。
     * @param e 事件对象。
     */
    protected dragEnd(e: MouseEvent) {
        removeClass(this.elem, "x-splitter-active");
        this.onDragEnd && this.onDragEnd(e, this);
    }

}

Splitter.prototype.minValue = 0.05;
Splitter.prototype.maxValue = 0.95;

/**
 * 创建一个分割条。
 * @param target1 分割的第一个目标。
 * @param target2 分割的第二个目标。
 * @param options 分割条的选项。
 */
export default function splitter(target1: HTMLElement, target2: HTMLElement, options?: Partial<Splitter>) {
    const splitter = new Splitter();
    splitter.target1 = target1;
    splitter.target2 = target2;

    splitter.handle = splitter.elem = target1.parentNode!.appendChild(document.createElement("div"));
    splitter.elem.className = "x-splitter";

    Object.assign(splitter, options);
    splitter.realign();
    splitter.enable();
    return splitter;
}
