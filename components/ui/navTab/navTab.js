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
define(["require", "exports", "web/dom", "web/scroll", "ui/control", "web/active", "typo/icon/icon.scss", "typo/close/close.scss", "./navTab.scss"], function (require, exports, dom, scroll_1, control_1, active_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个导航标签。
     */
    var NavTab = /** @class */ (function (_super) {
        __extends(NavTab, _super);
        function NavTab() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 标签后退历史。
             */
            _this.tabHistoryBack = [];
            return _this;
        }
        NavTab.prototype.render = function () {
            return control_1.VNode.create("nav", { class: "x-navtab" },
                control_1.VNode.create("a", { href: "javascript:;", class: "x-navtab-left x-icon" }, "\u2B9C"),
                control_1.VNode.create("a", { href: "javascript:;", class: "x-navtab-right x-icon" }, "\u2B9E"),
                control_1.VNode.create("div", { class: "x-navtab-container" },
                    control_1.VNode.create("ul", { class: "x-navtab-body", role: "tablist" }),
                    control_1.VNode.create("div", { class: "x-navtab-bar" })));
        };
        Object.defineProperty(NavTab.prototype, "tabs", {
            /**
             * 获取所有标签页。
             */
            get: function () { return dom.children(this.body); },
            enumerable: true,
            configurable: true
        });
        NavTab.prototype.init = function () {
            var _this = this;
            dom.on(this.elem, "mousewheel", this.handleMouseWheel, this);
            active_1.default(this.leftButton, function (e) { _this.handleScrollLeftPointerDown(e); });
            active_1.default(this.rightButton, function (e) { _this.handleScrollRightPointerDown(e); });
            dom.on(this.container, "scroll", this.handleScroll, this);
            dom.on(this.body, "pointerup", "li", this.handleItemPointerUp, this);
            dom.on(this.body, "click", "li", this.handleItemClick, this);
            this.autoResize && dom.on(window, "resize", function () { _this.realign(); });
        };
        /**
         * 处理滚轮事件。
         * @param e 事件。
         */
        NavTab.prototype.handleMouseWheel = function (e) {
            e.preventDefault();
            scroll_1.scrollBy(this.container, { x: -e.wheelDelta * this.scrollDelta / 120 }, this.duration);
        };
        /**
         * 处理左滚按住事件。
         * @param e 事件。
         */
        NavTab.prototype.handleScrollLeftPointerDown = function (e) {
            scroll_1.scrollBy(this.container, { x: -this.scrollDelta }, this.duration);
        };
        /**
         * 处理右滚按住事件。
         * @param e 事件。
         */
        NavTab.prototype.handleScrollRightPointerDown = function (e) {
            scroll_1.scrollBy(this.container, { x: this.scrollDelta }, this.duration);
        };
        /**
         * 处理滚动事件。
         * @param e 事件。
         */
        NavTab.prototype.handleScroll = function (e) {
            dom.toggleClass(this.leftButton, "x-navtab-disabled", this.container.scrollLeft === 0);
            dom.toggleClass(this.rightButton, "x-navtab-disabled", this.container.scrollLeft + this.container.offsetWidth >= this.container.scrollWidth);
        };
        /**
         * 处理指针在标签项松开事件。
         * @param e 事件。
         * @param tab 当前标签项。
         */
        NavTab.prototype.handleItemPointerUp = function (e, tab) {
            if (e.button === 1) {
                this.closeTab(tab, e);
            }
        };
        /**
         * 处理指针点击事件。
         * @param e 事件。
         * @param tab 当前标签项。
         */
        NavTab.prototype.handleItemClick = function (e, tab) {
            if (dom.hasClass(e.target, "x-close")) {
                this.closeTab(tab, e);
            }
            else {
                this.selectTab(tab, e);
            }
        };
        /**
         * 关闭标签页。
         * @param tab 标签。
         * @param e 事件。
         * @return 如果关闭成功则返回 true，否则返回 false。
         */
        NavTab.prototype.closeTab = function (tab, e) {
            if (this.hideClose) {
                return false;
            }
            if (this.hideLastClose && dom.first(this.body) === tab && tab === dom.last(this.body)) {
                return false;
            }
            if (this.onCloseTab && this.onCloseTab(tab, e, this) === false) {
                return false;
            }
            var reselect = this.selectedTab === tab;
            this.removeTab(tab);
            if (reselect) {
                var nextTab = this.tabHistoryBack.pop();
                if (nextTab) {
                    this.selectTab(nextTab, e);
                }
            }
            return true;
        };
        Object.defineProperty(NavTab.prototype, "selectedTab", {
            /**
             * 选中的标签页。
             */
            get: function () {
                return this.find(".x-navtab-selected");
            },
            set: function (value) {
                this._setSelectedTab(this.selectedTab, value, this.duration);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 选择一个标签。
         * @param tab 标签。
         * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
         * @return 如果选择成功则返回 true，否则返回 false。
         */
        NavTab.prototype.selectTab = function (tab, e, duration) {
            if (this.onSelect && this.onSelect(tab, e, this) === false) {
                return false;
            }
            var selectedTab = this.selectedTab;
            if (selectedTab === tab) {
                return false;
            }
            this._setSelectedTab(selectedTab, tab, duration);
            this.onChange && this.onChange(selectedTab, tab, e, this);
            return true;
        };
        NavTab.prototype._setSelectedTab = function (oldTab, newTab, duration) {
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
        };
        /**
         * 添加一个标签。
         * @param title 标签名。
         * @param select 是否同时选择标签。
         * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
         * @return 返回新建的标签。
         */
        NavTab.prototype.addTab = function (title, select, duration) {
            if (select === void 0) { select = true; }
            var tab = dom.append(this.body, "<li role=\"tab\" style=\"width:0\"><button class=\"x-close x-icon\" title=\"\u5173\u95ED\" aria-label=\"\u5173\u95ED\">\u2716</button><a href=\"javascript:;\"></a></li>");
            var tabBody = tab.lastChild;
            tabBody.title = tabBody.textContent = title;
            if (this.hideClose) {
                dom.hide(tab.firstChild);
            }
            this.tabHistoryBack.push(tab);
            this.realign(duration);
            this.onAddTab && this.onAddTab(tab, this);
            if (select) {
                this.selectTab(tab, undefined, duration);
            }
            return tab;
        };
        /**
         * 删除一个标签。
         * @param tab 标签。
         * @param active 是否重新激活最后打开的标签。
         * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
         */
        NavTab.prototype.removeTab = function (tab, duration) {
            var p;
            while ((p = this.tabHistoryBack.indexOf(tab)) >= 0)
                this.tabHistoryBack.splice(p, 1);
            this.realign(duration, tab);
            this.onRemoveTab && this.onRemoveTab(tab, this);
        };
        /**
         * 根据标签页的数目重新调整标签页大小。
         * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
         * @param removing 正在渐变隐藏的标签。
         */
        NavTab.prototype.realign = function (duration, removing) {
            var _this = this;
            if (duration === void 0) { duration = this.duration; }
            dom.removeClass(this.elem, "x-navtab-overflow");
            var tabCount = this.body.childNodes.length + (removing ? -1 : 0);
            dom.toggle(this.bar, tabCount > 0);
            if (this.hideLastClose && !this.hideClose) {
                this.query(".x-close").forEach(function (elem) {
                    dom.toggle(elem, tabCount > 1, "opacity");
                });
            }
            var totalWidth = this.body.offsetWidth;
            var maxTabWidth = totalWidth / tabCount;
            var width = 0;
            var leftCount = tabCount;
            var _loop_1 = function (node) {
                if (node === removing) {
                    dom.animate(node, { width: 0, minWidth: 0, opacity: 0 }, function () {
                        dom.remove(node);
                        node.style.minWidth = "";
                    }, duration);
                }
                else {
                    var margin = dom.computeStyle(node, "marginLeft", "marginRight");
                    var tabWidth = node === removing ? 0 : Math.max(Math.min(maxTabWidth - margin, dom.computeStyle(node, "maxWidth") || Infinity), dom.computeStyle(node, "minWidth"));
                    dom.animate(node, { width: tabWidth }, function () {
                        if (--leftCount <= 0) {
                            _this.realignBar(_this.selectedTab, duration);
                        }
                    }, duration);
                    width += tabWidth + margin;
                }
            };
            for (var node = this.body.firstChild; node; node = node.nextSibling) {
                _loop_1(node);
            }
            if (width > totalWidth) {
                dom.addClass(this.elem, "x-navtab-overflow");
            }
        };
        /**
         * 重新对齐指示条。
         * @param tab 选中的标签。
         * @param duration 对齐使用的动画毫秒数。如果为 0 则不使用动画。
         */
        NavTab.prototype.realignBar = function (tab, duration) {
            var width = 0;
            for (var node = this.body.firstChild; node; node = node.nextSibling) {
                var tabWidth = parseFloat(node.style.width) || 0;
                if (node === tab) {
                    dom.animate(this.bar, { width: tabWidth, left: width });
                    scroll_1.scrollIntoViewIfNeeded(node, this.container, duration);
                    break;
                }
                width += tabWidth + dom.computeStyle(node, "marginLeft", "marginRight");
            }
        };
        __decorate([
            control_1.bind(".x-navtab-left")
        ], NavTab.prototype, "leftButton", void 0);
        __decorate([
            control_1.bind(".x-navtab-right")
        ], NavTab.prototype, "rightButton", void 0);
        __decorate([
            control_1.bind(".x-navtab-container")
        ], NavTab.prototype, "container", void 0);
        __decorate([
            control_1.bind(".x-navtab-body")
        ], NavTab.prototype, "body", void 0);
        __decorate([
            control_1.bind(".x-navtab-bar")
        ], NavTab.prototype, "bar", void 0);
        return NavTab;
    }(control_1.default));
    exports.default = NavTab;
    NavTab.prototype.autoResize = true;
    NavTab.prototype.scrollDelta = 100;
});
//# sourceMappingURL=navTab.js.map