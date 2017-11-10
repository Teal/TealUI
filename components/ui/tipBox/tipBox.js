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
define(["require", "exports", "web/dom", "ui/control", "web/status", "typo/icon", "typo/close", "./tipBox.scss"], function (require, exports, dom, control_1, status_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个提示框。
     */
    var TipBox = /** @class */ (function (_super) {
        __extends(TipBox, _super);
        function TipBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TipBox.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-tipbox x-block" },
                control_1.VNode.create("button", { class: "x-close x-icon", title: "关闭", "aria-label": "关闭" }, "\u2716"),
                control_1.VNode.create("span", { class: "x-tipbox-body" }));
        };
        Object.defineProperty(TipBox.prototype, "closable", {
            /**
             * 是否可关闭。
             */
            get: function () {
                return !dom.isHidden(this.find(">.x-close"));
            },
            set: function (value) {
                dom.toggle(this.find(">.x-close"), value);
            },
            enumerable: true,
            configurable: true
        });
        TipBox.prototype.init = function () {
            dom.on(this.elem, "click", ">.x-close", this.close, this);
        };
        /**
         * 关闭当前提示框。
         */
        TipBox.prototype.close = function () {
            var _this = this;
            dom.hide(this.elem, "height", function () {
                dom.remove(_this.elem);
                _this.onClose && _this.onClose(_this);
            }, this.duration);
        };
        Object.defineProperty(TipBox.prototype, "status", {
            /**
             * 状态。
             */
            get: function () {
                return status_1.getStatus(this.elem, "x-tipbox-");
            },
            set: function (value) {
                status_1.setStatus(this.elem, "x-tipbox-", value);
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            control_1.bind(".x-tipbox-body")
        ], TipBox.prototype, "body", void 0);
        return TipBox;
    }(control_1.default));
    exports.default = TipBox;
});
//# sourceMappingURL=tipBox.js.map