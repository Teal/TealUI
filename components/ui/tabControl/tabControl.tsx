import { Control, VNode, bind } from "control";
import "./tabControl.scss";

/**
 * 表示一个选项卡控件。
 */
export class TabControl extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-tabcontrol"></div>;
    }

}

export default TabControl;
