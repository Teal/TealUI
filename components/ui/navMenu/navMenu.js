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
define(["require", "exports", "web/dom", "web/pin", "ui/control", "web/scroll/scroll", "typo/icon/icon.scss", "./navMenu.scss", "ui/popup"], function (require, exports, dom, pin_1, control_1, scroll_1) {
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
            return control_1.VNode.create("nav", { class: "x-navmenu" });
        };
        NavMenu.prototype.init = function () {
            dom.on(this.elem, "click", "li", this.handleItemClick, this);
            dom.on(this.elem, "pointerenter", ">ul>li", this.handleItemPointerEnter, this);
            dom.on(this.elem, "pointerleave", ">ul>li", this.handleItemPointerLeave, this);
        };
        Object.defineProperty(NavMenu.prototype, "activeItem", {
            /**
             * 当前激活项。
             */
            get: function () {
                return dom.find(this.elem, ".x-navmenu-active");
            },
            set: function (value) {
                dom.query(this.elem, ".x-navmenu-active").forEach(function (elem) {
                    dom.removeClass(elem, "x-navmenu-active");
                });
                if (value) {
                    dom.addClass(value, "x-navmenu-active");
                    if (!this.collapsed) {
                        dom.show(dom.last(value));
                    }
                    for (var p = value; (p = p.parentNode);) {
                        if (dom.hasClass(p, "x-navmenu-collapsable")) {
                            dom.removeClass(p, "x-navmenu-collapsed");
                            dom.addClass(p, "x-navmenu-active");
                            if (!this.collapsed) {
                                dom.show(dom.last(p));
                            }
                        }
                    }
                    scroll_1.scrollIntoViewIfNeeded(value, undefined, this.duration);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 点击项事件。
         */
        NavMenu.prototype.handleItemClick = function (e, item) {
            this.activeItem = item;
            if (dom.hasClass(item, "x-navmenu-collapsable")) {
                if ((!this.collapsed || item.parentNode.parentNode !== this.elem)) {
                    var collapse = !dom.hasClass(item, "x-navmenu-collapsed");
                    dom.toggle(dom.last(item), !collapse, "height", undefined, this.duration);
                    dom.toggleClass(item, "x-navmenu-collapsed", collapse);
                }
            }
            if (this.onItemClick) {
                this.onItemClick(item, e);
            }
            if (this.collapsed) {
                var popover = this.find(".x-navmenu-popover");
                if (popover) {
                    this.handleItemPointerLeave(e, this.activeItem = popover.parentNode);
                }
            }
        };
        NavMenu.prototype.toggleCollapse = function () {
            var _this = this;
            var show = this.collapsed;
            if (show) {
                var width = this.elem.offsetWidth;
                this.collapsed = false;
                var newWidth = this.elem.offsetWidth;
                dom.setStyle(this.elem, "width", width);
                dom.animate(this.elem, { width: newWidth }, function () {
                    dom.setStyle(_this.elem, "width", "");
                }, this.duration);
            }
            else {
                this.collapsed = true;
                var width = this.elem.offsetWidth;
                this.collapsed = false;
                dom.animate(this.elem, { width: width }, function () {
                    dom.setStyle(_this.elem, "width", "");
                    _this.collapsed = true;
                }, this.duration);
            }
            dom.query(this.elem, ".x-navmenu-collapsable:not(.x-navmenu-collapsed)>ul").forEach(function (item) {
                dom.toggle(item, show, "height", function () {
                    item.style.display = "";
                }, _this.duration);
            });
            this.onCollapseChange && this.onCollapseChange();
        };
        /**
         * 鼠标移入折叠项事件。
         */
        NavMenu.prototype.handleItemPointerEnter = function (e, item) {
            if (this.collapsed) {
                this.activeItem = item;
                if (dom.hasClass(item, "x-navmenu-collapsable")) {
                    var ul = dom.last(item);
                    dom.addClass(ul, "x-navmenu-popover");
                    dom.addClass(ul, "x-popup");
                    dom.show(ul, "opacity", undefined, this.duration);
                    pin_1.default(ul, dom.first(item), "rightTop", 1, document);
                }
            }
        };
        /**
         * 鼠标移出折叠项事件。
         */
        NavMenu.prototype.handleItemPointerLeave = function (e, item) {
            if (this.collapsed && dom.hasClass(item, "x-navmenu-collapsable")) {
                var ul_1 = dom.last(item);
                dom.hide(ul_1, "opacity", function () {
                    dom.removeClass(ul_1, "x-navmenu-popover");
                    dom.removeClass(ul_1, "x-popup");
                }, this.duration);
            }
        };
        __decorate([
            control_1.bind("", "class", "x-navmenu-mini")
        ], NavMenu.prototype, "collapsed", void 0);
        return NavMenu;
    }(control_1.default));
    exports.default = NavMenu;
});
//# sourceMappingURL=navMenu.js.map