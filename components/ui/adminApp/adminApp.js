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
define(["require", "exports", "web/dom", "ui/control", "ui/navMenu", "ui/navTab", "web/movable", "util/function", "./adminApp.scss"], function (require, exports, dom, control_1, navMenu_1, navTab_1, movable_1, function_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个管理端界面布局。
     */
    var AdminApp = /** @class */ (function (_super) {
        __extends(AdminApp, _super);
        function AdminApp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.logount = "退出";
            _this.homePage = "javascript:;";
            _this.logountUrl = "javascript://退出登陆";
            _this.handleCollapseClick = function_1.limit(function () {
                _this.toggleMenuCollapse();
            }, 400);
            return _this;
        }
        AdminApp.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-adminapp", style: "height:300px;" },
                control_1.VNode.create("header", { class: "x-adminapp-header" },
                    control_1.VNode.create("a", { href: "javascript:;", class: "x-adminapp-button x-adminapp-collapse", onClick: this.handleCollapseClick }),
                    control_1.VNode.create("a", { href: this.homePage, class: "x-adminapp-text" },
                        control_1.VNode.create("img", { src: this.logo }),
                        control_1.VNode.create("span", null, this.title)),
                    control_1.VNode.create("div", { class: "x-adminapp-right" },
                        control_1.VNode.create("div", { class: "x-adminapp-text" },
                            control_1.VNode.create("a", { href: "javascript:;", class: "x-adminapp-username" }, this.userName)),
                        control_1.VNode.create("a", { class: "x-adminapp-button x-adminapp-logout", href: this.logountUrl }, this.logount))),
                control_1.VNode.create("div", { class: "x-adminapp-container" },
                    control_1.VNode.create(navMenu_1.default, { class: "x-adminapp-sidebar" }),
                    control_1.VNode.create("div", { class: "x-adminapp-splitter" }),
                    control_1.VNode.create("div", { class: "x-adminapp-main" },
                        control_1.VNode.create(navTab_1.default, { class: "x-adminapp-tabs" }),
                        control_1.VNode.create("div", { class: "x-adminapp-body" }))));
        };
        AdminApp.prototype.init = function () {
            var self = this;
            dom.setStyle(self.splitter, "left", dom.getStyle(this.navMenu.elem, "width"));
            var startWidth;
            var startLeft;
            movable_1.default(this.splitter, {
                moveStart: function () {
                    startWidth = dom.getRect(self.navMenu.elem).width;
                    startLeft = dom.computeStyle(self.main, "left");
                },
                move: function (e) {
                    var newSidebarWidth = startWidth + this.offsetX;
                    var newLeft = startLeft + this.offsetX;
                    var delta = 16 * 6 - newSidebarWidth;
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
                    setTimeout(function () { dom.setStyle(self.main, "transition", ""); }, 0);
                }
            });
        };
        /**
         * 切换菜单的折叠效果。
         */
        AdminApp.prototype.toggleMenuCollapse = function () {
            var collapsed = !this.navMenu.collapsed;
            this.navMenu.toggleCollapse();
            dom.toggleClass(this.elem, "x-adminapp-collapsed", collapsed);
            dom.toggle(this.splitter, !collapsed);
        };
        __decorate([
            control_1.bind
        ], AdminApp.prototype, "logo", void 0);
        __decorate([
            control_1.bind
        ], AdminApp.prototype, "title", void 0);
        __decorate([
            control_1.bind
        ], AdminApp.prototype, "userName", void 0);
        __decorate([
            control_1.bind
        ], AdminApp.prototype, "logount", void 0);
        __decorate([
            control_1.bind
        ], AdminApp.prototype, "homePage", void 0);
        __decorate([
            control_1.bind
        ], AdminApp.prototype, "logountUrl", void 0);
        __decorate([
            control_1.bind(".x-adminapp-sidebar")
        ], AdminApp.prototype, "navMenu", void 0);
        __decorate([
            control_1.bind(".x-adminapp-tabs")
        ], AdminApp.prototype, "navTab", void 0);
        __decorate([
            control_1.bind(".x-adminapp-main")
        ], AdminApp.prototype, "main", void 0);
        __decorate([
            control_1.bind(".x-adminapp-body")
        ], AdminApp.prototype, "body", void 0);
        __decorate([
            control_1.bind(".x-adminapp-splitter")
        ], AdminApp.prototype, "splitter", void 0);
        return AdminApp;
    }(control_1.default));
    exports.default = AdminApp;
});
//# sourceMappingURL=adminApp.js.map