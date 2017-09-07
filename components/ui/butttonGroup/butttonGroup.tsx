import { Control, VNode, bind } from "control";
import "./butttonGroup.scss";

/**
 * 表示一个按钮组。
 */
export class ButttonGroup extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-butttongroup"></div>;
    }

}

export default ButttonGroup;
