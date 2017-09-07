import { Control, VNode, bind } from "control";
import "./markdownEditor.scss";

/**
 * 表示一个Markdown编辑器。
 */
export class MarkdownEditor extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-markdowneditor"></div>;
    }

}

export default MarkdownEditor;
