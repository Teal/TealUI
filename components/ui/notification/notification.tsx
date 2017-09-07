import { Control, VNode, bind } from "control";
import "./notification.scss";

/**
 * 表示一个通知框。
 */
export class Notification extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-notification"></div>;
    }

}

export default Notification;
