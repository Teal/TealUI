import { Control, VNode, bind } from "control";
import "./toast.scss";

/**
 * 表示一个通知。
 */
export class Toast extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-toast"></div>;
    }

}

export default Toast;
