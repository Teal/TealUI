import { Control, VNode, bind } from "control";
import "./htmlEditor.scss";

/**
 * 表示一个HTML编辑器。
 */
export class HtmlEditor extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-htmleditor"></div>;
    }

}

export default HtmlEditor;
