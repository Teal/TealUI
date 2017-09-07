import { Control, VNode, bind } from "control";
import "./inputGroup.scss";

/**
 * 表示一个输入框组。
 */
export class InputGroup extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-inputgroup"></div>;
    }

}

export default InputGroup;
