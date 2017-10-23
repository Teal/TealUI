import * as dom from "web/dom";
import pin from "web/pin";
import Control, { VNode, bind } from "ui/control";
import "typo/icon/icon.scss";
import "./navMenu.scss";
import { scrollIntoViewIfNeeded } from "web/scroll/scroll";
import "ui/popup";

/**
 * 表示一个导航菜单。
 */
export default class NavMenu extends Control {

    protected render() {
        return <nav class="x-navmenu"></nav>;
    }

    protected init() {
        dom.on(this.elem, "click", "li", this.handleItemClick, this);
        dom.on(this.elem, "pointerenter", ">ul>li", this.handleItemPointerEnter, this);
        dom.on(this.elem, "pointerleave", ">ul>li", this.handleItemPointerLeave, this);
    }

    /**
     * 当前激活项。
     */
    get activeItem() {
        return dom.find(this.elem, ".x-navmenu-active");
    }
    set activeItem(value) {
        dom.query(this.elem, ".x-navmenu-active").forEach(elem => {
            dom.removeClass(elem, "x-navmenu-active");
        });
        if (value) {
            dom.addClass(value, "x-navmenu-active");
            if (!this.collapsed) {
                dom.show(dom.last(value)!);
            }

            for (let p = value; (p = p.parentNode as HTMLElement);) {
                if (dom.hasClass(p, "x-navmenu-collapsable")) {
                    dom.removeClass(p, "x-navmenu-collapsed");
                    dom.addClass(p, "x-navmenu-active");
                    if (!this.collapsed) {
                        dom.show(dom.last(p)!);
                    }
                }
            }
            scrollIntoViewIfNeeded(value, undefined, this.duration);
        }
    }

    /**
     * 点击项事件。
     */
    protected handleItemClick(e: MouseEvent, item: HTMLElement) {
        this.activeItem = item;
        if (dom.hasClass(item, "x-navmenu-collapsable")) {
            if ((!this.collapsed || item.parentNode!.parentNode !== this.elem)) {
                const collapse = !dom.hasClass(item, "x-navmenu-collapsed");
                dom.toggle(dom.last(item)!, !collapse, "height", undefined, this.duration);
                dom.toggleClass(item, "x-navmenu-collapsed", collapse);
            }
        }

        if (this.onItemClick) {
            this.onItemClick(item, e);
        }
        if (this.collapsed) {
            const popover = this.find(".x-navmenu-popover") as HTMLElement;
            if (popover) {
                this.handleItemPointerLeave(e, this.activeItem = popover.parentNode as HTMLElement);
            }
        }
    }

    /**
     * 是否显示折叠模式。
     */
    @bind("", "class", "x-navmenu-mini") collapsed: boolean;

    /**
     * 项点击事件。
     */
    onItemClick: (item: HTMLElement, e: MouseEvent) => void;

    onCollapseChange: () => void;

    toggleCollapse() {
        const show = this.collapsed;
        if (show) {
            const width = this.elem.offsetWidth;
            this.collapsed = false;
            const newWidth = this.elem.offsetWidth;
            dom.setStyle(this.elem, "width", width);
            dom.animate(this.elem, { width: newWidth }, () => {
                dom.setStyle(this.elem, "width", "");
            }, this.duration);
        } else {
            this.collapsed = true;
            const width = this.elem.offsetWidth;
            this.collapsed = false;
            dom.animate(this.elem, { width: width }, () => {
                dom.setStyle(this.elem, "width", "");
                this.collapsed = true;
            }, this.duration);
        }
        dom.query(this.elem, ".x-navmenu-collapsable:not(.x-navmenu-collapsed)>ul").forEach(item => {
            dom.toggle(item, show, "height", () => {
                item.style.display = "";
            }, this.duration);
        });
        this.onCollapseChange && this.onCollapseChange();
    }

    /**
     * 鼠标移入折叠项事件。
     */
    protected handleItemPointerEnter(e: MouseEvent, item: HTMLElement) {
        if (this.collapsed) {
            this.activeItem = item;
            if (dom.hasClass(item, "x-navmenu-collapsable")) {
                const ul = dom.last(item)! as HTMLElement;
                dom.addClass(ul, "x-navmenu-popover");
                dom.addClass(ul, "x-popup");
                dom.show(ul, "opacity", undefined, this.duration);
                pin(ul, dom.first(item)!, "rightTop", 1, document);
            }
        }
    }

    /**
     * 鼠标移出折叠项事件。
     */
    protected handleItemPointerLeave(e: MouseEvent, item: HTMLElement) {
        if (this.collapsed && dom.hasClass(item, "x-navmenu-collapsable")) {
            const ul = dom.last(item)!;
            dom.hide(ul, "opacity", () => {
                dom.removeClass(ul, "x-navmenu-popover");
                dom.removeClass(ul, "x-popup");
            }, this.duration);
        }
    }

}
