import { Control, VNode, bind } from "control";
import "./imageEditor.scss";

/**
 * 表示一个图片编辑器。
 */
export class ImageEditor extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-imageeditor"></div>;
    }

}

export default ImageEditor;
