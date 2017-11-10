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
define(["require", "exports", "web/dom", "ui/control", "web/status", "ui/toolTip"], function (require, exports, dom, control_1, status_1, toolTip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个输入控件。
     */
    var Input = /** @class */ (function (_super) {
        __extends(Input, _super);
        function Input() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Input.prototype.render = function () {
            return control_1.VNode.create("input", { type: "hidden" });
        };
        Object.defineProperty(Input.prototype, "input", {
            /**
             * 内部关联的输入框元素。
             */
            get: function () {
                return (dom.find(this.elem, "input,select,textarea") || this.elem);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "value", {
            /**
             * 值。
             */
            get: function () { return this.input.value; },
            set: function (value) { this.input.value = value == undefined ? null : value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "defaultValue", {
            /**
             * 默认值。
             */
            get: function () { return this.input.defaultValue; },
            set: function (value) { this.input.defaultValue = value == undefined ? null : value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "onEnter", {
            /**
             * 回车事件。
             */
            get: function () {
                return this._onEnter;
            },
            set: function (value) {
                var _this = this;
                this._onEnter = value;
                if (value && !this._onEnterProxy) {
                    dom.on(this.input, "keyup", this._onEnterProxy = function (e) {
                        if (e.keyCode === 10 || e.keyCode === 13) {
                            value.call(_this, e, _this);
                        }
                    });
                }
                else if (this._onEnterProxy && !value) {
                    dom.off(this.input, "keyup", this._onEnterProxy);
                    this._onEnterProxy = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "status", {
            /**
             * 控件状态。
             */
            get: function () {
                return status_1.getStatus(this.input, this.statusClassPrefix);
            },
            set: function (value) {
                status_1.setStatus(this.input, this.statusClassPrefix, this.hideSuccess && value === "success" ? null : value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 判断输入域样式是否被隐藏。
         * @return 如果控件或其父元素被隐藏则返回 true，否则返回 false。
         */
        Input.prototype.isHidden = function () {
            if (!this.elem.offsetHeight) {
                for (var p = this.elem; p; p = p.parentNode) {
                    if (dom.isHidden(p)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Object.defineProperty(Input.prototype, "willValidate", {
            /**
             * 判断当前输入域是否需要验证。
             */
            get: function () {
                if (this.noValidate || this.readOnly || this.disabled || this.isHidden()) {
                    return false;
                }
                if (this.onValidate || this.required || this.maxLength >= 0 || this.minLength >= 0 || this.max != null || this.min != null || this.pattern || this.validate !== Input.prototype.validate) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Input.prototype.init = function () {
            if (this.validateEvent) {
                dom.on(this.input, this.validateEvent, this.handleValidateEvent, this);
            }
        };
        /**
         * 处理验证事件。
         */
        Input.prototype.handleValidateEvent = function () {
            var _this = this;
            if (this.validateEvent) {
                var delay = this.status === "error" ? this.revalidateDelay : this.validateDelay;
                if (delay) {
                    if (this._validateTimer)
                        clearTimeout(this._validateTimer);
                    this._validateTimer = setTimeout(function () {
                        delete _this._validateTimer;
                        _this.reportValidity();
                    }, delay);
                }
                else {
                    this.reportValidity();
                }
            }
        };
        /**
         * 验证当前输入域。
         * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
         */
        Input.prototype.checkValidity = function () {
            var _this = this;
            // 测试是否已填数据。
            var value = this.value;
            if (value == null || value.length === 0 && (typeof value === "string" || Array.isArray(value))) {
                if (this.required) {
                    return { valid: false, status: "error", message: this.requiredMessage };
                }
                return { valid: true, status: null };
            }
            // 执行内置验证。
            var r = this.normlizeValidityResult(this.validate(value));
            if (r instanceof Promise) {
                return r.then(function (r) {
                    if (!r.valid) {
                        return r;
                    }
                    // 执行自定义验证。
                    if (_this.onValidate) {
                        return _this.normlizeValidityResult(_this.onValidate(value, _this));
                    }
                    // 验证成功。
                    return r;
                });
            }
            if (!r.valid) {
                return r;
            }
            // 执行自定义验证。
            if (this.onValidate) {
                return this.normlizeValidityResult(this.onValidate(value, this));
            }
            // 验证成功。
            return r;
        };
        /**
         * 当被子类重写时负责验证指定的值。
         * @param value 要验证的值。
         * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
         */
        Input.prototype.validate = function (value) {
            if (this.maxLength >= 0 && value.length > this.maxLength) {
                return this.maxLengthMessage.replace("{bound}", this.maxLength).replace("{delta}", (value.length - this.maxLength));
            }
            if (this.minLength >= 0 && value.length < this.minLength) {
                return this.minLengthMessage.replace("{bound}", this.minLength).replace("{delta}", (this.minLength - value.length));
            }
            if (this.max != null && value > this.max) {
                return this.maxMessage.replace("{bound}", this.max);
            }
            if (this.min != null && value < this.min) {
                return this.minMessage.replace("{bound}", this.min);
            }
            if (this.pattern && !this.pattern.test(value)) {
                return this.patternMessage.replace("{bound}", this.pattern);
            }
            return "";
        };
        /**
         * 规范化验证结果对象。
         * @param r 用户返回的验证结果。
         * @param 返回已格式化的验证结果。
         */
        Input.prototype.normlizeValidityResult = function (r) {
            var _this = this;
            if (r instanceof Promise) {
                return r.then(function (r) { return _this.normlizeValidityResult(r); });
            }
            if (typeof r === "boolean") {
                r = {
                    valid: r,
                    message: r ? null : this.validateErrorMessage
                };
            }
            else if (typeof r === "string") {
                r = {
                    valid: !r,
                    message: r,
                };
            }
            if (r.valid == undefined) {
                r.valid = !r.status || r.status === "success";
            }
            if (r.status === undefined) {
                r.status = r.valid ? "success" : "error";
            }
            if (r.prefix === undefined) {
                r.prefix = r.status === "success" ? this.validateSuccessMessagePrefix : r.status === "error" ? this.validateErrorMessagePrefix : r.status === "warning" ? this.validateWarningMessagePrefix : r.status === "info" ? this.validateInfoMessagePrefix : null;
            }
            return r;
        };
        /**
         * 向用户报告验证结果。
         * @return 返回验证结果。如果正在执行异步验证则返回一个确认对象。
         */
        Input.prototype.reportValidity = function () {
            var _this = this;
            var r = this.willValidate ? this.checkValidity() : { valid: true, status: null };
            if (r instanceof Promise) {
                if (!this._validatePromise) {
                    this.setCustomValidity({ valid: false, status: "warning", message: this.validateStartMessage, prefix: this.validateStartMessagePrefix });
                }
                var promise_1 = this._validatePromise = r.then(function (r) {
                    if (_this._validatePromise === promise_1) {
                        delete _this._validatePromise;
                        _this.setCustomValidity(r);
                    }
                    return r;
                }, function (reason) {
                    var r = { valid: false, status: "error", message: _this.validateErrorMessage + " " + reason };
                    if (_this._validatePromise === promise_1) {
                        delete _this._validatePromise;
                        _this.setCustomValidity(r);
                    }
                    return r;
                });
                return promise_1;
            }
            this.setCustomValidity(r);
            return r;
        };
        /**
         * 设置自定义的验证消息。
         * @param validityResult 要报告的验证结果。
         */
        Input.prototype.setCustomValidity = function (validityResult) {
            // 统一验证结果数据格式。
            validityResult = this.normlizeValidityResult(validityResult);
            // 更新状态。
            this.status = validityResult.status;
            // 自定义错误报告。
            if (this.onReportValidity && this.onReportValidity(validityResult, this) === false) {
                return;
            }
            // 提示验证信息。
            var tip = dom.next(this.elem, ".x-tip,.x-tipbox");
            if (tip) {
                status_1.setStatus(tip, dom.hasClass(tip, "x-tipbox") ? "x-tipbox-" : "x-tip-", this.status);
                if (validityResult.message || validityResult.prefix) {
                    if (!("__innerHTML__" in tip)) {
                        tip.__innerHTML__ = tip.innerHTML;
                    }
                    tip.textContent = validityResult.message || "";
                    if (validityResult.prefix)
                        dom.prepend(tip, validityResult.prefix);
                }
                else if ("__innerHTML__" in tip) {
                    tip.innerHTML = tip.__innerHTML__;
                    delete tip.__innerHTML__;
                }
            }
            else {
                var validityToolTip = this._validityToolTip;
                if (validityResult.message) {
                    if (!validityToolTip) {
                        this._validityToolTip = validityToolTip = this.createValidityToolTip();
                    }
                    var arrow = dom.first(validityToolTip.elem, ".x-arrow");
                    validityToolTip.elem.textContent = validityResult.message || "";
                    if (validityResult.prefix)
                        dom.prepend(validityToolTip.elem, validityResult.prefix);
                    if (arrow)
                        dom.prepend(validityToolTip.elem, arrow);
                    validityToolTip.show();
                }
                else if (validityToolTip) {
                    validityToolTip.hide();
                }
            }
        };
        /**
         * 当被子类重写时负责创建当前输入框的默认验证提示。
         */
        Input.prototype.createValidityToolTip = function () {
            var _this = this;
            var validityToolTip = new toolTip_1.default();
            validityToolTip.event = "focusin";
            validityToolTip.onShow = function () {
                if (!_this.status || _this.status === "success") {
                    _this._validityToolTip.hide();
                }
            };
            validityToolTip.target = this.elem;
            Object.assign(validityToolTip, this.validityToolTipOptions);
            dom.after(this.elem, validityToolTip.elem);
            return validityToolTip;
        };
        /**
         * 重置当前输入域。
         */
        Input.prototype.reset = function () {
            this.setCustomValidity({ valid: true, status: null });
            this.value = this.defaultValue;
        };
        /**
         * 令当前控件获得焦点。
         */
        Input.prototype.focus = function () {
            this.input.focus();
        };
        /**
         * 令当前控件失去焦点。
         */
        Input.prototype.blur = function () {
            this.input.blur();
        };
        Input.prototype.layout = function (changes) {
            if ((changes & 4 /* prop */) && this.status) {
                this.reportValidity();
            }
        };
        /**
         * 本地化提示文案。
         */
        Input.locale = {
            requiredMessage: "\u8BE5\u5B57\u6BB5\u4E3A\u5FC5\u586B\u7684",
            maxLengthMessage: "\u8BE5\u5B57\u6BB5\u6700\u5927\u957F\u5EA6\u4E3A {bound}\uFF0C\u8D85\u51FA {delta}",
            minLengthMessage: "\u8BE5\u5B57\u6BB5\u6700\u5C11\u957F\u5EA6\u4E3A {bound}\uFF0C\u7F3A\u5C11 {delta}",
            maxMessage: "\u8BE5\u5B57\u6BB5\u6700\u5927\u4E3A {bound}",
            minMessage: "\u8BE5\u5B57\u6BB5\u6700\u5C0F\u4E3A {bound}",
            patternMessage: "\u8BE5\u5B57\u6BB5\u683C\u5F0F\u4E0D\u6B63\u786E",
            validateErrorMessage: "\u8BE5\u5B57\u6BB5\u9A8C\u8BC1\u672A\u901A\u8FC7",
            validateStartMessage: "\u6B63\u5728\u9A8C\u8BC1\u4E2D...",
            validateStartMessagePrefix: "<i class=\"x-icon x-spin\">\u0489</i> ",
            validateInfoMessagePrefix: "<i class=\"x-icon\">\uD83D\uDEC8</i> ",
            validateSuccessMessagePrefix: "<i class=\"x-icon\">\u2713</i> ",
            validateWarningMessagePrefix: "<i class=\"x-icon\">\u26A0</i> ",
            validateErrorMessagePrefix: "<i class=\"x-icon\">&#10071;</i> "
        };
        __decorate([
            control_1.bind("@input", "name")
        ], Input.prototype, "name", void 0);
        __decorate([
            control_1.bind("@input", "type")
        ], Input.prototype, "type", void 0);
        __decorate([
            control_1.bind("@input", "placeholder")
        ], Input.prototype, "placeholder", void 0);
        __decorate([
            control_1.bind("@input", "disabled")
        ], Input.prototype, "disabled", void 0);
        __decorate([
            control_1.bind("@input", "readOnly")
        ], Input.prototype, "readOnly", void 0);
        __decorate([
            control_1.bind("@input", "tabIndex")
        ], Input.prototype, "tabIndex", void 0);
        __decorate([
            control_1.bind("@input", "tabStop")
        ], Input.prototype, "tabStop", void 0);
        __decorate([
            control_1.bind("@input", "onCopy")
        ], Input.prototype, "onCopy", void 0);
        __decorate([
            control_1.bind("@input", "onCut")
        ], Input.prototype, "onCut", void 0);
        __decorate([
            control_1.bind("@input", "onPaste")
        ], Input.prototype, "onPaste", void 0);
        __decorate([
            control_1.bind("@input", "onBeforeCopy")
        ], Input.prototype, "onBeforeCopy", void 0);
        __decorate([
            control_1.bind("@input", "onBeforeCut")
        ], Input.prototype, "onBeforeCut", void 0);
        __decorate([
            control_1.bind("@input", "onBeforePaste")
        ], Input.prototype, "onBeforePaste", void 0);
        __decorate([
            control_1.bind("@input", "onFocus")
        ], Input.prototype, "onFocus", void 0);
        __decorate([
            control_1.bind("@input", "onBlur")
        ], Input.prototype, "onBlur", void 0);
        __decorate([
            control_1.bind("@input", "onFocusIn")
        ], Input.prototype, "onFocusIn", void 0);
        __decorate([
            control_1.bind("@input", "onFocusOut")
        ], Input.prototype, "onFocusOut", void 0);
        __decorate([
            control_1.bind("@input", "onInput")
        ], Input.prototype, "onInput", void 0);
        __decorate([
            control_1.bind("@input", "onChange")
        ], Input.prototype, "onChange", void 0);
        __decorate([
            control_1.bind("@input", "onKeyDown")
        ], Input.prototype, "onKeyDown", void 0);
        __decorate([
            control_1.bind("@input", "onKeyPress")
        ], Input.prototype, "onKeyPress", void 0);
        __decorate([
            control_1.bind("@input", "onKeyUp")
        ], Input.prototype, "onKeyUp", void 0);
        return Input;
    }(control_1.default));
    exports.default = Input;
    for (var key in Input.locale) {
        Input.prototype[key] = Input.locale[key];
    }
    Input.prototype.statusClassPrefix = "x-";
    Input.prototype.validateEvent = "change";
});
//# sourceMappingURL=input.js.map