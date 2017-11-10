import * as dom from "web/dom";
import Control, { VNode, bind } from "ui/control";
import NavMenu from "ui/navMenu";
import NavTab from "ui/navTab";
import movable from "web/movable";
import "./adminApp.scss";
import { limit } from "util/function";

/**
 * 表示一个管理端界面布局。
 */
export default class AdminApp extends Control {

    @bind logo: string;
    @bind title: string;
    @bind userName: string;
    @bind logount = "退出";
    @bind homePage = "javascript:;";
    @bind logountUrl = "javascript://退出登陆";

    protected render() {
        return <div class="x-adminapp" style="height:300px;">
            <header class="x-adminapp-header">
                <a href="javascript:;" class="x-adminapp-button x-adminapp-collapse" onClick={this.handleCollapseClick}></a>
                <a href={this.homePage} class="x-adminapp-text"><img src={this.logo} /><span>{this.title}</span></a>
                <div class="x-adminapp-right">
                    <div class="x-adminapp-text">
                        <a href="javascript:;" class="x-adminapp-username">{this.userName}</a>
                    </div>
                    <a class="x-adminapp-button x-adminapp-logout" href={this.logountUrl}>{this.logount}</a>
                </div>
            </header>
            <div class="x-adminapp-container">
                <NavMenu class="x-adminapp-sidebar"></NavMenu>
                <div class="x-adminapp-splitter"></div>
                <div class="x-adminapp-main">
                    <NavTab class="x-adminapp-tabs"></NavTab>
                    <div class="x-adminapp-body">

                    </div>
                </div>
            </div>
        </div>;
    }

    @bind(".x-adminapp-sidebar") navMenu: NavMenu;
    @bind(".x-adminapp-tabs") navTab: NavTab;
    @bind(".x-adminapp-main") main: HTMLElement;
    @bind(".x-adminapp-body") body: HTMLElement;
    @bind(".x-adminapp-splitter") splitter: HTMLElement;

    protected init() {
        const self = this;
        dom.setStyle(self.splitter, "left", dom.getStyle(this.navMenu.elem, "width"));

        let startWidth: number;
        let startLeft: number;
        movable(this.splitter, {
            moveStart() {
                startWidth = dom.getRect(self.navMenu.elem).width;
                startLeft = dom.computeStyle(self.main, "left");
            },
            move(e) {
                let newSidebarWidth = startWidth + this.offsetX!;
                let newLeft = startLeft + this.offsetX!;

                let delta = 16 * 6 - newSidebarWidth;
                if (delta > 0) {
                    newSidebarWidth += delta;
                    newLeft += delta;
                }

                delta = newSidebarWidth - self.elem.offsetWidth + 16 * 6;
                if (delta > 0) {
                    newSidebarWidth -= delta;
                    newLeft -= delta;
                }

                dom.setStyle(self.splitter, "left", newSidebarWidth);
                dom.setRect(self.navMenu.elem, { width: newSidebarWidth });
                dom.setStyle(self.main, "transition", "none");
                dom.setStyle(self.main, "left", newLeft);
                setTimeout(() => { dom.setStyle(self.main, "transition", ""); }, 0);
            }
        });
    }

    protected handleCollapseClick = limit(() => {
        this.toggleMenuCollapse();
    }, 400);

    /**
     * 切换菜单的折叠效果。
     */
    toggleMenuCollapse() {
        const collapsed = !this.navMenu.collapsed;
        this.navMenu.toggleCollapse();
        dom.toggleClass(this.elem, "x-adminapp-collapsed", collapsed);
        dom.toggle(this.splitter, !collapsed);
    }

}
