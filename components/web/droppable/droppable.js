define(["require", "exports", "web/dom", "web/draggable"], function (require, exports, dom_1, draggable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 创建一个可拖放区域。
     * @param elem 要拖放的元素。
     * @param options 拖放的选项。
     * @return 返回一个可拖放区域。
     */
    function droppable(elem, options) {
        var r = new Droppable();
        r.elem = elem;
        Object.assign(r, options).enable();
        return r;
    }
    exports.default = droppable;
    /**
     * 表示一个可拖放区域。
     */
    var Droppable = /** @class */ (function () {
        function Droppable() {
        }
        /**
         * 启用拖放。
         */
        Droppable.prototype.enable = function () {
            var index = Droppable.instances.indexOf(this);
            if (index < 0) {
                Droppable.instances.push(this);
            }
        };
        /**
         * 禁用拖放。
         */
        Droppable.prototype.disable = function () {
            var index = Droppable.instances.indexOf(this);
            if (index >= 0) {
                Droppable.instances.splice(index, 1);
            }
        };
        /**
         * 处理拖动开始事件。
         * @param e 事件对象。
         * @param sender 事件源。
         */
        Droppable.handleDragStart = function (e, sender) {
            Droppable.current = Droppable.instances.filter(function (droppable) { return !droppable.onDragStart || droppable.onDragStart(sender, e, droppable) !== false; });
        };
        /**
         * 处理拖动移动事件。
         * @param e 事件对象。
         * @param sender 事件源。
         */
        Droppable.handleDragMove = function (e, sender) {
            for (var _i = 0, _a = Droppable.current; _i < _a.length; _i++) {
                var droppable_1 = _a[_i];
                if (droppable_1.contains(sender, e)) {
                    if (droppable_1.active) {
                        droppable_1.onDragMove && droppable_1.onDragMove(sender, e, droppable_1);
                    }
                    else if (!droppable_1.onDragEnter || droppable_1.onDragEnter(sender, e, droppable_1) !== false) {
                        droppable_1.active = true;
                    }
                }
                else if (droppable_1.active && (!droppable_1.onDragLeave || droppable_1.onDragLeave(sender, e, droppable_1) !== false)) {
                    droppable_1.active = false;
                }
            }
        };
        /**
         * 处理拖动结束事件。
         * @param e 事件对象。
         * @param sender 事件源。
         */
        Droppable.handleDragEnd = function (e, sender) {
            for (var _i = 0, _a = Droppable.current; _i < _a.length; _i++) {
                var droppable_2 = _a[_i];
                droppable_2.onDragEnd && droppable_2.onDragEnd(sender, e, droppable_2);
                if (droppable_2.active) {
                    droppable_2.active = false;
                    droppable_2.onDrop && droppable_2.onDrop(sender, e, droppable_2);
                }
            }
            Droppable.current = null;
        };
        /**
         * 判断指定的拖动对象是否已进入当前拖放区域。
         * @param draggable 拖动对象。
         * @param e 事件对象。
         * @return 如果在区域内则返回 true，否则返回 false。
         */
        Droppable.prototype.contains = function (draggable, e) {
            var rect = dom_1.getRect(this.elem);
            return rect.x <= draggable.endX && draggable.endX <= rect.x + rect.width && rect.y <= draggable.endY && draggable.endY <= rect.y + rect.height;
        };
        /**
         * 所有拖放区域。
         */
        Droppable.instances = [];
        return Droppable;
    }());
    exports.Droppable = Droppable;
    function connect(dragEvent, dropEvent) {
        var old = draggable_1.Draggable.prototype[dragEvent];
        draggable_1.Draggable.prototype[dragEvent] = function (e) {
            var r = old.call(this, e);
            Droppable[dropEvent](e, this);
            return r;
        };
    }
    connect("moveStart", "handleDragStart");
    connect("move", "handleDragMove");
    connect("moveEnd", "handleDragEnd");
});
//# sourceMappingURL=droppable.js.map