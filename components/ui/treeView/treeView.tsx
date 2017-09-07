import { Control, VNode, bind } from "control";
import "./treeView.scss";

/**
 * 表示一个树视图。
 */
export class TreeView extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-treeview"></div>;
    }

}

export default TreeView;
