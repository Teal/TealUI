import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import RadioButton from "ui/radioButton";
import { CheckBoxGroupBase } from "ui/checkBoxGroup";
import Input from "ui/input";

/**
 * 表示一个单选按钮组。
 */
export default class RadioButtonGroup extends CheckBoxGroupBase {
    inputs: RadioButton[];
    private static _id = 0;
    protected init() {
        if (!this.name) this.name = "_" + RadioButtonGroup._id++;
    }
    get value() {
        const item = this.inputs.find(input => input.value);
        return item ? item.key : null;
    }
    set value(value) {
        this.inputs.forEach(item => {
            item.value = item.key === value;
        });
    }
}
