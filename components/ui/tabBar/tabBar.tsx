import * as dom from "web/dom";
import { scrollSize, scrollBy, scrollIntoViewIfNeeded } from "web/scroll";
import Control, { VNode, bind } from "ui/control";
import "typo/icon/icon.scss";
import "typo/close/close.scss";
import "./tabBar.scss";

/**
 * 表示一个标签条。
 */
export default class TabBar extends Control {

    /**
     * 是否隐藏最后一个标签页的关闭按钮。
     */
    hideLastTabClose: boolean;

    /**
     * 翻页按钮每次滚动距离。
     * @default 120
     */
    scrollDelta: number;

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
     * 激活标签事件。
     * @param tab 标签。
     * @param sender 事件源。
     */
    onActiveTab: (tab: HTMLElement, sender: this) => void;

    protected render() {
        return <nav class="x-tabbar">
            <a href="javascript:;" class="x-icon x-tabbar-left">⮜</a>
            <a href="javascript:;" class="x-icon x-tabbar-right">⮞</a>
            <div class="x-tabbar-body">
                <ul role="tablist"></ul>
                <div class="x-tabbar-bar"></div>
            </div>
        </nav>;
    }

    /**
     * 向左滚动按钮。
     */
    @bind(".x-tabbar-left") scrollLeftButton: HTMLElement;

    /**
     * 向右滚动按钮。
     */
    @bind(".x-tabbar-right") scrollRightButton: HTMLElement;

    /**
     * 主体。
     */
    @bind(".x-tabbar-body") body: HTMLElement;

    /**
     * 标签页容器。
     */
    @bind(".x-tabbar-body ul") container: HTMLElement;

    /**
     * 指示当前激活标签页的条。
     */
    @bind(".x-tabbar-bar") activeBar: HTMLElement;

    protected init() {
        dom.on(this.elem, "pointerup", "li", this.handleItemPointerUp, this);
        dom.on(this.elem, "click", "li", this.handleItemClick, this);
        dom.on(this.body, "scroll", this.handleScroll, this);
        dom.on(this.elem, "mousewheel", this.handleMouseWheel, this);
        // FIXME: 改为长按一直触发。
        dom.on(this.scrollLeftButton, "click", this.handleScrollLeftPointerDown, this);
        dom.on(this.scrollRightButton, "click", this.handleScrollRightPointerDown, this);
        dom.on(window, "resize", () => { this.realign(); this.realignActiveBar(this.selectedTab); });
    }

    /**
     * 处理指针在标签项松开事件。
     * @param e 事件。
     * @param tab 当前标签项。
     */
    protected handleItemPointerUp(e: MouseEvent, tab: HTMLElement) {
        if (e.button === 1) {
            if (this.hideLastTabClose && dom.first(this.container) === dom.last(this.container)) {
                return;
            }
            this.removeTab(tab);
        }
    }

    /**
     * 处理指针点击事件。
     * @param e 事件。
     * @param tab 当前标签项。
     */
    protected handleItemClick(e: MouseEvent, tab: HTMLElement) {
        if (dom.hasClass(e.target as HTMLElement, "x-close")) {
            this.removeTab(tab);
        } else {
            this.activeTab(tab);
        }
    }

    /**
     * 处理滚轮事件。
     * @param e 事件。
     */
    protected handleMouseWheel(e: WheelEvent) {
        e.preventDefault();
        scrollBy(this.body, { x: -e.wheelDelta }, this.duration);
    }

    /**
     * 处理左滚按住事件。
     */
    protected handleScrollLeftPointerDown() {
        scrollBy(this.body, { x: -this.scrollDelta }, this.duration);
    }

    /**
     * 处理右滚按住事件。
     */
    protected handleScrollRightPointerDown() {
        scrollBy(this.body, { x: this.scrollDelta }, this.duration);
    }

    /**
     * 处理滚动事件。
     */
    protected handleScroll() {
        dom.toggleClass(this.scrollLeftButton, "x-tabbar-disabled", this.body.scrollLeft === 0);
        dom.toggleClass(this.scrollRightButton, "x-tabbar-disabled", this.body.scrollLeft + this.body.offsetWidth >= this.body.scrollWidth);
    }

