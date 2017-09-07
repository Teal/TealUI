import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import Dialog from "ui/dialog";
import "typo/util";
import "ui/textBox/textBox.scss";
import "ui/button/button.scss";
import "./messageBox.scss";

/**
 * 表示一个消息框。
 */
export default class MessageBox extends Dialog {

    /**
     * 当点击关闭按钮后执行。
     */
    protected handleCloseClick() {
        this.cancel();
    }

    /**
     * 点击确定按钮。
     */
    ok() {
        if (!this.onOk || this.onOk() !== false) {
            this.close();
        }
    }

    /**
     * 点击取消按钮。
     */
    cancel() {
        if (!this.onCancel || this.onCancel() !== false) {
            this.close();
        }
    }

    /**
     * 点击确定事件。
     */
    onOk: () => boolean | void;

    /**
     * 点击取消事件。
     */
    onCancel: () => boolean | void;

    /**
     * 图标。
     */
    set icon(value: "error" | "warning" | "info" | "success" | "confirm" | null) {
        let icon = dom.prev(this.body, ".x-panel-icon");
        if (value) {
            (icon || (icon = dom.before(this.body, "<span/>") as HTMLElement)).className = `x-icon x-panel-icon x-panel-icon-${value}`;
        } else {
            dom.remove(icon);
        }
    }

    /**
	 * 按钮。
	 */
    set buttons(value: { [content: string]: boolean | (() => void) } | null) {
        let buttons = dom.next(this.body, ".x-panel-buttons");
        if (value === null) {
            dom.remove(buttons);
        } else {
            if (buttons) {
                buttons.innerHTML = "";
            } else {
                buttons = dom.append(dom.find(this.elem, ".x-panel")!, `<div class="x-panel-buttons"></div>`) as HTMLElement;
            }
            for (const key in value) {
                const click = value[key];
                const button = dom.append(buttons, `<button class="x-button"></button>`) as HTMLButtonElement;
                dom.setText(button, key);
                if (click === true) {
                    dom.addClass(button, "x-button-primary");
                }
                dom.on(button, "click", click === true ? this.ok : click === false ? this.cancel : click, this);
            }
        }
    }

    /**
     * 主按钮。
     */
    set primaryButton(value: number) {
        const old = dom.find(this.elem, ".x-dialog-buttons > .x-button-primary");
        if (old) {
            dom.removeClass(old, "x-button-primary");
        }
        const btn = dom.find(this.elem, `.x-dialog-buttons > .x-button:nth-child(${value + 1})`);
        if (btn) {
            dom.addClass(btn, "x-button-primary");
        }
    }

    /**
     * 显示一个消息框。
     * @param content 消息框的内容。
     * @param title 消息框的标题。
     * @param buttons 消息框的按钮。
     * @param icon 消息框的图标。
     * @param onOk 点击确定事件。
     * @param onCancel 点击取消事件。
     */
    static show(content: MessageBox["content"], title: MessageBox["title"] = "提示", buttons: MessageBox["buttons"] = { 确定: true }, icon?: MessageBox["icon"], onOk?: MessageBox["onOk"], onCancel?: MessageBox["onCancel"]) {
        const result = new MessageBox();
        result.content = content;
        result.title = title;
        result.draggable = true;
        result.buttons = buttons;
        result.icon = icon!;
        result.onOk = onOk!;
        result.onCancel = onCancel!;
        result.show();
        return result;
    }

    /**
     * 显示一个警告框。
     * @param content 消息框的内容。
     * @param title 消息框的标题。
     * @param onOk 点击确定事件。
     */
    static alert(content: MessageBox["content"], title: MessageBox["title"] = "警告", onOk?: MessageBox["onOk"]) {
        return MessageBox.show(content, title, undefined, "warning", onOk, onOk);
    }

    /**
     * 显示一个确认框。
     * @param content 消息框的内容。
     * @param title 消息框的标题。
     * @param onOk 点击确定事件。
     * @param onCancel 点击取消事件。
     */
    static confirm(content: MessageBox["content"], title: MessageBox["title"] = "确认", onOk?: MessageBox["onOk"], onCancel?: MessageBox["onCancel"]) {
        const result = MessageBox.show(content, title, {
            "确定": true,
            "取消": false
        }, "confirm", onOk, onCancel);
        return result;
    }

    /**
     * 显示一个输入框。
     * @param content 消息框的内容。
     * @param title 消息框的标题。
     * @param onOk 点击确定事件。
     * @param onCancel 点击取消事件。
     */
    static prompt(content: string, title: MessageBox["title"] = "请输入", onOk?: (value: string) => boolean | void, onCancel?: MessageBox["onCancel"]) {
        const result = MessageBox.show(`<input type="text" class="x-textbox x-block">`, title, {
            "确定": true,
            "取消": false
        }, undefined, () => {
            onOk && onOk.call(result, (result.find(".x-textbox") as HTMLInputElement).value);
        }, onCancel);
        (result.find(".x-textbox") as HTMLInputElement).value = content;
        return result;
    }

}
