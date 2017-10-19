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
define(["require", "exports", "web/dom", "ui/control", "typo/icon/icon.scss", "./panel.scss"], function (require, exports, dom, control_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个面板。
     */
    var Panel = /** @class */ (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Panel.prototype.render = function () {
            return control_1.VNode.create("section", { class: "x-panel" },
                control_1.VNode.create("header", { class: "x-panel-header" },
                    control_1.VNode.create("h5", null)),
                control_1.VNode.create("div", { class: "x-panel-body" }));
        };
        Object.defineProperty(Panel.prototype, "collapsable", {
            /**
             * 是否可折叠。
             */
            get: function () {
                return dom.hasClass(this.elem, "x-panel-collapsable");
            },
            set: function (value) {
                if (value !== this.collapsable) {
                    dom.toggleClass(this.elem, "x-panel-collapsable", value);
                    if (value) {
                        dom.on(this.header, "click", this.handleHeaderClick, this);
                    }
                    else {
                        dom.off(this.header, "click", this.handleHeaderClick, this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理标题点击事件。
         */
        Panel.prototype.handleHeaderClick = function () {
            this.toggleCollapse();
        };
        /**
         * 切换面板的折叠状态。
         * @param value 如果为 true 则强制折叠；如果为 false 则强制展开。
         */
        Panel.prototype.toggleCollapse = function (value) {
            var _this = this;
            if (value === void 0) { value = !this.collapsed; }
            if (value !== this.collapsed) {
                if (this.onCollapseChange && this.onCollapseChange(value, this) === false) {
                    return;
                }
                dom.addClass(this.elem, "x-panel-collapsing");
                this.collapsed = value;
                dom.toggle(this.body, !value, "height", function () {
                    dom.removeClass(_this.elem, "x-panel-collapsing");
                    if (value) {
                        _this.body.style.display = "";
                    }
                }, this.duration);
            }
        };
        __decorate([
            control_1.bind(".x-panel-header")
        ], Panel.prototype, "header", void 0);
        __decorate([
            control_1.bind(".x-panel-body")
        ], Panel.prototype, "body", void 0);
        __decorate([
            control_1.bind(".x-panel-header h5", "innerHTML")
        ], Panel.prototype, "title", void 0);
        __decorate([
            control_1.bind("", "class", "x-panel-collapsed")
        ], Panel.prototype, "collapsed", void 0);
        return Panel;
    }(control_1.default));
    exports.default = Panel;
});
//# sourceMappingURL=panel.js.map