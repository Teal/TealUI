import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./formLayout.scss";

/**
 * 表示一个表单布局。
 */
export default class FormLayout extends Control {

    protected render() {
        return <div class="x-formlayout"></div>;
    }

}