    /**
     * 添加一个标签。
     * @param content 标签名。
     * @param active 标签是否默认激活。
     * @return 返回新建的标签项。
     */
    addTab(content: string, active = true, duration?: number) {
        const tab = dom.append(this.container, `<li role="tab" style="width:0"><button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button><a href="javascript:;"></a></li>`) as HTMLElement;
        const body = tab.lastChild as HTMLElement;
        body.title = body.textContent = content;
        this.realign(duration);
        this.onAddTab && this.onAddTab(tab, this);
        if (active) {
            this.activeTab(tab, duration);
        } else {
            this.tabHistory.push(tab);
        }
        return tab;
    }

    /**
     * 删除一个标签。
     * @param tab 标签。
     * @param active 是否重新激活最后打开的标签。
     */
    removeTab(tab: HTMLElement, active = true, duration?: number) {
        const selectedTab = this.selectedTab;
        const needReactive = active && selectedTab === tab;
        // 从历史纪录删除。
        let p: number;
        while ((p = this.tabHistory.indexOf(tab)) >= 0) this.tabHistory.splice(p, 1);
        this.realign(duration, tab);
        this.onRemoveTab && this.onRemoveTab(tab, this);
        if (needReactive) {
            this.activeTab(this.popTabHistory(), duration);
        } else {
            this.realignActiveBar(selectedTab, duration);
        }
    }

    /**
     * 激活一个标签。
     * @param tab 标签。
     */
    activeTab(tab: HTMLElement | null | undefined, duration?: number) {
        const selectedTab = this.selectedTab;
        if (selectedTab === tab) {
            return;
        }
        if (selectedTab) {
            dom.removeClass(selectedTab, "x-tabbar-active");
            selectedTab.setAttribute("aria-selected", "false");
        }
        if (tab) {
            dom.addClass(tab, "x-tabbar-active");
            tab.setAttribute("aria-selected", "true");
            this.tabHistory.push(tab);
            this.onActiveTab && this.onActiveTab(tab, this);
        }
        this.realignActiveBar(tab, duration);
    }

    /**
     * 标签浏览历史。
     */
    tabHistory: HTMLElement[] = [];

    /**
     * 弹出最后一次标签访问记录。
     */
    popTabHistory() {
        return this.tabHistory.pop();
    }

    /**
     * 激活的标签页。
     */
    get selectedTab() {
        return this.find(".x-tabbar-active") as HTMLElement | null;
    }
    set selectedTab(value) {
        this.activeTab(value, 0);
    }

    /**
     * 根据标签页的数目重新调整标签页大小。
     * @param remove 需要渐变隐藏的标签。
     */
    realign(duration = this.duration, remove?: HTMLElement) {
        const tabCount = this.container.childNodes.length + (remove ? -1 : 0);
        const containerWidth = this.body.offsetWidth;
        if (containerWidth) {
            const maxTabWidth = containerWidth / tabCount;
            let totalWidth = 0;
            let leftCount = tabCount;
            for (let node = this.container.firstChild as HTMLElement; node; node = node.nextSibling as HTMLElement) {
                if (node === remove) {
                    dom.animate(node, { width: 0, minWidth: 0, opacity: 0 }, () => {
                        dom.remove(node);
                        node.style.minWidth = "";
                    }, duration);
                } else {
                    const tabWidth = node === remove ? 0 : Math.max(Math.min(maxTabWidth, dom.computeStyle(node, "maxWidth")), dom.computeStyle(node, "minWidth"));
                    dom.animate(node, { width: tabWidth }, () => {
                        if (--leftCount <= 0) {
                            this.activeTab(this.selectedTab, duration);
                        }
                    }, duration);
                    totalWidth += tabWidth + dom.computeStyle(node, "marginLeft", "marginRight");
                }
            }
            dom.toggleClass(this.elem, "x-tabbar-overflow", totalWidth >= containerWidth);
        }

        // 隐藏最后一个标签的关闭按钮。
        if (this.hideLastTabClose) {
            this.query(".x-close").forEach((c: HTMLElement) => {
                dom.toggle(c, tabCount > 1, "opacity");
            });
        }
    }

    protected realignActiveBar(tab: HTMLElement | null | undefined, duration?: number) {
        let totalWidth = 0;
        for (let node = this.container.firstChild as HTMLElement; node; node = node.nextSibling as HTMLElement) {
            const tabWidth = parseFloat(node.style.width!) || 0;
            if (node === tab) {
                dom.animate(this.activeBar, { width: tabWidth, left: totalWidth });
                scrollIntoViewIfNeeded(node, this.body, duration);
                break;
            }
            if (tabWidth) {
                totalWidth += tabWidth + dom.computeStyle(node, "marginLeft", "marginRight");
            }
        }
    }

}

TabBar.prototype.scrollDelta = 100;
