import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./timePicker.scss";

/**
 * 表示一个时间选择器。
 */
export default class TimePicker extends Control {

    protected render() {
        return <div class="x-timepicker"></div>;
    }

}
