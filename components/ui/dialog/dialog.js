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
define(["require", "exports", "web/dom", "web/draggable", "ui/control", "typo/icon", "typo/close", "ui/panel", "./dialog.scss"], function (require, exports, dom, draggable_1, control_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个对话框。
     */
    var Dialog = /** @class */ (function (_super) {
        __extends(Dialog, _super);
        function Dialog() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Dialog.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-dialog", style: "display: none" },
                control_1.VNode.create("section", { class: "x-panel" },
                    control_1.VNode.create("header", { class: "x-panel-header" },
                        control_1.VNode.create("button", { class: "x-close x-icon", title: "关闭", "aria-label": "关闭" }, "\u2716"),
                        control_1.VNode.create("h5", null)),
                    control_1.VNode.create("div", { class: "x-panel-body" })));
        };
        Dialog.prototype.init = function () {
            var close = dom.find(this.header, ".x-close");
            if (close) {
                dom.on(close, "click", this.handleCloseClick, this);
            }
            this.draggable = true;
        };
        /**
         * 当点击关闭按钮后执行。
         */
        Dialog.prototype.handleCloseClick = function () {
            this.close();
        };
        /**
         * 显示当前对话框。
         * @param target 显示的目标。
         */
        Dialog.prototype.show = function (target) {
            var _this = this;
            if (target) {
                this.target = target;
            }
            else {
                target = this.target;
            }
            dom.ready(function () {
                if (!dom.contains(document.body, _this.elem)) {
                    document.body.appendChild(_this.elem);
                }
                if (_this.hidden) {
                    dom.show(_this.elem);
                    dom.show(_this.find(".x-panel"), _this.animation, undefined, _this.duration, undefined, target);
                    dom.addClass(document.body, "x-dialog-open");
                }
            });
        };
        /**
         * 关闭当前对话框。
         * @param target 关闭的目标。
         */
        Dialog.prototype.close = function (target) {
            var _this = this;
            if (target) {
                this.target = target;
            }
            else {
                target = this.target;
            }
            if (!this.onBeforeClose || this.onBeforeClose() !== false) {
                this.elem.style.backgroundColor = "transparent";
                dom.hide(this.find(".x-panel"), this.animation, function () {
                    _this.elem.style.backgroundColor = "";
                    dom.removeClass(document.body, "x-dialog-open");
                    _this.renderTo(null);
                    _this.onClose && _this.onClose();
                }, this.duration, undefined, target);
            }
        };
        Object.defineProperty(Dialog.prototype, "draggable", {
            /**
             * 是否可拖动。
             */
            get: function () {
                return !!this._draggable;
            },
            set: function (value) {
                var _this = this;
                dom.toggleClass(this.elem, "x-dialog-draggable", value);
                if (value) {
                    if (this._draggable) {
                        this._draggable.enable();
                    }
                    else {
                        this._draggable = draggable_1.default(this.find(".x-panel-header h5"), {
                            proxy: this.find(".x-panel"),
                            onDragStart: function () {
                                if (!_this._draggable.proxy.style.margin) {
                                    var rect = dom.getRect(_this._draggable.proxy);
                                    _this._draggable.proxy.style.margin = "0";
                                    dom.setRect(_this._draggable.proxy, rect);
                                }
                            }
                        });
                    }
                }
                else if (this._draggable) {
                    this._draggable.disable();
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            control_1.bind(".x-panel-header")
        ], Dialog.prototype, "header", void 0);
        __decorate([
            control_1.bind(".x-panel-header h5", "innerHTML")
        ], Dialog.prototype, "title", void 0);
        __decorate([
            control_1.bind(".x-panel-header .x-close", "hidden")
        ], Dialog.prototype, "hideClose", void 0);
        __decorate([
            control_1.bind(".x-panel-body")
        ], Dialog.prototype, "body", void 0);
        return Dialog;
    }(control_1.default));
    exports.default = Dialog;
    Dialog.prototype.animation = "scale";
});
//# sourceMappingURL=dialog.js.map