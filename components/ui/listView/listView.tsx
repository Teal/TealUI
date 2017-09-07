import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./listView.scss";

/**
 * 表示一个列表视图。
 */
export default class ListView extends Control {

    protected render() {
        return <div class="x-listview"></div>;
    }

}
