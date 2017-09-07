import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./colorPicker.scss";

/**
 * 表示一个颜色选择器。
 */
export default class ColorPicker extends Control {

    protected render() {
        return <div class="x-colorpicker"></div>;
    }

}
