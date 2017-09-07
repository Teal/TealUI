import { Control, VNode, bind } from "control";
import "./splitter.scss";

/**
 * 表示一个分割器。
 */
export class Splitter extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-splitter"></div>;
    }

}

export default Splitter;
