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
define(["require", "exports", "web/dom", "web/movable", "web/scroll"], function (require, exports, dom_1, movable_1, scroll_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 设置指定的元素可拖动。
     * @param elem 要拖动的元素。
     * @param options 拖动的选项。
     * @return 返回一个拖动对象。
     */
    function draggable(elem, options) {
        var r = new Draggable();
        r.proxy = r.elem = elem;
        Object.assign(r, options).enable();
        dom_1.movable(r.proxy);
        return r;
    }
    exports.default = draggable;
    /**
     * 表示一个可拖动对象。
     */
    var Draggable = /** @class */ (function (_super) {
        __extends(Draggable, _super);
        function Draggable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 触发拖动开始事件。
         * @param e 事件对象。
         * @return 如果返回 false 则忽略本次拖动。
         */
        Draggable.prototype.moveStart = function (e) {
            if (this.onDragStart && this.onDragStart(e, this) === false) {
                return false;
            }
            var offset = dom_1.getOffset(this.proxy);
            this.endClientX = this.startClientX = offset.x;
            this.endClientY = this.startClientY = offset.y;
            return true;
        };
        /**
         * 触发拖动移动事件。
         * @param e 事件对象。
         */
        Draggable.prototype.move = function (e) {
            this.endClientX = this.startClientX + this.offsetX;
            this.endClientY = this.startClientY + this.offsetY;
            if (this.onDragMove && this.onDragMove(e, this) === false) {
                return false;
            }
            this.proxy.style.top = this.endClientY + "px";
            this.proxy.style.left = this.endClientX + "px";
        };
        /**
         * 触发拖动结束事件。
         * @param e 事件对象。
         */
        Draggable.prototype.moveEnd = function (e) {
            this.onDragEnd && this.onDragEnd(e, this);
        };
        /**
         * 自动滚动屏幕。
         * @param scrollable 滚动的容器元素。
         * @param padding 判断是否在区域内的最小距离。
         * @param offset 如果需要滚动则额外偏移的距离。
         */
        Draggable.prototype.autoScroll = function (scrollable, padding, offset) {
            scroll_1.scrollIntoViewIfNeeded(this.proxy, scrollable, 0, padding, offset);
        };
        /**
         * 限制拖动的方向。
         * @param value 要设置的方向。
         */
        Draggable.prototype.direction = function (value) {
            this[value === "vertical" ? "endClientX" : "endClientY"] = this[value === "vertical" ? "startClientX" : "startClientY"];
        };
        /**
         * 限制只能在指定区域内拖动。
         * @param container 限制的区域或元素。
         * @param padding 容器的内边距。
         */
        Draggable.prototype.limit = function (container, padding) {
            if (padding === void 0) { padding = 0; }
            container = container.nodeType ? dom_1.getRect(container) : container;
            this.proxy.style.top = this.endClientY + "px";
            this.proxy.style.left = this.endClientX + "px";
            var currentRect = dom_1.getRect(this.proxy);
            var t;
            if ((t = currentRect.x - container.x - padding) <= 0 || (t = currentRect.x + currentRect.width - container.x - container.width + padding) >= 0) {
                this.endClientX -= t;
            }
            if ((t = currentRect.y - container.y - padding) <= 0 || (t = currentRect.y + currentRect.height - container.y - container.height + padding) >= 0) {
                this.endClientY -= t;
            }
        };
        /**
         * 设置拖动的步长。
         * @param value 拖动的步长。
         */
        Draggable.prototype.step = function (value) {
            this.endClientY = this.startClientY + Math.floor((this.endClientY - this.startClientY + value / 2) / value) * value;
            this.endClientX = this.startClientX + Math.floor((this.endClientX - this.startClientX + value / 2) / value) * value;
        };
        /**
         * 还原位置。
         * @param callback 渐变结束的回调函数。
         * @param duration 渐变的总毫秒数。
         */
        Draggable.prototype.revert = function (callback, duration) {
            var _this = this;
            this.disable();
            dom_1.animate(this.proxy, {
                left: this.startClientX,
                top: this.startClientY,
            }, function () {
                _this.enable();
                callback && callback();
            }, duration);
        };
        /**
         * 使当前元素吸附于目标位置。
         * @param target 吸附的目标区域或元素。
         * @param padding 容器的内边距。
         * @param distance 吸附的最小距离，当距离小于这个值后产生吸附效果。
         * @param position 吸附的位置。
         * @return 如果未吸附成功则返回 0，如果水平吸附成功则返回 1，如果垂直吸附成功则返回 2，如果都吸附成功则返回 3。
         */
        Draggable.prototype.snap = function (target, padding, distance, position) {
            if (padding === void 0) { padding = 0; }
            if (distance === void 0) { distance = 15; }
            if (position === void 0) { position = "both"; }
            target = target.nodeType ? dom_1.getRect(target) : target;
            var inside = position !== "outside";
            var outside = position !== "inside";
            this.proxy.style.top = this.endClientY + "px";
            this.proxy.style.left = this.endClientX + "px";
            var rect = dom_1.getRect(this.proxy);
            var r = 0;
            var deltaX = distance;
            if (inside) {
                deltaX = target.x + padding - rect.x;
                if (Math.abs(deltaX) >= distance) {
                    deltaX = target.x + target.width - padding - rect.x - rect.width;
                }
            }
            if (Math.abs(deltaX) >= distance && outside) {
                deltaX = target.x + padding - rect.x - rect.width;
                if (Math.abs(deltaX) >= distance) {
                    deltaX = target.x + target.width - padding - rect.x;
                }
            }
            if (Math.abs(deltaX) < distance) {
                this.endClientX += deltaX;
                r += 1;
            }
            var deltaY = distance;
            if (inside) {
                deltaY = target.y + padding - rect.y;
                if (Math.abs(deltaY) >= distance) {
                    deltaY = target.y + target.height - padding - rect.y - rect.height;
                }
            }
            if (Math.abs(deltaY) >= distance && outside) {
                deltaY = target.y + padding - rect.y - rect.height;
                if (Math.abs(deltaY) >= distance) {
                    deltaY = target.y + target.height - padding - rect.y;
                }
            }
            if (Math.abs(deltaY) < distance) {
                this.endClientY += deltaY;
                r += 2;
            }
            return r;
        };
        return Draggable;
    }(movable_1.Movable));
    exports.Draggable = Draggable;
    Draggable.prototype.delay = 500;
});
//# sourceMappingURL=draggable.js.map