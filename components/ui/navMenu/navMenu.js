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
define(["require", "exports", "web/dom", "web/pin", "ui/control", "web/scroll", "typo/icon", "./navMenu.scss", "ui/popup"], function (require, exports, dom, pin_1, control_1, scroll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个导航菜单。
     */
    var NavMenu = /** @class */ (function (_super) {
        __extends(NavMenu, _super);
        function NavMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NavMenu.prototype.render = function () {
            return control_1.VNode.create("ul", { class: "x-navmenu" });
        };
        NavMenu.prototype.init = function () {
            dom.on(this.elem, "click", "li", this.handleItemClick, this);
        };
        /**
         * 点击项事件。
         * @param e 事件。
         * @param item 要选择的菜单项。
         */
        NavMenu.prototype.handleItemClick = function (e, item) {
            this.selectItem(item, e);
        };
        Object.defineProperty(NavMenu.prototype, "items", {
            /**
             * 菜单数据。
             */
            get: function () {
                return this._items;
            },
            set: function (value) {
                var _this = this;
                this._items = value;
                this.buildMenu(value).forEach(function (item) {
                    control_1.render(_this.body, item);
                });
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 从数据创建菜单项。
         * @param items 要创建的菜单项。
         * @return 返回每个菜单节点。
         */
        NavMenu.prototype.buildMenu = function (items) {
            var _this = this;
            return items.map(function (item) { return control_1.VNode.create("li", { class: "" + (item.children ? "x-navmenu-collapsable" : "") + (item.collapsed !== false ? " x-navmenu-collapsed" : "") + (item.selected ? " x-navmenu-selected" : "") },
                control_1.VNode.create("a", { href: item.href || "javascript:;", target: item.target || (/\/\//.test(item.href) ? "_blank" : "_self"), title: item.title || item.content },
                    item.icon ? control_1.VNode.create("i", { class: "x-icon" }, item.icon) : null,
                    control_1.VNode.create("span", null, item.content)),
                item.children ? control_1.VNode.create("ul", null, _this.buildMenu(item.children)) : null); });
        };
        Object.defineProperty(NavMenu.prototype, "selectedItem", {
            /**
             * 当前选中项。
             * @desc 项是一个 `<li>` 节点。
             */
            get: function () {
                return dom.find(this.elem, ".x-navmenu-selected");
            },
            set: function (value) {
                dom.query(this.elem, ".x-navmenu-selected").forEach(function (elem) {
                    dom.removeClass(elem, "x-navmenu-selected");
                });
                if (value) {
                    dom.addClass(value, "x-navmenu-selected");
                    for (var node = value; node; node = node.parentNode) {
                        if (dom.hasClass(node, "x-navmenu-collapsable")) {
                            dom.removeClass(node, "x-navmenu-collapsed");
                            dom.addClass(node, "x-navmenu-selected");
                            if (!this.collapsed) {
                                dom.show(dom.last(node));
                            }
                        }
                    }
                    scroll_1.scrollIntoViewIfNeeded(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 选择项。
         * @param item 要选择的菜单项。
         * @param e 事件。
         * @return 如果选择成功则返回 true，否则返回 false。
         */
        NavMenu.prototype.selectItem = function (item, e) {
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
                this.handleItemPointerLeave(e, dom.closest(item, ".x-navmenu>li"));
            }
            this.onChange && this.onChange(e, this);
            return true;
        };
        /**
         * 切换项的折叠状态。
         * @param item 项。
         * @param e 事件。
         */
        NavMenu.prototype.toggleItemCollapse = function (item, e) {
            var collapse = !dom.hasClass(item, "x-navmenu-collapsed");
            dom.addClass(item, "x-navmenu-collapsing");
            dom.toggleClass(item, "x-navmenu-collapsed", collapse);
            dom.toggle(dom.last(item), !collapse, "height", function () {
                dom.removeClass(item, "x-navmenu-collapsing");
            }, this.duration);
            this.onItemCollapseChange && this.onItemCollapseChange(item, e, this);
        };
        Object.defineProperty(NavMenu.prototype, "collapsed", {
            /**
             * 是否折叠整个菜单。
             */
            get: function () {
                return dom.hasClass(this.elem, "x-navmenu-collapsed");
            },
            set: function (value) {
                dom.toggleClass(this.elem, "x-navmenu-collapsed", value);
                if (value) {
                    dom.on(this.elem, "pointerenter", ">li", this.handleItemPointerEnter, this);
                    dom.on(this.elem, "pointerleave", ">li", this.handleItemPointerLeave, this);
                }
                else {
                    dom.off(this.elem, "pointerenter", ">li", this.handleItemPointerEnter, this);
                    dom.off(this.elem, "pointerleave", ">li", this.handleItemPointerLeave, this);
                    this.query("ul").forEach(function (elem) { return elem.style.cssText = ""; });
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 鼠标移入折叠项事件。
         */
        NavMenu.prototype.handleItemPointerEnter = function (e, item) {
            if (dom.hasClass(item, "x-navmenu-collapsable")) {
                var ul = dom.last(item);
                dom.addClass(ul, "x-popup");
                dom.show(ul);
                pin_1.default(ul, dom.first(item), "rightTop", 1, document);
                dom.show(ul, "zoomOut", undefined, this.duration, undefined, item);
            }
        };
        /**
         * 鼠标移出折叠项事件。
         */
        NavMenu.prototype.handleItemPointerLeave = function (e, item) {
            if (dom.hasClass(item, "x-navmenu-collapsable")) {
                var ul_1 = dom.last(item);
                dom.hide(ul_1, "zoomOut", function () {
                    dom.removeClass(ul_1, "x-popup");
                }, this.duration, undefined, item);
            }
        };
        /**
         * 切换菜单折叠。
         * @param e 事件。
         */
        NavMenu.prototype.toggleCollapse = function (e) {
            var _this = this;
            var expand = this.collapsed;
            var newWidth;
            if (expand) {
                var width = this.elem.offsetWidth;
                this.collapsed = false;
                newWidth = this._knownWidth || this.elem.offsetWidth;
                dom.setStyle(this.elem, "width", width);
                this.query(".x-popup").forEach(function (elem) {
                    dom.removeClass(elem, "x-popup");
                });
            }
            else {
                this._knownWidth = this.elem.style.width;
                this.collapsed = true;
                this.elem.style.width = "";
                newWidth = this.elem.offsetWidth;
                this.elem.style.width = this._knownWidth;
                this.collapsed = false;
            }
            dom.addClass(this.elem, "x-navmenu-collapsing");
            dom.animate(this.elem, { width: newWidth }, function () {
                dom.removeClass(_this.elem, "x-navmenu-collapsing");
                dom.setStyle(_this.elem, "width", expand && _this._knownWidth || "");
                if (!expand) {
                    _this.collapsed = true;
                }
            }, this.duration);
            dom.query(this.elem, ".x-navmenu-collapsable:not(.x-navmenu-collapsed)>ul").forEach(function (item) {
                dom.toggle(item, expand, "height", function () {
                    item.style.display = "";
                }, _this.duration);
            });
            this.onCollapseChange && this.onCollapseChange(e, this);
        };
        return NavMenu;
    }(control_1.default));
    exports.default = NavMenu;
});
//# sourceMappingURL=navMenu.js.map