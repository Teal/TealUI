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
define(["require", "exports", "web/dom", "web/scroll", "web/keyPress", "ui/control", "ui/picker", "ui/listBox", "typo/icon"], function (require, exports, dom, scroll_1, keyPress_1, control_1, picker_1, listBox_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个组合框。
     */
    var ComboBox = /** @class */ (function (_super) {
        __extends(ComboBox, _super);
        function ComboBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ComboBox.prototype, "selectedItem", {
            /**
             * 选中的第一项。
             */
            get: function () {
                if (this._selectedItem && this._selectedItem.content === this.input.value) {
                    return this._selectedItem;
                }
                return this._selectedItem = this.menu.findItemByContent(this.input.value);
            },
            set: function (value) {
                this._selectedItem = value;
                this.input.value = value ? value.content : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComboBox.prototype, "selectedIndex", {
            /**
             * 选中的第一项的索引。
             */
            get: function () {
                var item = this.selectedItem;
                return item ? dom.index(item.elem) : -1;
            },
            set: function (value) {
                this.selectedItem = value >= 0 ? this.items[value] : null;
            },
            enumerable: true,
            configurable: true
        });
        ComboBox.prototype.createMenu = function () {
            var _this = this;
            var menu = new listBox_1.default();
            dom.on(menu.body, "pointermove", "li", function (e, item) {
                _this.menu.selectedItem = control_1.from(item);
            });
            menu.onSelect = function (item, e) {
                if (e && e.__ignore__) {
                    return;
                }
                _this.handleMenuSelect(item, e);
            };
            return menu;
        };
        ComboBox.prototype.init = function () {
            _super.prototype.init.call(this);
            keyPress_1.default(this.input, this.keyMappings);
        };
        Object.defineProperty(ComboBox.prototype, "keyMappings", {
            get: function () {
                var _this = this;
                var mappings = this.menu.keyMappings;
                return {
                    up: function (e) {
                        if (_this.dropDown.hidden) {
                            _this.dropDown.show();
                        }
                        else {
                            e.__ignore__ = true;
                            mappings.up(e);
                        }
                    },
                    down: function (e) {
                        if (_this.dropDown.hidden) {
                            _this.dropDown.show();
                        }
                        else {
                            e.__ignore__ = true;
                            mappings.down(e);
                        }
                    },
                    enter: function (e) {
                        if (_this.dropDown.hidden) {
                            return false;
                        }
                        var item = _this.menu.selectedItem;
                        if (item)
                            _this.menu.onSelect(item, e, _this.menu);
                    },
                    esc: function () {
                        if (_this.dropDown.hidden) {
                            return false;
                        }
                        _this.dropDown.hide();
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理项选中事件。
         * @param item 当前选中的项。
         * @param e 事件参数。
         */
        ComboBox.prototype.handleMenuSelect = function (item, e) {
            if (this.onSelect && this.onSelect(item, e, this) === false) {
                return;
            }
            this.dropDown.hide();
            if (this.selectedItem !== item) {
                this.selectedItem = item;
                this.onChange && this.onChange(e, this);
            }
        };
        ComboBox.prototype.updateMenu = function () {
            var item = this.menu.selectedItem = this.selectedItem;
            if (item) {
                scroll_1.scrollIntoViewIfNeeded(item.elem, this.menu.body, this.duration);
            }
        };
        __decorate([
            control_1.bind("@menu", "items")
        ], ComboBox.prototype, "items", void 0);
        return ComboBox;
    }(picker_1.default));
    exports.default = ComboBox;
});
//# sourceMappingURL=comboBox.js.map