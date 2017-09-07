import { hide } from "ux/dom";
import Control, { VNode, bind } from "ui/control";
import { getState, setState } from "ui/input";
import "typo/icon";
import "typo/close";
import "./tipBox.scss";

/**
 * 表示一个提示框。
 */
export default class TipBox extends Control {

    protected render() {
        return <div class="x-tipbox">
            <button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button>
            <span class="x-tipbox-body"></span>
        </div>;
    }

    @bind(".x-tipbox-body") body: HTMLSpanElement;

    /**
     * 关闭当前提示框。
     */
    close() { hide(this.elem, "height", this.duration); }

    get state() {
        return getState(this.elem, "x-textbox-");
    }
    set state(value) {
        setState(this.elem, "x-textbox-", value);
    }

}
