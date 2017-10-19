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
define(["require", "exports", "ui/control", "ui/checkBox", "./radioButton.scss"], function (require, exports, control_1, checkBox_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个单选按钮。
     */
    var RadioButton = /** @class */ (function (_super) {
        __extends(RadioButton, _super);
        function RadioButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RadioButton.prototype.render = function () {
            return control_1.VNode.create("label", { class: "x-checkbox x-radiobutton" },
                control_1.VNode.create("input", { type: "radio", class: "x-checkbox-button", __control__: this }),
                control_1.VNode.create("i", { class: "x-icon" }, "\u25EF"),
                control_1.VNode.create("i", { class: "x-icon" }, "\uD83D\uDDB8"),
                "\u00A0");
        };
        return RadioButton;
    }(checkBox_1.default));
    exports.default = RadioButton;
});
//# sourceMappingURL=radioButton.js.map