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
define(["require", "exports", "ui/control", "ui/input", "./textBox.scss"], function (require, exports, control_1, input_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个文本框。
     */
    var TextBox = /** @class */ (function (_super) {
        __extends(TextBox, _super);
        function TextBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextBox.prototype.render = function () {
            return control_1.VNode.create("input", { type: "text", class: "x-textbox" });
        };
        /**
         * 全选当前控件。
         */
        TextBox.prototype.select = function () {
            this.input.select();
        };
        __decorate([
            control_1.bind("@input", "onSelect")
        ], TextBox.prototype, "onSelectEnd", void 0);
        return TextBox;
    }(input_1.default));
    exports.default = TextBox;
    TextBox.prototype.statusClassPrefix = "x-textbox-";
    TextBox.prototype.validateEvent = "input";
    TextBox.prototype.validateDelay = 500;
});
//# sourceMappingURL=textBox.js.map