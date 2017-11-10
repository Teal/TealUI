import * as dom from "web/dom";
import pin from "web/pin";
import Control, { VNode, bind, render } from "ui/control";
import "typo/icon";
import "./navMenu.scss";
import { scrollIntoViewIfNeeded } from "web/scroll";
import "ui/popup";

/**
 * 表示一个导航菜单。
 */
export default class NavMenu extends Control {

    /**
     * 选择项事件。
     * @param item 要选择的菜单项。
     * @param e 事件。
     * @param sender 事件源。
     */
    onSelect: (item: HTMLElement, e: MouseEvent | undefined, sender: this) => boolean | void;

    /**
     * 选中项改变事件。
     * @param e 事件。
     * @param sender 事件源。
     */
    onChange: (e: MouseEvent | undefined, sender: this) => void;

    /**
     * 切换折叠事件。
     * @param e 事件。
     * @param sender 事件源。
     */
    onCollapseChange: (e: MouseEvent | undefined, sender: this) => void;

    /**
     * 切换项折叠事件。
     * @param item 项。
     * @param e 事件。
     * @param sender 事件源。
     */
    onItemCollapseChange: (item: HTMLElement, e: MouseEvent | undefined, sender: this) => void;

    protected render() {
        return <ul class="x-navmenu"></ul>;
    }

    protected init() {
        dom.on(this.elem, "click", "li", this.handleItemClick, this);
    }

    /**
     * 点击项事件。
     * @param e 事件。
     * @param item 要选择的菜单项。
     */
    protected handleItemClick(e: MouseEvent, item: HTMLElement) {
        this.selectItem(item, e);
    }

    private _items: NavMenuItem[];

    /**
     * 菜单数据。
     */
    get items() {
        return this._items;
    }
    set items(value) {
        this._items = value;
        this.buildMenu(value).forEach(item => {
            render(this.body, item);
        });
    }

