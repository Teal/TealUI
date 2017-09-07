import { Control, VNode, bind } from "control";
import "./richTextBox.scss";

/**
 * 表示一个富文本编辑器。
 */
export class RichTextBox extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-richtextbox"></div>;
    }

}

export default RichTextBox;
