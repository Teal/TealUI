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
define(["require", "exports", "ui/checkBoxGroup"], function (require, exports, checkBoxGroup_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个单选按钮组。
     */
    var RadioButtonGroup = /** @class */ (function (_super) {
        __extends(RadioButtonGroup, _super);
        function RadioButtonGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RadioButtonGroup.prototype.init = function () {
            if (!this.name)
                this.name = "_" + RadioButtonGroup._id++;
        };
        Object.defineProperty(RadioButtonGroup.prototype, "value", {
            get: function () {
                var item = this.inputs.find(function (input) { return input.value; });
                return item ? item.key : null;
            },
            set: function (value) {
                this.inputs.forEach(function (item) {
                    item.value = item.key == value;
                });
            },
            enumerable: true,
            configurable: true
        });
        RadioButtonGroup._id = 0;
        return RadioButtonGroup;
    }(checkBoxGroup_1.default));
    exports.default = RadioButtonGroup;
});
//# sourceMappingURL=radioButtonGroup.js.map