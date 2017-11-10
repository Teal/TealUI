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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "web/dom", "ui/control", "ui/checkBox", "ui/input", "web/scroll", "./form.scss"], function (require, exports, dom, control_1, checkBox_1, input_1, scroll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个表单。
     */
    var Form = /** @class */ (function (_super) {
        __extends(Form, _super);
        function Form() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Form.prototype.render = function () {
            return control_1.VNode.create("form", { class: "x-form" });
        };
        Object.defineProperty(Form.prototype, "willValidate", {
            /**
             * 判断当前表单是否需要验证。
             */
            get: function () {
                return !this.noValidate;
            },
            enumerable: true,
            configurable: true
        });
        Form.prototype.init = function () {
            dom.on(this.elem, "submit", this.handleSubmit, this);
            dom.on(this.elem, "reset", this.handleReset, this);
        };
        /**
         * 处理表单提交事件。
         */
        Form.prototype.handleSubmit = function (e) {
            var _this = this;
            if (!this.action) {
                e.preventDefault();
            }
            if (this.willValidate) {
                var r = this.reportValidity();
                if (r instanceof Promise) {
                    // 立即终止当前表单提交。
                    // 等待验证成功后重新提交。
                    e.preventDefault();
                    r.then(function (r) {
                        if (!r.valid) {
                            return;
                        }
                        var noValidate = _this.noValidate;
                        _this.noValidate = true;
                        try {
                            _this.submit();
                        }
                        finally {
                            _this.noValidate = noValidate;
                        }
                    });
                    return;
                }
                if (!r.valid) {
                    e.preventDefault();
                    return;
                }
            }
            // 异步提交。
            if (this.async) {
                e.preventDefault();
                // TODO: 异步提交。
                throw ("异步提交功能正在开发,请不要使用");
            }
            else {
                this.onSubmit && this.onSubmit(e);
            }
        };
        /**
         * 处理表单重置事件。
         */
        Form.prototype.handleReset = function (e) {
            e.preventDefault();
            this.getInputs(false, true).forEach(function (input) { return input.reset(); });
        };
        Object.defineProperty(Form.prototype, "value", {
            /**
             * 最终提交的数据。
             */
            get: function () {
                return this.getValue({ hidden: true });
            },
            set: function (value) {
                this.data = __assign({}, value);
                for (var _i = 0, _a = this.inputs; _i < _a.length; _i++) {
                    var input = _a[_i];
                    if (input.name in value) {
                        delete this.data[input.name];
                        if (input instanceof checkBox_1.default) {
                            input.value = value[input.name] === input.value || Array.isArray(value[input.name]) && value[input.name].indexOf(input.value) >= 0;
                        }
                        else {
                            input.value = value[input.name];
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Form.prototype.getValue = function (_a) {
            var _b = _a.hidden, hidden = _b === void 0 ? false : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
            var r = __assign({}, this.data);
            for (var _i = 0, _d = this.inputs; _i < _d.length; _i++) {
                var input = _d[_i];
                if (input.name) {
                    if (disabled == false && input.disabled) {
                        continue;
                    }
                    if (hidden == false && input.hidden) {
                        continue;
                    }
                    if (input instanceof checkBox_1.default) {
                        if (input.value) {
                            if (Array.isArray(r[input.name])) {
                                r[input.name].push(input.key);
                            }
                            else if (input.name in r) {
                                r[input.name] = [r[input.name], input.key];
                            }
                            else {
                                r[input.name] = input.key;
                            }
                        }
                    }
                    else {
                        r[input.name] = input.value;
                    }
                }
            }
            return r;
        };
        /**
         * 获取表单内所有输入域。
         * @param disabled 是否包含禁用的项。
         * @param hidden 是否包含隐藏的项。
         * @return 返回输入域列表。
         */
        Form.prototype.getInputs = function (disabled, hidden) {
            if (disabled === void 0) { disabled = false; }
            if (hidden === void 0) { hidden = false; }
            var r = [];
            next: for (var _i = 0, _a = this.query("*"); _i < _a.length; _i++) {
                var ctrl = _a[_i];
                if (!(ctrl instanceof input_1.default) || !disabled && ctrl.disabled || r.indexOf(ctrl) >= 0) {
                    continue;
                }
                if (!hidden && !ctrl.elem.offsetHeight) {
                    for (var p = ctrl.elem; p; p = p.parentNode) {
                        if (dom.isHidden(p)) {
                            continue next;
                        }
                    }
                }
                r.push(ctrl);
            }
            return r;
        };
        Object.defineProperty(Form.prototype, "inputs", {
            /**
             * 当前表单内的所有输入域。
             */
            get: function () {
                return this.getInputs(true, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Form.prototype, "disabled", {
            /**
             * 是否禁用。禁用后数据不会被提交到服务端。
             */
            get: function () {
                return this.getInputs(true, true).every(function (input) { return input.disabled; });
            },
            set: function (value) {
                this.getInputs(true, true).forEach(function (input) {
                    input.disabled = value;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Form.prototype, "readOnly", {
            /**
             * 是否只读。
             */
            get: function () {
                return this.getInputs(true, true).every(function (input) { return input.readOnly; });
            },
            set: function (value) {
                this.getInputs(true, true).forEach(function (input) {
                    input.readOnly = value;
                });
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 提交当前表单。
         */
        Form.prototype.submit = function () {
            this.elem.submit();
        };
        /**
         * 重置当前表单。
         */
        Form.prototype.reset = function () {
            this.elem.reset();
        };
        /**
         * 验证当前表单内的所有输入域。
         * @return 返回验证后的出错的字段列表。如果返回空数组说明验证成功。如果正在执行异步验证则返回一个确认对象。
         */
        Form.prototype.checkValidity = function () {
            return this._checkValidity();
        };
        /**
         * 向用户报告验证结果。
         */
        Form.prototype.reportValidity = function () {
            return this._checkValidity(true);
        };
        Form.prototype._checkValidity = function (report) {
            var r = {
                valid: true,
                inputs: [],
                results: []
            };
            var promises = [];
            var firstError;
            var _loop_1 = function (input) {
                if (input.hidden) {
                    return "continue";
                }
                if (!input.willValidate) {
                    return "continue";
                }
                var inputResult = report ? input.reportValidity() : input.checkValidity();
                if (inputResult instanceof Promise) {
                    promises.push(inputResult.then(function (inputResult) {
                        if (!inputResult.valid) {
                            r.valid = false;
                        }
                        r.inputs.push(input);
                        r.results.push(inputResult);
                    }));
                }
                else {
                    if (!inputResult.valid) {
                        r.valid = false;
                        firstError = firstError || input;
                    }
                    r.inputs.push(input);
                    r.results.push(inputResult);
                }
            };
            for (var _i = 0, _a = this.inputs; _i < _a.length; _i++) {
                var input = _a[_i];
                _loop_1(input);
            }
            if (this.onValidate) {
                var newResult = this.onValidate(r);
                if (newResult instanceof Promise) {
                    promises.push(newResult.then(function (newResult) {
                        if (newResult === false) {
                            r.valid = newResult;
                        }
                    }));
                }
                else if (newResult === false) {
                    r.valid = newResult;
                }
            }
            if (promises.length) {
                return Promise.all(promises).then(function () { return r; });
            }
            if (report && firstError) {
                scroll_1.scrollIntoViewIfNeeded(firstError.elem);
            }
            return r;
        };
        __decorate([
            control_1.bind("", "action")
        ], Form.prototype, "action", void 0);
        __decorate([
            control_1.bind("", "method")
        ], Form.prototype, "method", void 0);
        __decorate([
            control_1.bind("", "change")
        ], Form.prototype, "onChange", void 0);
        return Form;
    }(control_1.default));
    exports.default = Form;
});
//# sourceMappingURL=form.js.map