import { VNode, bind } from "ui/control";
import { CheckBoxBase } from "ui/checkBox";

/**
 * 表示一个单选按钮。
 */
export default class RadioButton extends CheckBoxBase {

    protected render() {
        return <label class="x-checkbox x-radiobutton">
            <input type="radio" class="x-checkbox-button" __control__={this as any} />
            <i class="x-icon">◯</i>
            <i class="x-icon">🖸</i>
            &nbsp;
        </label>;
    }

}
