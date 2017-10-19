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
define(["require", "exports", "ui/control"], function (require, exports, control_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个复选框组。
     */
    var CheckBoxGroup = /** @class */ (function (_super) {
        __extends(CheckBoxGroup, _super);
        function CheckBoxGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(CheckBoxGroup.prototype, "inputs", {
            /**
             * 获取所有按钮。
             */
            get: function () { return this.query("input[type=checkbox],input[type=radio]"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBoxGroup.prototype, "name", {
            /**
             * 组名称。
             */
            get: function () {
                return control_1.data(this).name;
            },
            set: function (value) {
                control_1.data(this).name = value;
                this.inputs.forEach(function (input) { input.name = value; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBoxGroup.prototype, "disabled", {
            /**
             * 是否禁用。
             */
            get: function () {
                return control_1.data(this).disabled;
            },
            set: function (value) {
                control_1.data(this).disabled = value;
                this.inputs.forEach(function (input) { input.disabled = value; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBoxGroup.prototype, "readOnly", {
            /**
             * 是否只读。
             */
            get: function () {
                return control_1.data(this).readOnly;
            },
            set: function (value) {
                control_1.data(this).readOnly = value;
                this.inputs.forEach(function (input) { input.readOnly = value; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBoxGroup.prototype, "value", {
            get: function () {
                return this.inputs.filter(function (input) { return input.value; }).map(function (input) { return input.key; });
            },
            set: function (value) {
                next: for (var _i = 0, _a = this.inputs; _i < _a.length; _i++) {
                    var input = _a[_i];
                    var key = input.key;
                    for (var _b = 0, value_1 = value; _b < value_1.length; _b++) {
                        var item = value_1[_b];
                        if (item == key) {
                            input.value = true;
                            continue next;
                        }
                    }
                    input.value = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            control_1.bind("@input", "onFocus")
        ], CheckBoxGroup.prototype, "onFocus", void 0);
        __decorate([
            control_1.bind("@input", "onBlur")
        ], CheckBoxGroup.prototype, "onBlur", void 0);
        __decorate([
            control_1.bind("@input", "onFocusIn")
        ], CheckBoxGroup.prototype, "onFocusIn", void 0);
        __decorate([
            control_1.bind("@input", "onFocusOut")
        ], CheckBoxGroup.prototype, "onFocusOut", void 0);
        __decorate([
            control_1.bind("", "onChange")
        ], CheckBoxGroup.prototype, "onChange", void 0);
        return CheckBoxGroup;
    }(control_1.default));
    exports.default = CheckBoxGroup;
});
//# sourceMappingURL=checkBoxGroup.js.map