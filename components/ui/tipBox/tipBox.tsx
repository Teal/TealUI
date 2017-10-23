import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import { getStatus, setStatus } from "web/status";
import "typo/icon";
import "typo/close";
import "./tipBox.scss";

/**
 * 表示一个提示框。
 */
export default class TipBox extends Control {

    protected render() {
        return <div class="x-tipbox x-block">
            <button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button>
            <span class="x-tipbox-body"></span>
        </div>;
    }

    @bind(".x-tipbox-body") body: HTMLElement;

    /**
     * 是否可关闭。
     */
    get closable() {
        return !dom.isHidden(this.find(">.x-close") as HTMLElement);
    }
    set closable(value) {
        dom.toggle(this.find(">.x-close") as HTMLElement, value);
    }

    protected init() {
        dom.on(this.elem, "click", ">.x-close", this.close, this);
    }

    /**
     * 关闭当前提示框。
     */
    close() {
        dom.hide(this.elem, "height", () => {
            dom.remove(this.elem);
            this.onClose && this.onClose(this);
        }, this.duration);
    }

    /**
     * 关闭事件。
     */
    onClose: (sender: this) => void;

    /**
     * 状态。
     */
    get status() {
        return getStatus(this.elem, "x-tipbox-");
    }
    set status(value) {
        setStatus(this.elem, "x-tipbox-", value);
    }

}
