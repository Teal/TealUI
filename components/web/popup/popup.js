define(["require", "exports", "web/dom", "web/pin"], function (require, exports, dom, pin_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 创建一个弹层。
     * @param elem 弹层的元素。
     * @param options 弹层的选项。
     * @return 返回一个弹层对象。
     */
    function popup(elem, options) {
        var r = new Popup();
        r.elem = elem;
        Object.assign(r, options);
        r.target = r.target || dom.prev(elem);
        r.enable();
        return r;
    }
    exports.default = popup;
    /**
     * 表示一个弹层对象。
     */
    var Popup = /** @class */ (function () {
        function Popup() {
        }
        /**
         * 启用弹层。
         */
        Popup.prototype.enable = function () {
            var _this = this;
            if (!this._handle || this._handle1) {
                var target = this.target;
                var event_1 = this.event;
                switch (event_1) {
                    case "click":
                    case "dblclick":
                    case "auxclick":
                    case "pointerdown":
                    case "pointerup":
                        dom.on(target, event_1, this._handle = function () {
                            _this.toggle();
                        });
                        break;
                    case "pointermove":
                        this.align = "rr-bb";
                        dom.on(target, event_1, this._handle = function (e) {
                            _this.pinTarget = {
                                x: e.pageX,
                                y: e.pageY,
                                width: 16,
                                height: 16
                            };
                            _this.realign();
                        });
                    // fall through
                    case "pointerenter":
                    case "hover":
                        var showTimer_1;
                        var hideTimer_1;
                        var show = this._handle1 = function (e) {
                            if (hideTimer_1) {
                                clearTimeout(hideTimer_1);
                                hideTimer_1 = 0;
                            }
                            else if (!showTimer_1) {
                                showTimer_1 = setTimeout(function () {
                                    showTimer_1 = 0;
                                    _this.show();
                                }, _this.delay);
                            }
                        };
                        var hide = this._handle2 = function (e) {
                            if (showTimer_1) {
                                clearTimeout(showTimer_1);
                                showTimer_1 = 0;
                            }
                            else if (!hideTimer_1) {
                                hideTimer_1 = setTimeout(function () {
                                    hideTimer_1 = 0;
                                    _this.hide();
                                }, _this.delay);
                            }
                        };
                        dom.on(target, "pointerenter", show);
                        dom.on(target, "pointerleave", hide);
                        // pointerenter 事件在指针移到目标元素后不消失。
                        if (event_1 === "pointerenter") {
                            dom.on(this.elem, "pointerenter", show);
                            dom.on(this.elem, "pointerleave", hide);
                        }
                        break;
                    case "focusin":
                        dom.on(target, event_1, this._handle = this.show, this);
                        break;
                    case "focus":
                        dom.on(target, "focus", this._handle1 = this.show, this);
                        dom.on(target, "blur", this._handle2 = this.hide, this);
                        break;
                    case "active":
                        dom.on(target, "pointerdown", this._handle1 = this.show, this);
                        dom.on(document, "pointerup", this._handle2 = this.hide, this);
                        break;
                    case "contextmenu":
                        this.align = "rr-bb";
                        dom.on(target, event_1, this._handle = function (e) {
                            if (e.which === 3) {
                                e.preventDefault();
                                _this.pinTarget = {
                                    x: e.pageX,
                                    y: e.pageY,
                                    width: 1,
                                    height: 1
                                };
                                _this.show();
                            }
                        });
                        break;
                }
            }
        };
        /**
         * 禁用弹层。
         */
        Popup.prototype.disable = function () {
            var target = this.target;
            var event = this.event;
            switch (event) {
                case "click":
                case "dblclick":
                case "auxclick":
                case "pointerdown":
                case "pointerup":
                case "contextmenu":
                    dom.off(target, event, this._handle);
                    this._handle = undefined;
                    break;
                case "pointermove":
                    dom.off(target, event, this._handle);
                    this._handle = undefined;
                // fall through
                case "pointerenter":
                case "hover":
                    dom.off(target, "pointerenter", this._handle1);
                    dom.off(target, "pointerleave", this._handle2);
                    if (event === "pointerenter") {
                        dom.off(this.elem, "pointerenter", this._handle1);
                        dom.off(this.elem, "pointerleave", this._handle2);
                    }
                    this._handle1 = this._handle2 = undefined;
                    break;
                case "focusin":
                    dom.off(target, event, this._handle, this);
                    this._handle = undefined;
                    break;
                case "focus":
                    dom.off(target, "focus", this._handle1, this);
                    dom.off(target, "blur", this._handle2, this);
                    this._handle1 = this._handle2 = undefined;
                    break;
                case "active":
                    dom.off(target, "pointerdown", this._handle1, this);
                    dom.off(document, "pointerup", this._handle2, this);
                    this._handle1 = this._handle2 = undefined;
                    break;
            }
        };
        Object.defineProperty(Popup.prototype, "hidden", {
            /**
             * 判断当前元素是否已隐藏。
             */
            get: function () { return dom.isHidden(this.elem); },
            enumerable: true,
            configurable: true
        });
        /**
         * 显示当前浮层。
         */
        Popup.prototype.show = function () {
            var _this = this;
            var toggle = this._toggle !== undefined ? this._toggle : !this.hidden;
            if (toggle !== true) {
                this._toggle = true;
                this.autoHide && dom.on(document, "pointerdown", this.handleDocumentPointerDown, this);
                this.autoScroll && dom.on(document, "scroll", this.handleDocumentScroll, this);
                this.onShow && this.onShow(this);
                if (this._toggle === true) {
                    dom.show(this.elem);
                    this.realign();
                    dom.show(this.elem, this.animation, function () {
                        _this._toggle = undefined;
                    }, this.duration, this.timingFunction, this.target);
                }
            }
            else if (this._toggle === undefined) {
                this.realign();
            }
        };
        /**
         * 隐藏当前浮层。
         */
        Popup.prototype.hide = function () {
            var _this = this;
            var toggle = this._toggle !== undefined ? this._toggle : !this.hidden;
            if (toggle !== false) {
                this._toggle = false;
                this.autoHide && dom.off(document, "pointerdown", this.handleDocumentPointerDown, this);
                this.autoScroll && dom.off(document, "scroll", this.handleDocumentScroll, this);
                this.onHide && this.onHide(this);
                if (this._toggle === false) {
                    dom.hide(this.elem, this.hideAnimation || this.animation, function () {
                        _this._toggle = undefined;
                    }, this.hideDuration != undefined ? this.hideDuration : this.duration, this.hideTimingFunction || this.timingFunction, this.target);
                }
            }
        };
        /**
         * 切换显示或隐藏当前浮层。
         * @param value 如果为 true 则强制显示。如果为 false 则强制隐藏。
         */
        Popup.prototype.toggle = function (value) {
            if (value === void 0) { value = this.hidden; }
            value ? this.show() : this.hide();
        };
        /**
         * 处理文档指针按下事件。
         * @param e 事件参数。
         */
        Popup.prototype.handleDocumentPointerDown = function (e) {
            var target = e.target;
            if (!dom.contains(this.elem, target) && !dom.contains(this.target, target)) {
                this.hide();
            }
        };
        /**
         * 处理文档滚动事件。
         * @param e 事件参数。
         */
        Popup.prototype.handleDocumentScroll = function (e) {
            this.realign();
        };
        /**
         * 重新对齐浮层的位置。
         * @return 如果已重新定位则返回定位的结果。
         */
        Popup.prototype.realign = function () {
            if (this.align && !this.hidden) {
                var pinResult = pin_1.default(this.elem, this.pinTarget || this.target, this.align, this.margin, this.container === undefined ? this.target.ownerDocument : this.container, this.containerPadding, this.offset, this.resize);
                this.onAlign && this.onAlign(pinResult, this);
                return pinResult;
            }
        };
        return Popup;
    }());
    exports.Popup = Popup;
    Popup.prototype.event = "click";
    Popup.prototype.delay = 100;
    Popup.prototype.animation = "opacity";
    Popup.prototype.align = "bottomLeft";
    Popup.prototype.autoHide = Popup.prototype.autoScroll = true;
});
//# sourceMappingURL=popup.js.map