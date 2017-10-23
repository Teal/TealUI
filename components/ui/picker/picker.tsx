import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import Input from "ui/input";
import { Popup } from "web/popup";
import { Status, getStatus, setStatus } from "web/status";
import TextBox from "ui/textBox";
import "ui/button/button.scss";
import "./picker.scss";

/**
 * 表示一个填选器。
 */
export default class Picker extends TextBox {

    protected render(): VNode {
        return <span class="x-picker">
            <input type="text" class="x-textbox" autocomplete="off" __control__={this} />
            <button type="button" class="x-button" tabIndex={-1}><i class="x-icon">⮟</i></button>
        </span>;
    }

    value: any;

    /**
     * 按钮。
     */
    @bind(".x-button") button: HTMLButtonElement;

    /**
     * 图标。
     */
    @bind(".x-button .x-icon", "innerHTML") icon: string;

    get disabled() {
        return this.input.disabled && this.button.disabled;
    }
    set disabled(value) {
        this.button.disabled = this.input.disabled = value;
    }

    get readOnly() {
        return this.input.readOnly && this.button.disabled;
    }
    set readOnly(value) {
        this.button.disabled = this.input.readOnly = value;
    }

    /**
     * 存储下拉菜单控件。
     */
    private _menu: Control;

    /**
     * 下拉菜单控件。
     */
    get menu() {
        let menu = this._menu;
        if (!menu) {
            this._menu = menu = this.createMenu();
            menu.renderTo(this.elem);
            dom.addClass(menu.elem, "x-popup");
            Object.assign(menu, this.menuOptions);
            if (this.resizeMode === "fitDropDown") {
                dom.show(menu.elem);
                dom.setRect(this.elem, { width: dom.getRect(menu.elem).width });
            }
            dom.hide(menu.elem);
        }
        return this._menu;
    }

    /**
     * 当被子类重写时负责创建下拉菜单。
     * @return 返回下拉菜单。
     */
    protected createMenu() {
        return new Control();
    }

    /**
     * 当被子类重写时负责更新下拉菜单的值。
     */
    protected updateMenu() { }

    /**
     * 下拉菜单控件的选项。
     */
    menuOptions: Partial<this["menu"]>;

    /**
     * 下拉框大小模式。
     * - auto（默认）: 确保下拉菜单比文本框宽度大。
     * - fitInput: 下拉菜单适应文本框宽度。
     * - fitDropDown: 文本框适应下拉菜单宽度。
     */
    resizeMode: "auto" | "fitInput" | "fitDropDown";

    get body() { return this.menu.body; }

    /**
     * 存储下拉菜单。
     */
    private _dropDown: Popup;

    /**
     * 下拉菜单。
     */
    get dropDown() {
        let dropDown = this._dropDown;
        if (!dropDown) {
            this._dropDown = dropDown = this.createDropDown();
            Object.assign(dropDown, this.dropDownOptions);
        }
        return dropDown;
    }

    /**
     * 当被子类重写时负责创建下拉菜单。
     * @return 返回下拉菜单。
     */
    protected createDropDown() {
        const dropDown = new Popup();
        dropDown.elem = this.menu.elem;
        dropDown.target = this.input;
        dropDown.pinTarget = this.elem;
        dropDown.align = "bottomLeft";
        dropDown.event = "focusin";
        dropDown.animation = "scaleY";
        dropDown.onShow = () => { this.handleDropDownShow(); };
        dropDown.onHide = () => { this.handleDropDownHide(); };
        return dropDown;
    }

    /**
     * 下拉菜单的选项。
     */
    dropDownOptions: Partial<Popup>;

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

    protected init() {
        super.init();

        // 初始化下拉效果。
        this.dropDown.enable();

        // 初始化按钮。
        dom.on(this.button, "click", this.handleButtonClick, this);
        dom.on(this.input, "input", this.handleInput, this);
    }

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
        this.onDropDownShow && this.onDropDownShow(this);
    }

    /**
     * 处理按钮点击事件。
     */
    protected handleButtonClick() {
        this.input.select();
    }

    /**
     * 处理下拉菜单隐藏事件。
     */
    protected handleDropDownHide() {
        this.onDropDownHide && this.onDropDownHide(this);
    }

    /**
     * 处理输入事件。
     */
    protected handleInput() {
        if (!this.dropDown.hidden) {
            this.updateMenu();
        }
    }

}

Picker.prototype.resizeMode = "auto";
