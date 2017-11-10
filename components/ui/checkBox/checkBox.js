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
define(["require", "exports", "web/dom", "ui/control", "ui/input", "typo/icon/icon.scss", "./checkBox.scss"], function (require, exports, dom, control_1, input_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个复选框。
     */
    var CheckBox = /** @class */ (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CheckBox.prototype.render = function () {
            return control_1.VNode.create("label", { class: "x-checkbox" },
                control_1.VNode.create("input", { type: "checkbox", class: "x-checkbox-button", __control__: this }),
                control_1.VNode.create("i", { class: "x-icon" }, "\u2610"),
                control_1.VNode.create("i", { class: "x-icon" }, "\u2611"),
                "\u00A0");
        };
        Object.defineProperty(CheckBox.prototype, "threeState", {
            /**
             * 是否启用第三状态。
             */
            get: function () {
                return this.find(".x-icon").innerHTML === this.threeStateIcon;
            },
            set: function (value) {
                var icon = this.find(".x-icon");
                if (value) {
                    this.value = false;
                    icon._innerHTML = icon.innerHTML;
                    icon.innerHTML = this.threeStateIcon;
                    dom.on(this.input, "change", this.offThreeState, this);
                }
                else {
                    icon.innerHTML = icon._innerHTML;
                    dom.off(this.input, "change", this.offThreeState, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        CheckBox.prototype.offThreeState = function () {
            this.threeState = false;
        };
        __decorate([
            control_1.bind("@input", "checked")
        ], CheckBox.prototype, "value", void 0);
        __decorate([
            control_1.bind("@input", "defaultChecked")
        ], CheckBox.prototype, "defaultValue", void 0);
        __decorate([
            control_1.bind("@input", "value")
        ], CheckBox.prototype, "key", void 0);
        return CheckBox;
    }(input_1.default));
    exports.default = CheckBox;
    CheckBox.prototype.threeStateIcon = "⊞";
});
//# sourceMappingURL=checkBox.js.map