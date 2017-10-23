import * as dom from "web/dom";
import Control, { VNode, bind, NodeLike } from "ui/control";
import "typo/icon/icon.scss";
import "./panel.scss";

/**
 * 表示一个面板。
 */
export default class Panel extends Control {

    protected render() {
        return <section class="x-panel">
            <header class="x-panel-header">
                <h5></h5>
            </header>
            <div class="x-panel-body"></div>
        </section>;
    }

    /**
     * 头部。
     */
    @bind(".x-panel-header") header: HTMLElement;

    @bind(".x-panel-body") body: HTMLElement;

    /**
     * 标题。
     */
    @bind(".x-panel-header h5", "innerHTML") title: NodeLike;

    /**
     * 是否可折叠。
     */
    get collapsable() {
        return dom.hasClass(this.elem, "x-panel-collapsable");
    }
    set collapsable(value) {
        if (value !== this.collapsable) {
            dom.toggleClass(this.elem, "x-panel-collapsable", value);
            if (value) {
                dom.on(this.header, "click", this.handleHeaderClick, this);
            } else {
                dom.off(this.header, "click", this.handleHeaderClick, this);
            }
        }
    }

    /**
     * 处理标题点击事件。
     */
    protected handleHeaderClick() {
        this.toggleCollapse();
    }

    /**
     * 是否已折叠。
     */
    @bind("", "class", "x-panel-collapsed") collapsed: boolean;

    /**
     * 切换面板的折叠状态。
     * @param value 如果为 true 则强制折叠；如果为 false 则强制展开。
     */
    toggleCollapse(value = !this.collapsed) {
        if (value !== this.collapsed) {
            if (this.onCollapseChange && this.onCollapseChange(value, this) === false) {
                return;
            }
            dom.addClass(this.elem, "x-panel-collapsing");
            this.collapsed = value;
            dom.toggle(this.body, !value, "height", () => {
                dom.removeClass(this.elem, "x-panel-collapsing");
                if (value) {
                    this.body.style.display = "";
                }
            }, this.duration);
        }
    }

    /**
     * 即将切换折叠事件。
     * @param value 如果为 true 表示即将折叠。否则表示即将展开。
     * @param sender 事件源。
     * @return 如果返回 false 则禁用折叠。
     */
    onCollapseChange: (value: boolean, sender: this) => boolean | void;

}
