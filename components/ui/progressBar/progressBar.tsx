import { Control, VNode, bind } from "control";
import "./progressBar.scss";

/**
 * 表示一个进度条。
 */
export class ProgressBar extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-progressbar"></div>;
    }

}

export default ProgressBar;
