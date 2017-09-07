import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./palette.scss";

/**
 * 表示一个调色板。
 */
export default class Palette extends Control {

    protected render() {
        return <div class="x-palette"></div>;
    }

}
