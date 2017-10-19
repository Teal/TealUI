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
define(["require", "exports", "web/dom", "ui/dialog", "typo/util", "ui/textBox/textBox.scss", "ui/button/button.scss", "./messageBox.scss"], function (require, exports, dom, dialog_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个消息框。
     */
    var MessageBox = /** @class */ (function (_super) {
        __extends(MessageBox, _super);
        function MessageBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 当点击关闭按钮后执行。
         */
        MessageBox.prototype.handleCloseClick = function () {
            this.cancel();
        };
        /**
         * 点击确定按钮。
         */
        MessageBox.prototype.ok = function () {
            if (!this.onOk || this.onOk() !== false) {
                this.close();
            }
        };
        /**
         * 点击取消按钮。
         */
        MessageBox.prototype.cancel = function () {
            if (!this.onCancel || this.onCancel() !== false) {
                this.close();
            }
        };
        Object.defineProperty(MessageBox.prototype, "icon", {
            /**
             * 图标。
             */
            set: function (value) {
                var icon = dom.prev(this.body, ".x-panel-icon");
                if (value) {
                    (icon || (icon = dom.before(this.body, "<span/>"))).className = "x-icon x-panel-icon x-panel-icon-" + value;
                }
                else {
                    dom.remove(icon);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageBox.prototype, "buttons", {
            /**
             * 按钮。
             */
            set: function (value) {
                var buttons = dom.next(this.body, ".x-panel-buttons");
                if (value === null) {
                    dom.remove(buttons);
                }
                else {
                    if (buttons) {
                        buttons.innerHTML = "";
                    }
                    else {
                        buttons = dom.append(dom.find(this.elem, ".x-panel"), "<div class=\"x-panel-buttons\"></div>");
                    }
                    for (var key in value) {
                        var click = value[key];
                        var button = dom.append(buttons, "<button class=\"x-button\"></button>");
                        dom.setText(button, key);
                        if (click === true) {
                            dom.addClass(button, "x-button-primary");
                        }
                        dom.on(button, "click", click === true ? this.ok : click === false ? this.cancel : click, this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageBox.prototype, "primaryButton", {
            /**
             * 主按钮。
             */
            set: function (value) {
                var old = dom.find(this.elem, ".x-dialog-buttons > .x-button-primary");
                if (old) {
                    dom.removeClass(old, "x-button-primary");
                }
                var btn = dom.find(this.elem, ".x-dialog-buttons > .x-button:nth-child(" + (value + 1) + ")");
                if (btn) {
                    dom.addClass(btn, "x-button-primary");
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 显示一个消息框。
         * @param content 消息框的内容。
         * @param title 消息框的标题。
         * @param buttons 消息框的按钮。
         * @param icon 消息框的图标。
         * @param onOk 点击确定事件。
         * @param onCancel 点击取消事件。
         */
        MessageBox.show = function (content, title, buttons, icon, onOk, onCancel) {
            if (title === void 0) { title = "提示"; }
            if (buttons === void 0) { buttons = { 确定: true }; }
            var r = new MessageBox();
            r.content = content;
            r.title = title;
            r.draggable = true;
            r.buttons = buttons;
            r.icon = icon;
            r.onOk = onOk;
            r.onCancel = onCancel;
            r.show();
            return r;
        };
        /**
         * 显示一个警告框。
         * @param content 消息框的内容。
         * @param title 消息框的标题。
         * @param onOk 点击确定事件。
         */
        MessageBox.alert = function (content, title, onOk) {
            if (title === void 0) { title = "警告"; }
            return MessageBox.show(content, title, undefined, "warning", onOk, onOk);
        };
        /**
         * 显示一个确认框。
         * @param content 消息框的内容。
         * @param title 消息框的标题。
         * @param onOk 点击确定事件。
         * @param onCancel 点击取消事件。
         */
        MessageBox.confirm = function (content, title, onOk, onCancel) {
            if (title === void 0) { title = "确认"; }
            var r = MessageBox.show(content, title, {
                "确定": true,
                "取消": false
            }, "confirm", onOk, onCancel);
            return r;
        };
        /**
         * 显示一个输入框。
         * @param content 消息框的内容。
         * @param title 消息框的标题。
         * @param onOk 点击确定事件。
         * @param onCancel 点击取消事件。
         */
        MessageBox.prompt = function (content, title, onOk, onCancel) {
            if (title === void 0) { title = "请输入"; }
            var r = MessageBox.show("<input type=\"text\" class=\"x-textbox x-block\">", title, {
                "确定": true,
                "取消": false
            }, undefined, function () {
                onOk && onOk.call(r, r.find(".x-textbox").value);
            }, onCancel);
            r.find(".x-textbox").value = content;
            return r;
        };
        return MessageBox;
    }(dialog_1.default));
    exports.default = MessageBox;
});
//# sourceMappingURL=messageBox.js.map