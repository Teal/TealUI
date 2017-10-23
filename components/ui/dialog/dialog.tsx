import * as dom from "web/dom";
import draggable, { Draggable } from "web/draggable";
import Control, { bind, VNode, NodeLike } from "ui/control";
import "typo/icon";
import "typo/close";
import "ui/panel";
import "./dialog.scss";

/**
 * 表示一个对话框。
 */
export default class Dialog extends Control {

    protected render() {
        return <div class="x-dialog" style="display: none">
            <section class="x-panel">
                <header class="x-panel-header">
                    <button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button>
                    <h5></h5>
                </header>
                <div class="x-panel-body">
                </div>
            </section>
        </div>;
    }

    /**
     * 头部。
     */
    @bind(".x-panel-header") header: HTMLElement;

    /**
     * 标题。
     */
    @bind(".x-panel-header h5", "innerHTML") title: NodeLike;

    /**
     * 是否可关闭。
     */
    @bind(".x-panel-header .x-close", "hidden") hideClose: boolean;

    @bind(".x-panel-body") body: HTMLElement;

    protected init() {
        const close = dom.find(this.header, ".x-close");
        if (close) {
            dom.on(close, "click", this.handleCloseClick, this);
        }
        this.draggable = true;
    }

    /**
     * 当点击关闭按钮后执行。
     */
    protected handleCloseClick() {
        this.close();
    }

    /**
     * 切换显示的动画。
     */
    animation: dom.ToggleAnimation;

    /**
     * 切换显示的动画目标。
     */
    target?: HTMLElement;

    /**
     * 显示当前对话框。
     * @param target 显示的目标。
     */
    show(target?: HTMLElement) {
        if (target) {
            this.target = target;
        } else {
            target = this.target;
        }
        dom.ready(() => {
            if (!dom.contains(document.body, this.elem)) {
                document.body.appendChild(this.elem);
            }
            if (this.hidden) {
                dom.show(this.elem);
                dom.show(this.find(".x-panel") as HTMLElement, this.animation, undefined, this.duration, undefined, target);
                dom.addClass(document.body, "x-dialog-open");
            }
        });
    }

    /**
     * 关闭当前对话框。
     * @param target 关闭的目标。
     */
    close(target?: HTMLElement) {
        if (target) {
            this.target = target;
        } else {
            target = this.target;
        }
        if (!this.onBeforeClose || this.onBeforeClose() !== false) {
            this.elem.style.backgroundColor = "transparent";
            dom.hide(this.find(".x-panel") as HTMLElement, this.animation, () => {
                this.elem.style.backgroundColor = "";
                dom.removeClass(document.body, "x-dialog-open");
                this.renderTo(null);
                this.onClose && this.onClose();
            }, this.duration, undefined, target);
        }
    }

    /**
     * 即将关闭对话框事件。
     */
    onBeforeClose: () => boolean | void;

    /**
     * 关闭对话框事件。
     */
    onClose: () => void;

    private _draggable: Draggable;

    /**
     * 是否可拖动。
     */
    get draggable() {
        return !!this._draggable;
    }
    set draggable(value) {
        dom.toggleClass(this.elem, "x-dialog-draggable", value);
        if (value) {
            if (this._draggable) {
                this._draggable.enable();
            } else {
                this._draggable = draggable(this.find(".x-panel-header h5") as HTMLElement, {
                    proxy: this.find(".x-panel") as HTMLElement,
                    onDragStart: () => {
                        if (!this._draggable.proxy.style.margin) {
                            const rect = dom.getRect(this._draggable.proxy);
                            this._draggable.proxy.style.margin = "0";
                            dom.setRect(this._draggable.proxy, rect);
                        }
                    }
                });
            }
        } else if (this._draggable) {
            this._draggable.disable();
        }
    }

}

Dialog.prototype.animation = "scale";
