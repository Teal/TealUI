import * as dom from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import "./codeEditor.scss";

/**
 * 表示一个codeEditor。
 */
export default class CodeEditor extends Control {

    protected render() {
        return <div class="x-codeeditor"></div>;
    }

}
