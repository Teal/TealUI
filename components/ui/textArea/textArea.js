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
define(["require", "exports", "ui/control", "ui/textBox"], function (require, exports, control_1, textBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个文本域。
     */
    var TextArea = /** @class */ (function (_super) {
        __extends(TextArea, _super);
        function TextArea() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextArea.prototype.render = function () {
            return control_1.VNode.create("textarea", { class: "x-textbox", rows: 6 });
        };
        __decorate([
            control_1.bind("@input", "rows")
        ], TextArea.prototype, "rows", void 0);
        return TextArea;
    }(textBox_1.default));
    exports.default = TextArea;
});
//# sourceMappingURL=textArea.js.map