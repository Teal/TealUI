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
define(["require", "exports", "web/dom", "web/scroll", "web/keyPress", "ui/control", "ui/input", "./listBox.scss"], function (require, exports, dom, scroll_1, keyPress_1, control_1, input_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个列表框基类。
     */
    var List = /** @class */ (function (_super) {
        __extends(List, _super);
        function List() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        List.prototype.render = function () {
            return control_1.VNode.create("ul", { class: "x-listbox" });
        };
        Object.defineProperty(List.prototype, "items", {
            /**
             * 所有项。
             */
            get: function () {
                return this.query(".x-listbox>li");
            },
            set: function (value) {
                this.body.innerHTML = "";
                if (Array.isArray(value)) {
                    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                        var item = value_1[_i];
                        if (item instanceof ListItem) {
                            item.renderTo(this);
                        }
                        else {
                            var listItem = new ListItem();
                            listItem.content = item;
                            listItem.renderTo(this);
                        }
                    }
                }
                else {
                    for (var key in value) {
                        var item = new ListItem();
                        item.key = key;
                        item.content = value[key];
                        item.renderTo(this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "selectedItem", {
            /**
             * 选中的第一项。
             */
            get: function () {
                return this.find(".x-listbox>.x-listbox-selected");
            },
            set: function (value) {
                var old = this.selectedItem;
                if (old)
                    old.selected = false;
                if (value)
                    value.selected = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "selectedIndex", {
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
        /**
         * 获取指定键对应的项。
         * @param key 相关的键。
         * @return 返回匹配的第一个项。如果不存在则返回 undefined。
         */
        List.prototype.findItemByKey = function (key) {
            return key == null ? null : this.items.find(function (x) { return x.key == key; });
        };
        /**
         * 获取指定内容对应的项。
         * @param content 相关的内容。
         * @return 返回匹配的第一个项。如果不存在则返回 undefined。
         */
        List.prototype.findItemByContent = function (content) {
            return this.items.find(function (x) { return x.content == content; });
        };
        __decorate([
            control_1.bind("", "class", "x-listbox-readonly")
        ], List.prototype, "readOnly", void 0);
        __decorate([
            control_1.bind("", "class", "x-listbox-disabled")
        ], List.prototype, "disabled", void 0);
        return List;
    }(input_1.default));
    exports.List = List;
    /**
     * 表示一个列表项。
     */
    var ListItem = /** @class */ (function (_super) {
        __extends(ListItem, _super);
        function ListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ListItem.prototype.render = function () {
            return control_1.VNode.create("li", null,
                control_1.VNode.create("a", { href: "javascript:;", draggable: false }));
        };
        Object.defineProperty(ListItem.prototype, "key", {
            /**
             * 键。
             */
            get: function () {
                var key = dom.getAttr(this.elem, "data-key");
                return key != undefined ? key : this.content;
            },
            set: function (value) {
                dom.setAttr(this.elem, "data-key", value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItem.prototype, "selected", {
            /**
             * 是否选中。
             */
            get: function () {
                return dom.hasClass(this.elem, "x-listbox-selected");
            },
            set: function (value) {
                dom.toggleClass(this.elem, "x-listbox-selected", value);
                if (value) {
                    this.elem.setAttribute("aria-selected", "true");
                }
                else {
                    this.elem.removeAttribute("aria-selected");
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            control_1.bind("a")
        ], ListItem.prototype, "body", void 0);
        __decorate([
            control_1.bind("@body", "textContent")
        ], ListItem.prototype, "content", void 0);
        return ListItem;
    }(control_1.default));
    exports.ListItem = ListItem;
    /**
     * 表示一个列表框。
     */
    var ListBox = /** @class */ (function (_super) {
        __extends(ListBox, _super);
        function ListBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ListBox.prototype, "value", {
            /**
             * 值。
             */
            get: function () {
                var item = this.selectedItem;
                if (item) {
                    return item.key;
                }
                return null;
            },
            set: function (value) {
                this.selectedItem = this.findItemByKey(value);
            },
            enumerable: true,
            configurable: true
        });
        ListBox.prototype.init = function () {
            _super.prototype.init.call(this);
            dom.on(this.body, "click", ".x-listbox>li", this.handleItemClick, this);
            keyPress_1.default(this.elem, this.keyMappings);
        };
        /**
         * 处理项点击事件。
         */
        ListBox.prototype.handleItemClick = function (e, item) {
            if (!this.disabled && !this.readOnly) {
                this.select(item, e);
            }
        };
        /**
         * 选中项。
         * @param item 要选中的项。
         * @param e 事件参数。
         */
        ListBox.prototype.select = function (item, e) {
            item = control_1.from(item);
            if (this.onSelect && this.onSelect(item, e, this) === false) {
                return;
            }
            var changed = this.selectedItem !== item;
            if (changed) {
                this.selectedItem = item;
            }
            if (item) {
                scroll_1.scrollIntoViewIfNeeded(item.elem, this.body, this.duration);
            }
            if (changed && this.onChange) {
                this.onChange(e, this);
            }
        };
        Object.defineProperty(ListBox.prototype, "keyMappings", {
            /**
             * 获取键盘绑定。
             * @return 返回各个键盘绑定对象。
             */
            get: function () {
                var _this = this;
                var upDown = function (e, delta) {
                    var items = _this.items;
                    if (items.length) {
                        var index = _this.selectedIndex + delta;
                        if (index < 0)
                            index += items.length;
                        if (index >= items.length)
                            index = 0;
                        _this.select(items[index], e);
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
        return ListBox;
    }(List));
    exports.default = ListBox;
});
//# sourceMappingURL=listBox.js.map