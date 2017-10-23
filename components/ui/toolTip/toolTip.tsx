import Control, { VNode, bind, NodeLike } from "ui/control";
import Popup from "ui/popup";
import "./toolTip.scss";

/**
 * 表示一个工具提示。
 */
export default class ToolTip extends Popup {

    /**
     * @default "hover"
     */
    event: Popup["event"];

    /**
     * @default "top"
     */
    align: Popup["align"];

    /**
     * @default "zoomOut"
     */
    animation: Popup["animation"];

    protected render() {
        return <div class="x-tooltip" style="display: none;"><span class="x-arrow"></span></div>;
    }

}

ToolTip.prototype.event = "hover";
ToolTip.prototype.align = "top";
ToolTip.prototype.animation = "zoomOut";
