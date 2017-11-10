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
define(["require", "exports", "web/dom", "ui/multiListBox", "ui/comboBox"], function (require, exports, dom, multiListBox_1, comboBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个选择框。
     */
    var MultiSelect = /** @class */ (function (_super) {
        __extends(MultiSelect, _super);
        function MultiSelect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 每项之间的分隔符。
             */
            _this.seperator = ",";
            return _this;
        }
        MultiSelect.prototype.init = function () {
            _super.prototype.init.call(this);
            this.input.readOnly = true;
            dom.addClass(this.elem, "x-picker-select");
        };
        MultiSelect.prototype.createMenu = function () {
            var _this = this;
            var menu = new multiListBox_1.default();
            menu.onSelect = function (item, value, e) {
                if (_this.onSelect && _this.onSelect(item, e, _this) === false) {
                    return false;
                }
            };
            menu.onChange = function (e) {
                _this.input.value = _this.menu.selectedItems.map(function (item) { return item.content; }).join(_this.seperator);
                _this.onChange && _this.onChange(e, _this);
            };
            return menu;
        };
        MultiSelect.prototype.createDropDown = function () {
            var dropDown = _super.prototype.createDropDown.call(this);
            dropDown.event = "click";
            return dropDown;
        };
        MultiSelect.prototype.handleButtonClick = function () {
            // FIXME: (this.dropDown as any)._toggle 是什么?
            this.dropDown.toggle(this.dropDown._toggle);
        };
        Object.defineProperty(MultiSelect.prototype, "selectedItems", {
            /**
             * 选中的第一项。
             */
            get: function () {
                return this.menu.selectedItems;
            },
            set: function (value) {
                this.menu.selectedItems = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiSelect.prototype, "value", {
            get: function () {
                return this.menu.selectedItems.map(function (item) { return item.key; });
            },
            set: function (value) {
                var contents = [];
                this.menu.items.forEach(function (item) {
                    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                        var v = value_1[_i];
                        if (v == item.key) {
                            item.selected = true;
                            contents.push(item.content);
                            return;
                        }
                    }
                    item.selected = false;
                });
                this.input.value = contents.join(this.seperator);
            },
            enumerable: true,
            configurable: true
        });
        MultiSelect.prototype.updateMenu = function () {
        };
        return MultiSelect;
    }(comboBox_1.default));
    exports.default = MultiSelect;
});
//# sourceMappingURL=multiSelect.js.map