import { Control, VNode, bind } from "control";
import "./progressCircle.scss";

/**
 * 表示一个进度圈。
 */
export class ProgressCircle extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-progresscircle"></div>;
    }

}

export default ProgressCircle;