    /**
     * 从数据创建菜单项。
     * @param items 要创建的菜单项。
     * @return 返回每个菜单节点。
     */
    protected buildMenu(items: NavMenuItem[]): any[] {
        return items.map(item => <li class={`${item.children ? "x-navmenu-collapsable" : ""}${item.collapsed !== false ? " x-navmenu-collapsed" : ""}${item.selected ? " x-navmenu-selected" : ""}`}>
            <a href={item.href || "javascript:;"} target={item.target || (/\/\//.test(item.href!) ? "_blank" : "_self")} title={item.title || item.content}>
                {item.icon ? <i class="x-icon">{item.icon}</i> : null}
                <span>{item.content}</span>
            </a>
            {item.children ? <ul>{this.buildMenu(item.children)}</ul> : null}
        </li>);
    }

    /**
     * 当前选中项。
     * @desc 项是一个 `<li>` 节点。
     */
    get selectedItem() {
        return dom.find(this.elem, ".x-navmenu-selected");
    }
    set selectedItem(value) {
        dom.query(this.elem, ".x-navmenu-selected").forEach(elem => {
            dom.removeClass(elem, "x-navmenu-selected");
        });
        if (value) {
            dom.addClass(value, "x-navmenu-selected");
            for (let node = value; node; node = node.parentNode as HTMLElement) {
                if (dom.hasClass(node, "x-navmenu-collapsable")) {
                    dom.removeClass(node, "x-navmenu-collapsed");
                    dom.addClass(node, "x-navmenu-selected");
                    if (!this.collapsed) {
                        dom.show(dom.last(node)!);
                    }
                }
            }
            scrollIntoViewIfNeeded(value);
        }
    }

    /**
     * 选择项。
     * @param item 要选择的菜单项。
     * @param e 事件。
     * @return 如果选择成功则返回 true，否则返回 false。
     */
    selectItem(item: HTMLElement, e?: MouseEvent) {
        if (this.onSelect && this.onSelect(item, e, this) === false) {
            return false;
        }
        if (dom.hasClass(item, "x-navmenu-collapsable")) {
            this.toggleItemCollapse(item);
            return false;
        }
        if (dom.hasClass(item, "x-navmenu-selected")) {
            return false;
        }
        this.selectedItem = item;
        if (this.collapsed) {
            this.handleItemPointerLeave(e!, dom.closest(item, ".x-navmenu>li")!);
        }
        this.onChange && this.onChange(e, this);
        return true;
    }

    /**
     * 切换项的折叠状态。
     * @param item 项。
     * @param e 事件。
     */
    toggleItemCollapse(item: HTMLElement, e?: MouseEvent) {
        const collapse = !dom.hasClass(item, "x-navmenu-collapsed");
        dom.addClass(item, "x-navmenu-collapsing");
        dom.toggleClass(item, "x-navmenu-collapsed", collapse);
        dom.toggle(dom.last(item)!, !collapse, "height", () => {
            dom.removeClass(item, "x-navmenu-collapsing");
        }, this.duration);
        this.onItemCollapseChange && this.onItemCollapseChange(item, e, this);
    }

    /**
     * 是否折叠整个菜单。
     */
    get collapsed() {
        return dom.hasClass(this.elem, "x-navmenu-collapsed");
    }
    set collapsed(value) {
        dom.toggleClass(this.elem, "x-navmenu-collapsed", value);
        if (value) {
            dom.on(this.elem, "pointerenter", ">li", this.handleItemPointerEnter, this);
            dom.on(this.elem, "pointerleave", ">li", this.handleItemPointerLeave, this);
        } else {
            dom.off(this.elem, "pointerenter", ">li", this.handleItemPointerEnter, this);
            dom.off(this.elem, "pointerleave", ">li", this.handleItemPointerLeave, this);
            this.query("ul").forEach((elem: HTMLElement) => elem.style.cssText = "");
        }
    }

    /**
     * 鼠标移入折叠项事件。
     */
    protected handleItemPointerEnter(e: MouseEvent, item: HTMLElement) {
        if (dom.hasClass(item, "x-navmenu-collapsable")) {
            const ul = dom.last(item)! as HTMLElement;
            dom.addClass(ul, "x-popup");
            dom.show(ul);
            pin(ul, dom.first(item)!, "rightTop", 1, document);
            dom.show(ul, "zoomOut", undefined, this.duration, undefined, item);
        }
    }

    /**
     * 鼠标移出折叠项事件。
     */
    protected handleItemPointerLeave(e: MouseEvent, item: HTMLElement) {
        if (dom.hasClass(item, "x-navmenu-collapsable")) {
            const ul = dom.last(item)!;
            dom.hide(ul, "zoomOut", () => {
                dom.removeClass(ul, "x-popup");
            }, this.duration, undefined, item);
        }
    }

    private _knownWidth?: string | null;

    /**
     * 切换菜单折叠。
     * @param e 事件。
     */
    toggleCollapse(e?: MouseEvent) {
        const expand = this.collapsed;
        let newWidth: any;
        if (expand) {
            const width = this.elem.offsetWidth;
            this.collapsed = false;
            newWidth = this._knownWidth || this.elem.offsetWidth;
            dom.setStyle(this.elem, "width", width);
            this.query(".x-popup").forEach((elem: HTMLElement) => {
                dom.removeClass(elem, "x-popup");
            });
        } else {
            this._knownWidth = this.elem.style.width;
            this.collapsed = true;
            this.elem.style.width = "";
            newWidth = this.elem.offsetWidth;
            this.elem.style.width = this._knownWidth;
            this.collapsed = false;
        }
        dom.addClass(this.elem, "x-navmenu-collapsing");
        dom.animate(this.elem, { width: newWidth }, () => {
            dom.removeClass(this.elem, "x-navmenu-collapsing");
            dom.setStyle(this.elem, "width", expand && this._knownWidth || "");
            if (!expand) {
                this.collapsed = true;
            }
        }, this.duration);
        dom.query(this.elem, ".x-navmenu-collapsable:not(.x-navmenu-collapsed)>ul").forEach(item => {
            dom.toggle(item, expand, "height", () => {
                item.style.display = "";
            }, this.duration);
        });
        this.onCollapseChange && this.onCollapseChange(e, this);
    }

}

/**
 * 表示一个菜单项。
 */
export interface NavMenuItem {

    /**
     * 图标。
     */
    icon?: string;

    /**
     * 标题。
     */
    content?: string;

    /**
     * 链接地址。
     */
    href?: string;

    /**
     * 链接目标。
     */
    target?: string;

    /**
     * 标题。
     */
    title?: string;

    /**
     * 是否默认折叠。
     */
    collapsed?: boolean;

    /**
     * 是否默认选中。
     */
    selected?: boolean;

    /**
     * 子菜单。
     */
    children?: NavMenuItem[];

}
