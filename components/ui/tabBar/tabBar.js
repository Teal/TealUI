var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "web/dom", "web/scroll", "ui/control", "typo/icon/icon.scss", "typo/close/close.scss", "./tabBar.scss"], function (require, exports, dom, scroll_1, control_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个标签条。
     */
    var TabBar = /** @class */ (function (_super) {
        __extends(TabBar, _super);
        function TabBar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 标签浏览历史。
             */
            _this.tabHistory = [];
            return _this;
        }
        TabBar.prototype.render = function () {
            return control_1.VNode.create("nav", { class: "x-tabbar" },
                control_1.VNode.create("a", { href: "javascript:;", class: "x-icon x-tabbar-left" }, "\u2B9C"),
                control_1.VNode.create("a", { href: "javascript:;", class: "x-icon x-tabbar-right" }, "\u2B9E"),
                control_1.VNode.create("div", { class: "x-tabbar-body" },
                    control_1.VNode.create("ul", { role: "tablist" }),
                    control_1.VNode.create("div", { class: "x-tabbar-bar" })));
        };
        TabBar.prototype.init = function () {
            var _this = this;
            dom.on(this.elem, "pointerup", "li", this.handleItemPointerUp, this);
            dom.on(this.elem, "click", "li", this.handleItemClick, this);
            dom.on(this.body, "scroll", this.handleScroll, this);
            dom.on(this.elem, "mousewheel", this.handleMouseWheel, this);
            // FIXME: 改为长按一直触发。
            dom.on(this.scrollLeftButton, "click", this.handleScrollLeftPointerDown, this);
            dom.on(this.scrollRightButton, "click", this.handleScrollRightPointerDown, this);
            dom.on(window, "resize", function () { _this.realign(); _this.realignActiveBar(_this.selectedTab); });
        };
        /**
         * 处理指针在标签项松开事件。
         * @param e 事件。
         * @param tab 当前标签项。
         */
        TabBar.prototype.handleItemPointerUp = function (e, tab) {
            if (e.button === 1) {
                if (this.hideLastTabClose && dom.first(this.container) === dom.last(this.container)) {
                    return;
                }
                this.removeTab(tab);
            }
        };
        /**
         * 处理指针点击事件。
         * @param e 事件。
         * @param tab 当前标签项。
         */
        TabBar.prototype.handleItemClick = function (e, tab) {
            if (dom.hasClass(e.target, "x-close")) {
                this.removeTab(tab);
            }
            else {
                this.activeTab(tab);
            }
        };
        /**
         * 处理滚轮事件。
         * @param e 事件。
         */
        TabBar.prototype.handleMouseWheel = function (e) {
            e.preventDefault();
            scroll_1.scrollBy(this.body, { x: -e.wheelDelta }, this.duration);
        };
        /**
         * 处理左滚按住事件。
         */
        TabBar.prototype.handleScrollLeftPointerDown = function () {
            scroll_1.scrollBy(this.body, { x: -this.scrollDelta }, this.duration);
        };
        /**
         * 处理右滚按住事件。
         */
        TabBar.prototype.handleScrollRightPointerDown = function () {
            scroll_1.scrollBy(this.body, { x: this.scrollDelta }, this.duration);
        };
        /**
         * 处理滚动事件。
         */
        TabBar.prototype.handleScroll = function () {
            dom.toggleClass(this.scrollLeftButton, "x-tabbar-disabled", this.body.scrollLeft === 0);
            dom.toggleClass(this.scrollRightButton, "x-tabbar-disabled", this.body.scrollLeft + this.body.offsetWidth >= this.body.scrollWidth);
        };
        /**
         * 添加一个标签。
         * @param content 标签名。
         * @param active 标签是否默认激活。
         * @return 返回新建的标签项。
         */
        TabBar.prototype.addTab = function (content, active, duration) {
            if (active === void 0) { active = true; }
            var tab = dom.append(this.container, "<li role=\"tab\" style=\"width:0\"><button class=\"x-close x-icon\" title=\"\u5173\u95ED\" aria-label=\"\u5173\u95ED\">\u2716</button><a href=\"javascript:;\"></a></li>");
            var body = tab.lastChild;
            body.title = body.textContent = content;
            this.realign(duration);
            this.onAddTab && this.onAddTab(tab, this);
            if (active) {
                this.activeTab(tab, duration);
            }
            else {
                this.tabHistory.push(tab);
            }
            return tab;
        };
        /**
         * 删除一个标签。
         * @param tab 标签。
         * @param active 是否重新激活最后打开的标签。
         */
        TabBar.prototype.removeTab = function (tab, active, duration) {
            if (active === void 0) { active = true; }
            var selectedTab = this.selectedTab;
            var needReactive = active && selectedTab === tab;
            // 从历史纪录删除。
            var p;
            while ((p = this.tabHistory.indexOf(tab)) >= 0)
                this.tabHistory.splice(p, 1);
            this.realign(duration, tab);
            this.onRemoveTab && this.onRemoveTab(tab, this);
            if (needReactive) {
                this.activeTab(this.popTabHistory(), duration);
            }
            else {
                this.realignActiveBar(selectedTab, duration);
            }
        };
        /**
         * 激活一个标签。
         * @param tab 标签。
         */
        TabBar.prototype.activeTab = function (tab, duration) {
            var selectedTab = this.selectedTab;
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
        };
        /**
         * 弹出最后一次标签访问记录。
         */
        TabBar.prototype.popTabHistory = function () {
            return this.tabHistory.pop();
        };
        Object.defineProperty(TabBar.prototype, "selectedTab", {
            /**
             * 激活的标签页。
             */
            get: function () {
                return this.find(".x-tabbar-active");
            },
            set: function (value) {
                this.activeTab(value, 0);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据标签页的数目重新调整标签页大小。
         * @param remove 需要渐变隐藏的标签。
         */
        TabBar.prototype.realign = function (duration, remove) {
            var _this = this;
            if (duration === void 0) { duration = this.duration; }
            var tabCount = this.container.childNodes.length + (remove ? -1 : 0);
            var containerWidth = this.body.offsetWidth;
            if (containerWidth) {
                var maxTabWidth = containerWidth / tabCount;
                var totalWidth = 0;
                var leftCount_1 = tabCount;
                var _loop_1 = function (node) {
                    if (node === remove) {
                        dom.animate(node, { width: 0, minWidth: 0, opacity: 0 }, function () {
                            dom.remove(node);
                            node.style.minWidth = "";
                        }, duration);
                    }
                    else {
                        var tabWidth = node === remove ? 0 : Math.max(Math.min(maxTabWidth, dom.computeStyle(node, "maxWidth")), dom.computeStyle(node, "minWidth"));
                        dom.animate(node, { width: tabWidth }, function () {
                            if (--leftCount_1 <= 0) {
                                _this.activeTab(_this.selectedTab, duration);
                            }
                        }, duration);
                        totalWidth += tabWidth + dom.computeStyle(node, "marginLeft", "marginRight");
                    }
                };
                for (var node = this.container.firstChild; node; node = node.nextSibling) {
                    _loop_1(node);
                }
                dom.toggleClass(this.elem, "x-tabbar-overflow", totalWidth >= containerWidth);
            }
            // 隐藏最后一个标签的关闭按钮。
            if (this.hideLastTabClose) {
                this.query(".x-close").forEach(function (c) {
                    dom.toggle(c, tabCount > 1, "opacity");
                });
            }
        };
        TabBar.prototype.realignActiveBar = function (tab, duration) {
            var totalWidth = 0;
            for (var node = this.container.firstChild; node; node = node.nextSibling) {
                var tabWidth = parseFloat(node.style.width) || 0;
                if (node === tab) {
                    dom.animate(this.activeBar, { width: tabWidth, left: totalWidth });
                    scroll_1.scrollIntoViewIfNeeded(node, this.body, duration);
                    break;
                }
                if (tabWidth) {
                    totalWidth += tabWidth + dom.computeStyle(node, "marginLeft", "marginRight");
                }
            }
        };
        __decorate([
            control_1.bind(".x-tabbar-left")
        ], TabBar.prototype, "scrollLeftButton", void 0);
        __decorate([
            control_1.bind(".x-tabbar-right")
        ], TabBar.prototype, "scrollRightButton", void 0);
        __decorate([
            control_1.bind(".x-tabbar-body")
        ], TabBar.prototype, "body", void 0);
        __decorate([
            control_1.bind(".x-tabbar-body ul")
        ], TabBar.prototype, "container", void 0);
        __decorate([
            control_1.bind(".x-tabbar-bar")
        ], TabBar.prototype, "activeBar", void 0);
        return TabBar;
    }(control_1.default));
    exports.default = TabBar;
    TabBar.prototype.scrollDelta = 100;
});
//# sourceMappingURL=tabBar.js.map