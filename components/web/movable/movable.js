define(["require", "exports", "web/dom"], function (require, exports, dom) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 创建一个可移动对象。
     * @param elem 要移动的元素。
     * @param options 移动的选项。
     * @return 返回一个移动对象。
     */
    function movable(elem, options) {
        var r = new Movable();
        r.elem = elem;
        Object.assign(r, options).enable();
        return r;
    }
    exports.default = movable;
    /**
     * 表示一个可移动的对象。
     */
    var Movable = /** @class */ (function () {
        function Movable() {
        }
        /**
         * 判断是否取消指定事件引发的移动效果。
         * @param e 事件对象。
         * @return 如果返回 true 则取消移动，否则允许开始移动。
         * @desc 默认地，如果是点击输入域则取消移动。
         */
        Movable.prototype.cancel = function (e) {
            return e.target !== this.elem && /^(?:INPUT|TEXTAREA|BUTTON|SELECT|OPTION)/i.test(e.target.tagName);
        };
        /**
         * 启用移动效果。
         */
        Movable.prototype.enable = function () {
            this.disable();
            dom.on(this.elem, "pointerdown", this.handlePointerDown, this, { passive: false });
        };
        /**
         * 禁用移动效果。
         */
        Movable.prototype.disable = function () {
            dom.off(this.elem, "pointerdown", this.handlePointerDown, this, { passive: false });
        };
        Object.defineProperty(Movable.prototype, "offsetX", {
            /**
             * 获取移动的水平距离（单位：像素）。
             */
            get: function () { return this.endX - this.startX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movable.prototype, "offsetY", {
            /**
             * 获取移动的垂直距离（单位：像素）。
             */
            get: function () { return this.endY - this.startY; },
            enumerable: true,
            configurable: true
        });
        /**
         * 处理指针按下事件。
         * @param e 事件对象。
         */
        Movable.prototype.handlePointerDown = function (e) {
            var _this = this;
            if (!e.button && !this.cancel(e)) {
                // 不允许两个对象同时移动。
                if (Movable.current) {
                    Movable.current.uninit(e);
                }
                // 记录开始位置。
                this.endX = this.startX = e.pageX;
                this.endY = this.startY = e.pageY;
                // 设置下一次移动时初始化移动。
                this._handler = this.init;
                // 延时以避免将简单的点击作为移动处理。
                this._timer = this.delay >= 0 ? setTimeout(function () {
                    _this._timer = 0;
                    _this._handler(e);
                }, this.delay) : -1;
                // 绑定指针移动和松开事件。
                var doc = this.elem.ownerDocument;
                dom.on(doc, "pointerup", this.handlePointerUp, this, { passive: true });
                dom.on(doc, "pointermove", this.handlePointerMove, this, { passive: false });
                // 禁用页面选择。
                e.preventDefault();
            }
        };
        /**
         * 处理指针移动事件。
         * @param e 事件对象。
         */
        Movable.prototype.handlePointerMove = function (e) {
            // 禁用页面滚动。
            e.preventDefault();
            // 更新当前的鼠标位置。
            this.endX = e.pageX;
            this.endY = e.pageY;
            // 调用当前的处理句柄来处理此函数。
            this._handler(e);
        };
        /**
         * 处理指针松开事件。
         * @param e 事件对象。
         */
        Movable.prototype.handlePointerUp = function (e) {
            if (!e.button) {
                this.uninit(e);
            }
        };
        /**
         * 进入移动状态。
         * @param e 事件对象。
         */
        Movable.prototype.init = function (e) {
            // 进入移动状态有两种可能：
            // 1. 鼠标按下并移动，触发 pointermove 事件，此时 _timer 为等待超时的计时器。
            // 2. 鼠标按下且不动时间超过 delay，触发 setTimeout，此时 _timer 为 0。
            if (this._timer) {
                // 如果移动距离过小，则不进入移动状态。
                if (Math.pow(this.offsetX, 2) + Math.pow(this.offsetY, 2) < Math.pow(this.distance, 2)) {
                    return;
                }
                clearTimeout(this._timer);
                this._timer = 0;
            }
            // 更新当前正在移动的对象。
            Movable.current = this;
            // 锁定全局样式。
            this._originalCursor = document.documentElement.style.cursor;
            document.documentElement.style.cursor = dom.getStyle(this.elem, "cursor");
            this._originalPointerEvents = document.body.style.pointerEvents;
            document.body.style.pointerEvents = "none";
            if (document.body.setCapture) {
                document.body.setCapture();
            }
            // 开始移动，并允许强制撤销移动操作。
            if (this.moveStart(e) === false) {
                this.uninit(e);
                return;
            }
            // 移动。
            this._handler = this.move;
            this.move(e);
        };
        /**
         * 退出移动状态。
         * @param e 事件对象。
         */
        Movable.prototype.uninit = function (e) {
            // 解绑全局指针松开事件。
            var doc = this.elem.ownerDocument;
            dom.off(doc, "pointermove", this.handlePointerMove, this, { passive: false });
            dom.off(doc, "pointerup", this.handlePointerUp, this, { passive: true });
            // 清空计时器。
            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = 0;
            }
            if (Movable.current === this) {
                // 恢复全局样式。
                document.documentElement.style.cursor = this._originalCursor;
                document.body.style.pointerEvents = this._originalPointerEvents;
                if (document.body.releaseCapture) {
                    document.body.releaseCapture();
                }
                // 结束移动。
                this.moveEnd(e);
                Movable.current = undefined;
            }
        };
        /**
         * 触发移动开始事件。
         * @param e 事件对象。
         * @return 如果返回 false 则忽略本次移动。
         */
        Movable.prototype.moveStart = function (e) { };
        /**
         * 触发移动事件。
         * @param e 事件对象。
         */
        Movable.prototype.move = function (e) { };
        /**
         * 触发移动结束事件。
         * @param e 事件对象。
         */
        Movable.prototype.moveEnd = function (e) { };
        return Movable;
    }());
    exports.Movable = Movable;
    Movable.prototype.delay = -1;
    Movable.prototype.distance = 3;
});
//# sourceMappingURL=movable.js.map