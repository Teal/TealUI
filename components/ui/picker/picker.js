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
define(["require", "exports", "web/dom", "ui/control", "web/popup", "ui/textBox", "ui/button/button.scss", "./picker.scss"], function (require, exports, dom, control_1, popup_1, textBox_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个填选器。
     */
    var Picker = /** @class */ (function (_super) {
        __extends(Picker, _super);
        function Picker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Picker.prototype.render = function () {
            return control_1.VNode.create("span", { class: "x-picker" },
                control_1.VNode.create("input", { type: "text", class: "x-textbox", autocomplete: "off", __control__: this }),
                control_1.VNode.create("button", { type: "button", class: "x-button", tabIndex: -1 },
                    control_1.VNode.create("i", { class: "x-icon" }, "\u2B9F")));
        };
        Object.defineProperty(Picker.prototype, "disabled", {
            get: function () {
                return this.input.disabled && this.button.disabled;
            },
            set: function (value) {
                this.button.disabled = this.input.disabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Picker.prototype, "readOnly", {
            get: function () {
                return this.input.readOnly && this.button.disabled;
            },
            set: function (value) {
                this.button.disabled = this.input.readOnly = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Picker.prototype, "menu", {
            /**
             * 下拉菜单控件。
             */
            get: function () {
                var menu = this._menu;
                if (!menu) {
                    this._menu = menu = this.createMenu();
                    menu.renderTo(this.elem);
                    dom.addClass(menu.elem, "x-popup");
                    Object.assign(menu, this.menuOptions);
                    if (this.resizeMode === "fitDropDown") {
                        dom.show(menu.elem);
                        dom.setRect(this.elem, { width: dom.getRect(menu.elem).width });
                    }
                    dom.hide(menu.elem);
                }
                return this._menu;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当被子类重写时负责创建下拉菜单。
         * @return 返回下拉菜单。
         */
        Picker.prototype.createMenu = function () {
            return new control_1.default();
        };
        /**
         * 当被子类重写时负责更新下拉菜单的值。
         */
        Picker.prototype.updateMenu = function () { };
        Object.defineProperty(Picker.prototype, "body", {
            get: function () { return this.menu.body; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Picker.prototype, "dropDown", {
            /**
             * 下拉菜单。
             */
            get: function () {
                var dropDown = this._dropDown;
                if (!dropDown) {
                    this._dropDown = dropDown = this.createDropDown();
                    Object.assign(dropDown, this.dropDownOptions);
                }
                return dropDown;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当被子类重写时负责创建下拉菜单。
         * @return 返回下拉菜单。
         */
        Picker.prototype.createDropDown = function () {
            var _this = this;
            var dropDown = new popup_1.Popup();
            dropDown.elem = this.menu.elem;
            dropDown.target = this.input;
            dropDown.pinTarget = this.elem;
            dropDown.align = "bottomLeft";
            dropDown.event = "focusin";
            dropDown.animation = "scaleY";
            dropDown.onShow = function () { _this.handleDropDownShow(); };
            dropDown.onHide = function () { _this.handleDropDownHide(); };
            return dropDown;
        };
        Picker.prototype.init = function () {
            _super.prototype.init.call(this);
            // 初始化下拉效果。
            this.dropDown.enable();
            // 初始化按钮。
            dom.on(this.button, "click", this.handleButtonClick, this);
            dom.on(this.input, "input", this.handleInput, this);
        };
        /**
         * 处理下拉菜单显示事件。
         */
        Picker.prototype.handleDropDownShow = function () {
            if (this.disabled || this.readOnly) {
                this.dropDown.hide();
                return;
            }
            this.updateMenu();
            if (this.resizeMode !== "fitDropDown") {
                var elemWidth = dom.getRect(this.elem).width;
                if (this.resizeMode === "fitInput" || dom.getRect(this.dropDown.elem).width < elemWidth) {
                    dom.setRect(this.dropDown.elem, { width: elemWidth });
                }
            }
            this.onDropDownShow && this.onDropDownShow(this);
        };
        /**
         * 处理按钮点击事件。
         */
        Picker.prototype.handleButtonClick = function () {
            this.input.select();
        };
        /**
         * 处理下拉菜单隐藏事件。
         */
        Picker.prototype.handleDropDownHide = function () {
            this.onDropDownHide && this.onDropDownHide(this);
        };
        /**
         * 处理输入事件。
         */
        Picker.prototype.handleInput = function () {
            if (!this.dropDown.hidden) {
                this.updateMenu();
            }
        };
        __decorate([
            control_1.bind(".x-button")
        ], Picker.prototype, "button", void 0);
        __decorate([
            control_1.bind(".x-button .x-icon", "innerHTML")
        ], Picker.prototype, "icon", void 0);
        return Picker;
    }(textBox_1.default));
    exports.default = Picker;
    Picker.prototype.resizeMode = "auto";
});
//# sourceMappingURL=picker.js.map