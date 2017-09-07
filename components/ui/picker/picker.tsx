import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import Input from "ui/input";
import { Popup } from "ux/popup";
import { Status, getStatus, setStatus } from "ux/status";
import "ui/textBox/textBox.scss";
import "ui/button/button.scss";
import "./picker.scss";

/**
 * 表示一个填选器。
 */
export default class Picker extends Input {

    protected render() {
        return <span class="x-picker">
            <input type="text" class="x-textbox" autocomplete="off" />
            <button type="button" class="x-button" tabIndex={-1}><i class="x-icon">⮟</i></button>
        </span>;
    }

    /**
     * 按钮。
     */
    @bind(".x-button") button: HTMLButtonElement;

    /**
     * 图标。
     */
    @bind(".x-button .x-icon", "innerHTML") icon: string;

    get status() {
        return getStatus(this.input, this.statusClassPrefix);
    }

    set status(value) {
        setStatus(this.input, this.statusClassPrefix, value);
    }

    get disabled() {
        return this.input.disabled;
    }
    set disabled(value) {
        this.button.disabled = this.input.disabled = value;
    }

    get readOnly() {
        return this.input.readOnly && this.button.disabled;
    }
    set readOnly(value) {
        this.button.disabled = this.input.readOnly = value;
        dom.toggleClass(this.elem, "x-picker-readonly", value);
    }

    /**
     * 是否允许用户输入。
     */
    get canInput() {
        return !dom.hasClass(this.elem, "x-picker-select");
    }
    set canInput(value) {
        dom.toggleClass(this.elem, "x-picker-select", !value);
        this.input.readOnly = !value;
    }

    /**
     * 是否允许用户选择。
     */
    get canSelect() {
        return !dom.isHidden(this.button);
    }
    set canSelect(value) {
        dom.toggle(this.button, !value);
    }

    /**
     * 下拉菜单。
     */
    dropDown = new Popup();

    /**
     * 下拉菜单的选项。
     */
    dropDownOptions: Partial<Popup>;

    /**
     * 菜单控件。
     */
    menu: Control;

    protected init() {
        super.init();
        this.menu.renderTo(this.elem);
        dom.addClass(this.menu.elem, "x-popup");
        if (this.resizeMode === "fitDropDown") {
            dom.setRect(this.elem, { width: dom.getRect(this.menu.elem).width });
        }
        dom.hide(this.menu.elem);

        const dropDown = this.dropDown;
        dropDown.elem = this.menu.elem;
        dropDown.target = this.button;
        dropDown.pinTarget = this.elem;
        dropDown.align = "bottomLeft";
        dropDown.event = "click";
        dropDown.onShow = () => {
            this.handleDropDownShow();
        };
        dropDown.onHide = () => {
            this.handleDropDownHide();
        };
        Object.assign(dropDown, this.dropDownOptions);
        dropDown.enable();

        dom.on(this.button, "click", this.input.focus, this.input);
    }

    /**
     * 当被子类重写时负责创建一个下拉菜单。
     */
    protected createMenu() {
        return new Control();
    }

    /**
     * 当被子类重写时负责更新下拉菜单的值。
     */
    protected updateMenu() { }

    /**
     * 下拉菜单显示事件。
     * @param sender 事件源。
     */
    onDropDownShow: (sender: this) => void;

    /**
     * 下拉菜单隐藏事件。
     * @param sender 事件源。
     */
    onDropDownHide: (sender: this) => void;

    /**
     * 下拉框大小模式。
     * - auto（默认）: 确保下拉菜单比文本框宽度大。
     * - fitInput: 下拉菜单适应文本框宽度。
     * - fitDropDown: 文本框适应下拉菜单宽度。
     */
    resizeMode: "fitInput" | "fitDropDown" | "auto";

    /**
     * 处理下拉菜单显示事件。
     */
    protected handleDropDownShow() {
        if (this.disabled || this.readOnly) {
            this.dropDown.hide();
            return;
        }
        this.updateMenu();
        if (this.resizeMode !== "fitDropDown") {
            const elemWidth = dom.getRect(this.elem).width;
            if (this.resizeMode === "fitInput" || dom.getRect(this.dropDown.elem).width < elemWidth) {
                dom.setRect(this.dropDown.elem, { width: elemWidth });
            }
        }
        this.dropDown.realign();
        this.onDropDownShow && this.onDropDownShow(this);
    }

    /**
     * 处理下拉菜单隐藏事件。
     */
    protected handleDropDownHide() {
        this.onDropDownHide && this.onDropDownHide(this);
    }

}

Picker.prototype.statusClassPrefix = "x-textbox-";
Picker.prototype.resizeMode = "auto";
Picker.prototype.validateEvent = "input";
