import Control, { VNode, bind, NodeLike } from "ui/control";
import "./button.scss";

/**
 * 表示一个按钮。
 */
export default class Button extends Control {

    protected render() {
        return <button type="button" class="x-button"></button>;
    }

    /**
     * 类型。
     */
    @bind("", "type") type: "button" | "submit" | "reset";

    /**
     * 是否禁用。
     */
    @bind("", "disabled") disabled: boolean;

    /**
     * 按下状态。
     */
    @bind("", "class", "x-button-active") active: boolean;

}
