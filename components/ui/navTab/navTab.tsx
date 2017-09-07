import * as dom from "ux/dom";
import { scrollSize, scrollBy, scrollIntoViewIfNeeded } from "ux/scroll";
import Control, { VNode, bind } from "ui/control";
import "typo/icon/icon.scss";
import "typo/close/close.scss";
import "./navTab.scss";

/**
 * 表示一个导航标签页。
 */
export default class NavTab extends Control {

    protected render() {
        return <nav class="x-navtab">
            <a href="javascript:;" class="x-icon x-navtab-left" style="display: none;" onClick={this.handleScrollClick}>⮜</a>
            <a href="javascript:;" class="x-icon x-navtab-right" style="display: none;" onClick={this.handleScrollClick}>⮞</a>
            <div class="x-navtab-body" onScroll={this.handleScroll} onMouseWheel={this.handleMouseWheel}>
                <div class="x-navtab-bar" style="left: 0;"></div>
                <ul role="tablist"></ul>
            </div>
        </nav>;
    }

    protected init() {
        dom.on(this.container, "click", "li", this.handleItemClick, this);
        dom.on(this.container, "pointerup", "li", this.handleItemPointerUp, this);
    }

    @bind(".x-navtab-left") scrollLeftHandle: HTMLElement;
    @bind(".x-navtab-right") scrollRightHandle: HTMLElement;

    @bind(".x-navtab-body") body: HTMLElement;

    /**
     * 标签页容器。
     */
    @bind(".x-navtab-body ul") container: HTMLElement;

    @bind(".x-navtab-bar") activeBar: HTMLElement;

    /**
     * 添加一个标签页。
     */
    addTab(tab: string, active = true) {
        const item = dom.parse(`<li role="tab"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;"></a></li>`) as HTMLElement;
        const body = item.lastChild as HTMLElement;
        body.title = body.textContent = tab || "　";
        this.container.appendChild(item);
        this.realign(active ? item : undefined);
        return item;
    }

    /**
     * 删除一个标签页。
     */
    removeTab(tabItem: HTMLElement) {
        const newTab = this.activeTab === tabItem && (dom.next(tabItem) || dom.prev(tabItem));
        dom.find(tabItem, ".x-close")!.style.opacity = "0";
        dom.animate(tabItem, { width: 0 }, () => {
            dom.remove(tabItem);
            this.realign(newTab ? newTab : undefined);
            this.onCloseTab && this.onCloseTab(tabItem);
        }, this.duration);
    }

    tabMaxWidth: number;

    tabMinWidth: number;

    /**
     * 根据标签页的实际大小调整分配。
     */
    realign(activeTab = this.activeTab) {
        const containerWidth = this.body.offsetWidth;
        if (containerWidth) {
            const tabCount = this.container.childNodes.length;
            const width = Math.max(Math.min(containerWidth / tabCount, this.tabMaxWidth), this.tabMinWidth);
            for (let node = this.container.firstChild as HTMLElement; node; node = node.nextSibling as HTMLElement) {
                node.style.width = width + "px";
            }
            this.activeBar.style.width = width + "px";
            const overflow = width * tabCount > containerWidth;
            dom.toggle(this.scrollLeftHandle, overflow);
            dom.toggle(this.scrollRightHandle, overflow);
            this.activeTab = activeTab;

            // 隐藏最后一个标签的 x 
            //第一个标签是激活标签的时候不应该隐藏关闭按钮
            const hideClose = dom.first(this.container) == dom.last(this.container) && activeTab != dom.first(this.container);
            this.query(".x-close").forEach((c: HTMLElement) => {
                dom.toggle(c, !hideClose);
            });
        }
    }

    /**
     * 激活的标签页。
     */
    get activeTab() {
        return this.find(".x-navtab-active") as HTMLElement | null;
    }
    set activeTab(value) {
        const active = this.activeTab;
        if (active) {
            dom.removeClass(active, "x-navtab-active");
            active.setAttribute("aria-selected", "false");
        }
        if (value) {
            dom.addClass(value, "x-navtab-active");
            value.setAttribute("aria-selected", "false");
            scrollIntoViewIfNeeded(value, this.body, this.duration);
            this.activeBar.style.left = (parseFloat(value.style.width!) + 7) * dom.index(value) + "px";
            this.onActiveTab && this.onActiveTab(value);
        }
    }

    protected handleItemClick = (e: MouseEvent, item: HTMLElement) => {
        if (dom.hasClass(e.target as HTMLElement, "x-close")) {
            this.removeTab(item);
        } else {
            this.activeTab = item;
        }
    }

    scrollSize: number;

    protected handleScrollClick = (e: MouseEvent) => {
        const left = dom.hasClass(e.target as HTMLElement, "x-navtab-left");
        scrollBy(this.body, { x: this.scrollSize * (left ? -1 : 1) }, this.duration);
    }

    protected handleMouseWheel = (e: WheelEvent) => {
        scrollBy(this.body, { x: -e.wheelDelta }, this.duration);
    }

    protected handleScroll = (e: MouseEvent) => {
        dom.toggleClass(this.scrollLeftHandle, "x-navtab-disabled", this.body.scrollLeft === 0);
        dom.toggleClass(this.scrollRightHandle, "x-navtab-disabled", this.body.scrollLeft + this.body.offsetWidth >= this.body.scrollWidth);
    }

    protected handleItemPointerUp = (e: MouseEvent, item: HTMLElement) => {
        if (e.which === 2) {
            this.removeTab(item);
        }
    }

    /**
     * 关闭标签事件。
     */
    onCloseTab: (item: HTMLElement) => void;

    /**
     * 激活标签事件。
     */
    onActiveTab: (item: HTMLElement) => void;

}

NavTab.prototype.tabMaxWidth = 140;
NavTab.prototype.tabMinWidth = 80;
NavTab.prototype.scrollSize = 100;
