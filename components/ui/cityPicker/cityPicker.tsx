import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./cityPicker.scss";

/**
 * 表示一个城市选择器。
 */
export default class CityPicker extends Control {

    protected render() {
        return <div class="x-citypicker"></div>;
    }

}
