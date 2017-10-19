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
define(["require", "exports", "web/dom", "ui/select", "util/pinyin"], function (require, exports, dom, select_1, pinyin_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个选择框。
     */
    var Suggest = /** @class */ (function (_super) {
        __extends(Suggest, _super);
        function Suggest() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._cache = { __proto__: null };
            return _this;
        }
        Suggest.prototype.init = function () {
            _super.prototype.init.call(this);
            this.input.readOnly = false;
            dom.removeClass(this.elem, "x-picker-select");
            dom.on(this.input, "input", this.handleInput, this);
        };
        Suggest.prototype.handleInput = function () {
            var value = this.input.value.trim();
            var hasItem;
            for (var _i = 0, _a = this.menu.items; _i < _a.length; _i++) {
                var item = _a[_i];
                var val = !!value && !this.match(value, item.content);
                if (!val) {
                    hasItem = true;
                }
                item.hidden = val;
            }
            this.dropDown.toggle(hasItem);
            this.dropDown.realign();
        };
        Suggest.prototype.match = function (value, item) {
            value = value.toLowerCase();
            var c = this._cache[item];
            if (!c) {
                c = this._cache[item] = {
                    lower: item.toLowerCase(),
                    pinyin: item.split("").map(function (x) { return pinyin_1.getPinYinOfChar(x).join("|") || "_"; }).join("").toLowerCase(),
                    py: item.split("").map(function (x) { return (pinyin_1.getPinYinOfChar(x).join("|") || "_")[0]; }).join("").toLowerCase()
                };
            }
            if (c.lower.indexOf(value) >= 0) {
                return true;
            }
            if (c.pinyin.indexOf(value) >= 0) {
                return true;
            }
            if (c.py.indexOf(value) >= 0) {
                return true;
            }
            return false;
        };
        Suggest.prototype.validate = function (value) {
            var b = _super.prototype.validate.call(this, value);
            if (b) {
                return b;
            }
            if (this.menu.findItemByKey(value)) {
                return "";
            }
            return "请从菜单中选择项";
        };
        Object.defineProperty(Suggest.prototype, "body", {
            get: function () {
                this.elem;
                return this.menu.body;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Suggest.prototype, "value", {
            get: function () {
                var _this = this;
                var c = this.input.value;
                this.menu.items.forEach(function (item) {
                    if (item.body.textContent == _this.input.value) {
                        c = item.key;
                    }
                });
                return c;
            },
            set: function (value) {
                this.menu.value = value;
                this.input.value = this.menu.selectedItem ? this.menu.selectedItem.elem.textContent : value;
            },
            enumerable: true,
            configurable: true
        });
        return Suggest;
    }(select_1.default));
    exports.default = Suggest;
});
//# sourceMappingURL=suggest.js.map