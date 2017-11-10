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
define(["require", "exports", "web/dom", "web/keyPress", "web/scroll", "ui/control", "ui/listBox"], function (require, exports, dom, keyPress_1, scroll_1, control_1, listBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个多选列表框。
     */
    var MultiListBox = /** @class */ (function (_super) {
        __extends(MultiListBox, _super);
        function MultiListBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MultiListBox.prototype, "selectedItems", {
            /**
             * 所有选中项。
             */
            get: function () {
                return this.query(".x-listbox>.x-listbox-selected");
            },
            set: function (value) {
                this.selectedItems.forEach(function (item) { item.selected = false; });
                if (value)
                    value.forEach(function (item) { item.selected = true; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiListBox.prototype, "value", {
            /**
             * 值。
             */
            get: function () {
                return this.selectedItems.map(function (item) { return item.key; });
            },
            set: function (value) {
                this.items.forEach(function (item) {
                    item.selected = false;
                    if (value) {
                        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                            var v = value_1[_i];
                            if (item.key == v) {
                                item.selected = true;
                                break;
                            }
                        }
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        MultiListBox.prototype.init = function () {
            _super.prototype.init.call(this);
            dom.on(this.body, "pointerdown", ">li", this.handleItemPointerDown, this);
            keyPress_1.default(this.elem, this.keyMappings);
        };
        /**
         * 处理项指针按下事件。
         */
        MultiListBox.prototype.handleItemPointerDown = function (e, item) {
            e.preventDefault();
            if (!this.disabled && !this.readOnly) {
                dom.on(document, "pointerup", this.handlePointerUp, this);
                dom.on(this.body, "pointerenter", "li", this.handlePointerMove, this);
                item = control_1.from(item);
                this.select(e.shiftKey ? this._lastClickItem : item, item, this._lastSelected = !item.selected, this._ctrlKeyPressed = !!(e.ctrlKey || e.metaKey) === !!this.ctrlKey, e);
                this._lastClickItem = item;
            }
        };
        /**
         * 处理指针移动事件。
         */
        MultiListBox.prototype.handlePointerMove = function (e, item) {
            this.select(this._lastClickItem, item, this._lastSelected, this._ctrlKeyPressed, e);
        };
        /**
         * 处理指针松开事件。
         */
        MultiListBox.prototype.handlePointerUp = function (e) {
            dom.off(this.body, "pointerenter", "li", this.handlePointerMove, this);
            dom.off(document, "pointerup", this.handlePointerUp, this);
        };
        /**
         * 选中项。
         * @param start 选区的第一个节点。
         * @param end 选区的最后一个节点。默认同 *from*。
         * @param value 如果为 true 则表示选中，如果为 false 则表示不选中。
         * @param add 如果为 true 则合并之前选中的项，否则为替代。
         * @param e 事件参数。
         */
        MultiListBox.prototype.select = function (start, end, value, add, e) {
            if (end === void 0) { end = start; }
            if (value === void 0) { value = true; }
            var items = this.items;
            var last = control_1.from(end);
            var startIndex = items.indexOf(control_1.from(start));
            var endIndex = items.indexOf(last);
            if (startIndex > endIndex) {
                var t = startIndex;
                startIndex = endIndex;
                endIndex = t;
            }
            var changed = false;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (i >= startIndex && i <= endIndex) {
                    if (!this.onSelect || this.onSelect(item, value, e, this) !== false) {
                        if (item.selected !== value) {
                            item.selected = value;
                            changed = true;
                        }
                    }
                }
                else if (!add && value && item.selected === value && (!this.onSelect || this.onSelect(item, !value, e, this) !== false)) {
                    item.selected = !value;
                    changed = true;
                }
            }
            if (last) {
                scroll_1.scrollIntoViewIfNeeded(last.elem, this.body, this.duration);
            }
            if (changed && this.onChange) {
                this.onChange(e, this);
            }
        };
        Object.defineProperty(MultiListBox.prototype, "keyMappings", {
            /**
             * 获取键盘绑定。
             * @return 返回各个键盘绑定对象。
             */
            get: function () {
                var _this = this;
                var upDown = function (e, delta) {
                    var items = _this.items;
                    var selectedItem = delta < 0 ? _this.selectedItem : _this.selectedItems[_this.selectedItems.length - 1];
                    var newSelected;
                    if (selectedItem) {
                        if (!(newSelected = items[items.indexOf(selectedItem) + delta])) {
                            return true;
                        }
                        _this.select(newSelected, undefined, !newSelected.selected, !_this.ctrlKey || e.shiftKey || e.ctrlKey || e.metaKey);
                    }
                    else {
                        _this.select(newSelected = items[delta > 0 ? 0 : items.length - 1], undefined, undefined, undefined, e);
                    }
                };
                return {
                    up: function (e) {
                        upDown(e, -1);
                    },
                    down: function (e) {
                        upDown(e, 1);
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        return MultiListBox;
    }(listBox_1.List));
    exports.default = MultiListBox;
});
//# sourceMappingURL=multiListBox.js.map