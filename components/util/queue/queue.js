define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个队列。
     */
    var Queue = /** @class */ (function () {
        function Queue() {
        }
        /**
         * 将项添加到队列末尾。
         * @param item 要添加的项。
         */
        Queue.prototype.enqueue = function (item) {
            var last = this._last;
            if (last) {
                this._last = last.next = {
                    value: item,
                    next: last.next
                };
            }
            else {
                var entry = { value: item };
                this._last = entry.next = entry;
            }
        };
        /**
         * 取出队首的项。
         * @return 返回队首的项。如果队列为空则返回 undefined。
         */
        Queue.prototype.dequeue = function () {
            if (!this._last) {
                return;
            }
            var head = this._last.next;
            if (head === this._last) {
                this._last = undefined;
            }
            else {
                this._last.next = head.next;
            }
            return head.value;
        };
        Object.defineProperty(Queue.prototype, "top", {
            /**
             * 获取队列顶部的值。
             */
            get: function () { return this._last ? this._last.next.value : undefined; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Queue.prototype, "empty", {
            /**
             * 判断队列是否为空。
             */
            get: function () { return this._last == undefined; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Queue.prototype, "length", {
            /**
             * 获取队列的长度。
             */
            get: function () {
                if (this._last == undefined) {
                    return 0;
                }
                var count = 1;
                for (var item = this._last.next; item !== this._last; item = item.next) {
                    count++;
                }
                return count;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取队列的迭代器。
         */
        Queue.prototype[typeof Symbol === "undefined" ? "iterator" : Symbol.iterator] = function () {
            var last = this._last;
            var current = last;
            var end = last == undefined;
            return {
                next: function () {
                    if (end) {
                        return { value: undefined, done: true };
                    }
                    current = current.next;
                    if (current === last) {
                        end = true;
                    }
                    return { value: current.value, done: false };
                }
            };
        };
        /**
         * 将队列转为数组。
         */
        Queue.prototype.toArray = function () {
            var r = [];
            if (this._last) {
                for (var item = this._last.next; item !== this._last; item = item.next) {
                    r.push(item.value);
                }
                r.push(this._last.value);
            }
            return r;
        };
        /**
         * 将队列转为字符串。
         */
        Queue.prototype.toString = function () { return this.toArray().toString(); };
        /**
         * 自定义调试时的显示文案。
         */
        Queue.prototype.inspect = function () { return "[" + this.toString() + "]"; };
        return Queue;
    }());
    exports.default = Queue;
});
//# sourceMappingURL=queue.js.map