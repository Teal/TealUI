import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./emailSuggest.scss";

/**
 * 表示一个邮箱提示。
 */
export default class EmailSuggest extends Control {

    protected render() {
        return <div class="x-emailsuggest"></div>;
    }

}
