import { VNode, bind } from "ui/control";
import Input from "ui/input";
import "./textBox.scss";

/**
 * 表示一个文本框。
 */
export default class TextBox extends Input {

    protected render() {
        return <input type="text" class="x-textbox" />;
    }

    value: string;

    /**
     * 选择结束事件。
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onselect
     */
    @bind("@input", "onSelect") onSelectEnd: (e: UIEvent, sender: this) => void;

    /**
     * 全选当前控件。
     */
    select() {
        this.input.select();
    }

}

TextBox.prototype.statusClassPrefix = "x-textbox-";
TextBox.prototype.validateEvent = "input";
TextBox.prototype.validateDelay = 500;
