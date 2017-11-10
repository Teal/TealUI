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
define(["require", "exports", "web/dom", "ui/comboBox"], function (require, exports, dom, comboBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个选择框。
     */
    var Select = /** @class */ (function (_super) {
        __extends(Select, _super);
        function Select() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Select.prototype.init = function () {
            _super.prototype.init.call(this);
            this.input.readOnly = true;
            dom.addClass(this.elem, "x-picker-select");
        };
        Select.prototype.createDropDown = function () {
            var dropDown = _super.prototype.createDropDown.call(this);
            dropDown.event = "click";
            return dropDown;
        };
        Select.prototype.handleButtonClick = function () {
            // FIXME: (this.dropDown as any)._toggle 是什么?
            this.dropDown.toggle(this.dropDown._toggle);
        };
        Object.defineProperty(Select.prototype, "selectedItem", {
            /**
             * 选中的第一项。
             */
            get: function () {
                return this._selectedItem;
            },
            set: function (value) {
                this._selectedItem = value;
                this.input.value = value ? value.content : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Select.prototype, "value", {
            get: function () {
                if (this._selectedItem) {
                    return this._selectedItem.key;
                }
                return this.input.value;
            },
            set: function (value) {
                var item = this._selectedItem = this.menu.findItemByKey(value);
                if (item) {
                    value = item.content;
                }
                this.input.value = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Select.prototype, "defaultValue", {
            get: function () {
                if (this._selectedItem) {
                    return this._selectedItem.key;
                }
                return this.input.defaultValue;
            },
            set: function (value) {
                var item = this._selectedItem = this.menu.findItemByKey(value);
                if (item) {
                    value = item.content;
                }
                this.input.defaultValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return Select;
    }(comboBox_1.default));
    exports.default = Select;
});
//# sourceMappingURL=select.js.map