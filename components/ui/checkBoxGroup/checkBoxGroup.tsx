import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import CheckBox, { CheckBoxBase } from "ui/checkBox";
import "./checkBoxGroup.scss";

/**
 * 表示一个复选框组基类。
 */
export abstract class CheckBoxGroupBase extends Control {

    @bind("") body: HTMLElement;

    /**
     * 获取所有按钮。
     */
    get inputs() { return this.query("input[type=checkbox],input[type=radio]") as CheckBoxBase[]; }

    /**
     * 组名称。
     */
    get name() {
        return (this.inputs[0] || 0).name;
    }
    set name(value: string) {
        this.inputs.forEach(input => { input.name = value; });
    }

    /**
     * 是否禁用。
     */
    get disabled() {
        return (this.inputs[0] || 0).disabled;
    }
    set disabled(value: boolean) {
        this.inputs.forEach(input => { input.disabled = value; });
    }

    /**
     * 是否只读。
     */
    get readOnly() {
        return (this.inputs[0] || 0).readOnly;
    }
    set readOnly(value: boolean) {
        this.inputs.forEach(input => { input.readOnly = value; });
    }

}

/**
 * 表示一个复选框组。
 */
export default class CheckBoxGroup extends CheckBoxGroupBase {
    inputs: CheckBox[];
    get value() {
        return this.inputs.filter(input => input.value).map(input => input.key);
    }
    set value(value) {
        for (const input of this.inputs) {
            input.value = value.indexOf(input.key) >= 0;
        }
    }
}
