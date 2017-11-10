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
define(["require", "exports", "web/dom", "web/popup", "ui/control", "typo/arrow", "./popup.scss"], function (require, exports, dom, popup_1, control_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个弹层。
     */
    var Popup = /** @class */ (function (_super) {
        __extends(Popup, _super);
        function Popup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Popup.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-popup", style: "display: none;" });
        };
        Object.defineProperty(Popup.prototype, "target", {
            /**
             * 触发弹层显示的元素。
             */
            get: function () {
                return control_1.data(this).target;
            },
            set: function (value) {
                var old = this.target;
                if (old !== value) {
                    if (old) {
                        popup_1.Popup.prototype.disable.call(this);
                    }
                    control_1.data(this).target = value;
                    if (value) {
                        popup_1.Popup.prototype.enable.call(this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "disabled", {
            /**
             * 是否禁用弹窗效果。
             */
            get: function () {
                return control_1.data(this).disabled;
            },
            set: function (value) {
                control_1.data(this).disabled = value;
                popup_1.Popup.prototype[value ? "disable" : "enable"].call(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Popup.prototype, "arrow", {
            /**
             * 是否显示箭头。
             */
            get: function () {
                return !!dom.first(this.elem, ".x-arrow");
            },
            set: function (value) {
                var arrow = dom.first(this.elem, ".x-arrow");
                if (value) {
                    if (!arrow) {
                        dom.prepend(this.elem, "<span class=\"x-arrow\"/>");
                    }
                }
                else {
                    dom.remove(arrow);
                }
            },
            enumerable: true,
            configurable: true
        });
        Popup.prototype.render = function () {
            return control_1.VNode.create("div", { class: "x-popup", style: "display: none" });
        };
        Popup.prototype.layout = function () {
            var prev = dom.prev(this.elem);
            while (prev && control_1.from(prev) instanceof Popup) {
                prev = dom.prev(prev);
            }
            this.target = prev;
        };
        Object.defineProperty(Popup.prototype, "hidden", {
            get: function () { return dom.isHidden(this.elem); },
            enumerable: true,
            configurable: true
        });
        /**
         * 显示当前弹层。
         */
        Popup.prototype.show = function () {
            var _this = this;
            dom.ready(function () {
                if (!dom.contains(document.body, _this.elem)) {
                    document.body.appendChild(_this.elem);
                }
                popup_1.Popup.prototype.show.call(_this);
            });
        };
        /**
         * 隐藏当前弹层。
         */
        Popup.prototype.hide = function () {
            popup_1.Popup.prototype.hide.call(this);
        };
        /**
         * 切换显示或隐藏当前弹层。
         * @param value 如果为 true 则强制显示。如果为 false 则强制隐藏。
         */
        Popup.prototype.toggle = function (value) {
            popup_1.Popup.prototype.toggle.call(this, value);
        };
        /**
         * 重新对齐弹层的位置。
         */
        Popup.prototype.realign = function () {
            var arrow = dom.first(this.elem, ".x-arrow");
            if (arrow && this.margin == undefined) {
                this.margin = arrow.offsetHeight / 2 + 2;
            }
            var pinResult = popup_1.Popup.prototype.realign.call(this);
            // 根据定位的结果更新箭头。
            if (pinResult && arrow) {
                arrow.className = "x-arrow";
                switch (pinResult.align) {
                    case "lr-tt":
                    case "lr-bb":
                    case "cc-tt":
                    case "cc-bb":
                    case "rl-tt":
                    case "rl-bb":
                        if (!pinResult.transformY) {
                            var arrowSize = arrow.offsetWidth / 2;
                            var arrowPos = pinResult.target.x + pinResult.target.width / 2 - pinResult.x;
                            if (arrowPos >= arrowSize && arrowPos <= pinResult.width - arrowSize) {
                                arrow.className += " x-arrow-" + ((pinResult.align.charAt(4) === "t") !== !!pinResult.rotateY ? "bottom" : "top");
                                arrow.style.left = arrowPos + (this.arrowOffset ? this.arrowOffset < 1 ? pinResult.target.width * this.arrowOffset : this.arrowOffset : 0) + "px";
                            }
                        }
                        break;
                    case "ll-tb":
                    case "ll-cc":
                    case "ll-bt":
                    case "rr-tb":
                    case "rr-cc":
                    case "rr-bt":
                        if (!pinResult.transformX) {
                            var arrowSize = arrow.offsetHeight / 2;
                            var arrowPos = pinResult.target.y + pinResult.target.height / 2 - pinResult.y;
                            if (arrowPos >= arrowSize && arrowPos <= pinResult.height - arrowSize) {
                                arrow.className += " x-arrow-" + ((pinResult.align.charAt(0) === "l") !== !!pinResult.rotateX ? "right" : "left");
                                arrow.style.top = arrowPos + (this.arrowOffset ? this.arrowOffset < 1 ? pinResult.target.height * this.arrowOffset : this.arrowOffset : 0) + "px";
                            }
                        }
                        break;
                }
            }
            return pinResult;
        };
        /**
         * 处理文档指针按下事件。
         * @param e 事件参数。
         */
        Popup.prototype.handleDocumentPointerDown = function (e) {
            popup_1.Popup.prototype.handleDocumentPointerDown.call(this, e);
        };
        /**
         * 处理文档滚动事件。
         * @param e 事件参数。
         */
        Popup.prototype.handleDocumentScroll = function (e) {
            popup_1.Popup.prototype.handleDocumentScroll.call(this, e);
        };
        /**
         * 创建一个弹层。
         * @param elem 要弹出的元素或控件。
         * @param target 触发弹层显示的元素或控件。
         * @param event 触发弹层显示的事件。
         * @param align 显示弹层时使用的动画。如果为 null 则保留默认位置。
         * @param arrow 是否显示箭头。
         * @param animation 显示弹层时使用的动画。
         * @return 返回创建的弹层对象。
         */
        Popup.create = function (elem, target, event, align, arrow, animation) {
            var r = new this();
            r.body.appendChild(elem instanceof control_1.default ? elem.elem : elem);
            if (event)
                r.event = event;
            if (align)
                r.align = align;
            if (arrow)
                r.arrow = arrow;
            if (animation)
                r.animation = animation;
            r.target = target instanceof control_1.default ? target.elem : target;
            return r;
        };
        return Popup;
    }(control_1.default));
    exports.default = Popup;
    Popup.prototype.event = popup_1.Popup.prototype.event;
    Popup.prototype.delay = popup_1.Popup.prototype.delay;
    Popup.prototype.autoHide = popup_1.Popup.prototype.autoHide;
    Popup.prototype.autoScroll = popup_1.Popup.prototype.autoScroll;
    Popup.prototype.animation = popup_1.Popup.prototype.animation;
    Popup.prototype.align = popup_1.Popup.prototype.align;
});
//# sourceMappingURL=popup.js.map