import { Control, VNode, bind } from "control";
import "./ubbEditor.scss";

/**
 * 表示一个Ubb编辑器。
 */
export class UbbEditor extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-ubbeditor"></div>;
    }

}

export default UbbEditor;
