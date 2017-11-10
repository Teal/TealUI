import * as dom from "web/dom";
import { scrollSize, scrollBy, scrollIntoViewIfNeeded } from "web/scroll";
import Control, { VNode, bind } from "ui/control";
import active from "web/active";
import "typo/icon/icon.scss";
import "typo/close/close.scss";
import "./navTab.scss";

/**
 * 表示一个导航标签。
 */
export default class NavTab extends Control {

    /**
     * 是否隐藏关闭按钮。
     */
    hideClose: boolean;

    /**
     * 是否隐藏最后一个标签页的关闭按钮。
     */
    hideLastClose: boolean;

    /**
     * 翻页按钮每次滚动距离。
     * @default 120
     */
    scrollDelta: number;

    /**
     * 是否在窗口大小改变后自动重新对齐。
     * @default true
     */
    autoResize: boolean;

    /**
     * 添加标签事件。
     * @param tab 标签。
     * @param sender 事件源。
     */
    onAddTab: (tab: HTMLElement, sender: this) => void;

    /**
     * 移除标签事件。
     * @param tab 标签。
     * @param sender 事件源。
     */
    onRemoveTab: (tab: HTMLElement, sender: this) => void;

    /**
     * 关闭标签事件。
     * @param tab 标签。
     * @param e 事件。
     * @param sender 事件源。
     * @return 如果函数返回 false 则终止事件。
     */
    onCloseTab: (tab: HTMLElement, e: MouseEvent | undefined, sender: this) => boolean | void;

    /**
     * 选择标签事件。
     * @param tab 标签。
     * @param e 事件。
     * @param sender 事件源。
     * @return 如果函数返回 false 则终止事件。
     */
    onSelect: (tab: HTMLElement | null | undefined, e: MouseEvent | undefined, sender: this) => boolean | void;

    /**
     * 选中标签改变事件。
     * @param oldTab 原标签。
     * @param newTab 新标签。
     * @param e 事件。
     * @param sender 事件源。
     */
    onChange: (oldTab: HTMLElement | null | undefined, newTab: HTMLElement, e: MouseEvent | undefined, sender: this) => void;

    protected render() {
        return <nav class="x-navtab">
            <a href="javascript:;" class="x-navtab-left x-icon">⮜</a>
            <a href="javascript:;" class="x-navtab-right x-icon">⮞</a>
            <div class="x-navtab-container">
                <ul class="x-navtab-body" role="tablist"></ul>
                <div class="x-navtab-bar"></div>
            </div>
        </nav>;
    }

    /**
     * 向左滚动按钮。
     */
    @bind(".x-navtab-left") leftButton: HTMLElement;

    /**
     * 向右滚动按钮。
     */
    @bind(".x-navtab-right") rightButton: HTMLElement;

    /**
     * 容器。
     */
    @bind(".x-navtab-container") container: HTMLElement;

    /**
     * 主体。
     */
    @bind(".x-navtab-body") body: HTMLElement;

    /**
     * 指示当前激活标签页的条。
     */
    @bind(".x-navtab-bar") bar: HTMLElement;

    /**
     * 获取所有标签页。
     */
    get tabs() { return dom.children(this.body); }

    protected init() {
        dom.on(this.elem, "mousewheel", this.handleMouseWheel, this);
        active(this.leftButton, e => { this.handleScrollLeftPointerDown(e); });
        active(this.rightButton, e => { this.handleScrollRightPointerDown(e); });
        dom.on(this.container, "scroll", this.handleScroll, this);
        dom.on(this.body, "pointerup", "li", this.handleItemPointerUp, this);
        dom.on(this.body, "click", "li", this.handleItemClick, this);
        this.autoResize && dom.on(window, "resize", () => { this.realign(); });
    }

    /**
     * 处理滚轮事件。
     * @param e 事件。
     */
    protected handleMouseWheel(e: WheelEvent) {
        e.preventDefault();
        scrollBy(this.container, { x: -e.wheelDelta * this.scrollDelta / 120 }, this.duration);
    }

    /**
     * 处理左滚按住事件。
     * @param e 事件。
     */
    protected handleScrollLeftPointerDown(e: MouseEvent) {
        scrollBy(this.container, { x: -this.scrollDelta }, this.duration);
    }

    /**
     * 处理右滚按住事件。
     * @param e 事件。
     */
    protected handleScrollRightPointerDown(e: MouseEvent) {
        scrollBy(this.container, { x: this.scrollDelta }, this.duration);
    }

    /**
     * 处理滚动事件。
     * @param e 事件。
     */
    protected handleScroll(e: MouseEvent) {
        dom.toggleClass(this.leftButton, "x-navtab-disabled", this.container.scrollLeft === 0);
        dom.toggleClass(this.rightButton, "x-navtab-disabled", this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth);
    }

    /**
     * 处理指针在标签项松开事件。
     * @param e 事件。
     * @param tab 当前标签项。
     */
    protected handleItemPointerUp(e: MouseEvent, tab: HTMLElement) {
        if (e.button === 1) {
            this.closeTab(tab, e);
        }
    }

    /**
     * 处理指针点击事件。
     * @param e 事件。
     * @param tab 当前标签项。
     */
    protected handleItemClick(e: MouseEvent, tab: HTMLElement) {
        if (dom.hasClass(e.target as HTMLElement, "x-close")) {
            this.closeTab(tab, e);
        } else {
            this.selectTab(tab, e);
        }
    }

