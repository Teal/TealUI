import * as dom from "ux/dom";
import pin from "ux/pin";
import Control, { VNode, bind } from "ui/control";
import "typo/icon/icon.scss";
import "./navMenu.scss";

/**
 * 表示一个导航菜单。
 */
export default class NavMenu extends Control {
    
    protected render() {
        return <nav class="x-navmenu"></nav>;
    }
    
    @bind("") body: HTMLElement;

    protected init() {
        dom.on(this.elem, "click", "li", this.handleItemClick, this);
        dom.on(this.elem, "pointerenter", ".x-navmenu-body>li", this.handleItemPointerEnter, this);
        dom.on(this.elem, "pointerleave", ".x-navmenu-body>li", this.handleItemPointerLeave, this);
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
            while ((value = value.parentNode as HTMLElement)) {
                if (dom.hasClass(value, "x-navmenu-collapsable")) {
                    dom.removeClass(value, "x-navmenu-collapsed");
                    dom.addClass(value, "x-navmenu-active");
                }
            }
        }
    }

    /**
     * 点击项事件。
     */
    protected handleItemClick(e: MouseEvent, item: HTMLElement) {
        this.activeItem = item;
        if (dom.hasClass(item, "x-navmenu-collapsable")) {
            if ((!this.collapsed || !dom.hasClass(item.parentNode as HTMLElement, "x-navmenu-body"))) {
                const collapse = !dom.hasClass(item, "x-navmenu-collapsed");
                dom.toggle(dom.last(item)!, !collapse, "height", undefined, this.duration);
                dom.toggleClass(item, "x-navmenu-collapsed", collapse);
            }
        } else if (this.onItemClick) {
            this.onItemClick(item, e);
            if (this.collapsed) {
                const popover = this.find(".x-navmenu-popover") as HTMLElement;
                if (popover) {
                    this.handleItemPointerLeave(e, this.activeItem = popover.parentNode as HTMLElement);
                }
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
                dom.addClass(ul, "x-popover");
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
            const ul = dom.last(item)! as HTMLElement;
            dom.hide(ul, "opacity", () => {
                dom.removeClass(ul, "x-navmenu-popover");
                dom.removeClass(ul, "x-popover");
            }, this.duration);
        }
    }

}
