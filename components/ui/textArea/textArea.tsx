import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import TextBox from "ui/textBox";

/**
 * 表示一个文本域。
 */
export default class TextArea extends TextBox {

    protected render() {
        return <textarea class="x-textbox" rows={6}></textarea>;
    }

    /**
     * 文本的行数。
     */
    @bind("@input", "rows") rows: number;

}