    /**
     * 关闭标签页。
     * @param tab 标签。
     * @param e 事件。
     * @return 如果关闭成功则返回 true，否则返回 false。
     */
    closeTab(tab: HTMLElement, e?: MouseEvent) {
        if (this.hideClose) {
            return false;
        }
        if (this.hideLastClose && dom.first(this.body) === tab && tab === dom.last(this.body)) {
            return false;
        }
        if (this.onCloseTab && this.onCloseTab(tab, e, this) === false) {
            return false;
        }
        const reselect = this.selectedTab === tab;
        this.removeTab(tab);
        if (reselect) {
            const nextTab = this.tabHistoryBack.pop();
            if (nextTab) {
                this.selectTab(nextTab, e);
            }
        }
        return true;
    }

    /**
     * 选中的标签页。
     */
    get selectedTab() {
        return this.find(".x-navtab-selected") as HTMLElement | null;
    }
    set selectedTab(value) {
        this._setSelectedTab(this.selectedTab, value, this.duration);
    }

    /**
     * 标签后退历史。
     */
    tabHistoryBack: HTMLElement[] = [];

    /**
     * 选择一个标签。
     * @param tab 标签。
     * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
     * @return 如果选择成功则返回 true，否则返回 false。
     */
    selectTab(tab: HTMLElement, e?: MouseEvent, duration?: number) {
        if (this.onSelect && this.onSelect(tab, e, this) === false) {
            return false;
        }
        const selectedTab = this.selectedTab;
        if (selectedTab === tab) {
            return false;
        }
        this._setSelectedTab(selectedTab, tab, duration);
        this.onChange && this.onChange(selectedTab, tab, e, this);
        return true;
    }

    private _setSelectedTab(oldTab: HTMLElement | null | undefined, newTab: HTMLElement | null | undefined, duration?: number) {
        if (oldTab) {
            dom.removeClass(oldTab, "x-navtab-selected");
            oldTab.setAttribute("aria-selected", "false");
        }
        if (newTab) {
            dom.addClass(newTab, "x-navtab-selected");
            newTab.setAttribute("aria-selected", "true");
        }
        this.realignBar(newTab, duration);
        if (newTab && this.tabHistoryBack[this.tabHistoryBack.length - 1] !== newTab) {
            this.tabHistoryBack.push(newTab);
        }
    }

    /**
     * 添加一个标签。
     * @param title 标签名。
     * @param select 是否同时选择标签。
     * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
     * @return 返回新建的标签。
     */
    addTab(title: string, select = true, duration?: number) {
        const tab = dom.append(this.body, `<li role="tab" style="width:0"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;"></a></li>`) as HTMLElement;
        const tabBody = tab.lastChild as HTMLElement;
        tabBody.title = tabBody.textContent = title;
        if (this.hideClose) {
            dom.hide(tab.firstChild as HTMLElement);
        }
        this.tabHistoryBack.push(tab);
        this.realign(duration);
        this.onAddTab && this.onAddTab(tab, this);
        if (select) {
            this.selectTab(tab, undefined, duration);
        }
        return tab;
    }

    /**
     * 删除一个标签。
     * @param tab 标签。
     * @param active 是否重新激活最后打开的标签。
     * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
     */
    removeTab(tab: HTMLElement, duration?: number) {
        let p: number;
        while ((p = this.tabHistoryBack.indexOf(tab)) >= 0) this.tabHistoryBack.splice(p, 1);

        this.realign(duration, tab);
        this.onRemoveTab && this.onRemoveTab(tab, this);
    }

    /**
     * 根据标签页的数目重新调整标签页大小。
     * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
     * @param removing 正在渐变隐藏的标签。
     */
    realign(duration = this.duration, removing?: HTMLElement | null) {
        dom.removeClass(this.elem, "x-navtab-overflow");
        const tabCount = this.body.childNodes.length + (removing ? -1 : 0);
        dom.toggle(this.bar, tabCount > 0);
        if (this.hideLastClose && !this.hideClose) {
            this.query(".x-close").forEach((elem: HTMLElement) => {
                dom.toggle(elem, tabCount > 1, "opacity");
            });
        }
        const totalWidth = this.body.offsetWidth;
        const maxTabWidth = totalWidth / tabCount;
        let width = 0;
        let leftCount = tabCount;
        for (let node = this.body.firstChild as HTMLElement; node; node = node.nextSibling as HTMLElement) {
            if (node === removing) {
                dom.animate(node, { width: 0, minWidth: 0, opacity: 0 }, () => {
                    dom.remove(node);
                    node.style.minWidth = "";
                }, duration);
            } else {
                const margin = dom.computeStyle(node, "marginLeft", "marginRight");
                const tabWidth = node === removing ? 0 : Math.max(Math.min(maxTabWidth - margin, dom.computeStyle(node, "maxWidth") || Infinity), dom.computeStyle(node, "minWidth"));
                dom.animate(node, { width: tabWidth }, () => {
                    if (--leftCount <= 0) {
                        this.realignBar(this.selectedTab, duration);
                    }
                }, duration);
                width += tabWidth + margin;
            }
        }
        if (width > totalWidth) {
            dom.addClass(this.elem, "x-navtab-overflow");
        }
    }

    /**
     * 重新对齐指示条。
     * @param tab 选中的标签。
     * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
     */
    realignBar(tab: HTMLElement | null | undefined, duration?: number) {
        let width = 0;
        for (let node = this.body.firstChild as HTMLElement; node; node = node.nextSibling as HTMLElement) {
            const tabWidth = parseFloat(node.style.width!) || 0;
            if (node === tab) {
                dom.animate(this.bar, { width: tabWidth, left: width });
                scrollIntoViewIfNeeded(node, this.container, duration);
                break;
            }
            width += tabWidth + dom.computeStyle(node, "marginLeft", "marginRight");
        }
    }
}

NavTab.prototype.autoResize = true;
NavTab.prototype.scrollDelta = 100;
