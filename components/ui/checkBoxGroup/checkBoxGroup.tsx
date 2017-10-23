import * as dom from "web/dom";
import Control, { VNode, bind, data } from "ui/control";
import CheckBox from "ui/checkBox";

/**
 * 表示一个复选框组。
 */
export default class CheckBoxGroup extends Control {

    /**
     * 获取焦点事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/nfocus
     */
    @bind("@input", "onFocus") onFocus: (e: FocusEvent, sender: this) => void;

    /**
     * 失去焦点事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onblur
     */
    @bind("@input", "onBlur") onBlur: (e: FocusEvent, sender: this) => void;

    /**
     * 当前元素和子元素获取焦点事件。
     * @see https://msdn.microsoft.com/zh-CN/library/ms536935(VS.85).aspx
     */
    @bind("@input", "onFocusIn") onFocusIn: (e: FocusEvent, sender: this) => void;

    /**
     * 当前元素和子元素失去焦点事件。
     * @see https://msdn.microsoft.com/zh-CN/library/ms536936(VS.85).aspx
     */
    @bind("@input", "onFocusOut") onFocusOut: (e: FocusEvent, sender: this) => void;

    /**
     * 更改事件。
     */
    @bind("", "onChange") onChange: (e: Event, sender: this) => void;

    /**
     * 获取所有按钮。
     */
    get inputs() { return this.query("input[type=checkbox],input[type=radio]") as CheckBox[]; }

    /**
     * 组名称。
     */
    get name() {
        return data(this).name;
    }
    set name(value: string) {
        data(this).name = value;
        this.inputs.forEach(input => { input.name = value; });
    }

    /**
     * 是否禁用。
     */
    get disabled() {
        return data(this).disabled;
    }
    set disabled(value: boolean) {
        data(this).disabled = value;
        this.inputs.forEach(input => { input.disabled = value; });
    }

    /**
     * 是否只读。
     */
    get readOnly() {
        return data(this).readOnly;
    }
    set readOnly(value: boolean) {
        data(this).readOnly = value;
        this.inputs.forEach(input => { input.readOnly = value; });
    }

    get value() {
        return this.inputs.filter(input => input.value).map(input => input.key);
    }
    set value(value) {
        next: for (const input of this.inputs) {
            const key = input.key;
            for (const item of value) {
                if (item == key) {
                    input.value = true;
                    continue next;
                }
            }
            input.value = false;
        }
    }

}
