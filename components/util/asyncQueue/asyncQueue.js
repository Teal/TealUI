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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个异步任务队列。
     */
    var AsyncQueue = /** @class */ (function (_super) {
        __extends(AsyncQueue, _super);
        function AsyncQueue() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 被挂起的次数。
             */
            _this._suspendCount = 0;
            return _this;
        }
        /**
         * 添加一个任务函数。
         * @param callback 要添加的任务函数。
         * @param link 如果当前队列正在等待其它异步任务函数，使用的处理方式，可以是以下值之一：
         * - wait：等待之前所有异步任务都完成后再执行当前任务。
         * - abort：终止正在执行和其它正在等待的任务并立即执行当前任务。
         * - replace：终止正在执行的异步任务并立即执行当前任务，然后继续执行其它正在等待的异步任务。
         * - insert：等待正在执行的异步任务完成后执行当前任务，然后继续执行其它正在等待的异步任务。
         * - cancel：取消当前任务。
         */
        AsyncQueue.prototype.then = function (callback, link) {
            if (link === void 0) { link = "wait"; }
            if (this._suspendCount && link !== "wait") {
                switch (link) {
                    case "abort":
                        this[0] = callback;
                        this.length = 1;
                        this.skip();
                        break;
                    case "insert":
                        this.splice(1, 0, callback);
                        break;
                    case "replace":
                        this.splice(1, 0, callback);
                        this.skip();
                        break;
                }
            }
            else {
                this.push(callback);
                this._progress();
            }
        };
        /**
         * 终止当前正在执行的异步任务并执行其它正在等待的任务。
         */
        AsyncQueue.prototype.skip = function () {
            if (this._abortable) {
                this._abortable.abort();
            }
            else {
                this.resume();
            }
        };
        /**
         * 挂起当前队列。所有后续任务都将开始等待。
         * @param abortable 引发挂起的对象。其提供一个 `abort()` 函数可立即终止执行。
         */
        AsyncQueue.prototype.suspend = function (abortable) {
            this._suspendCount++;
            if (abortable) {
                this._abortable = abortable;
            }
        };
        /**
         * 通知当前异步任务已经完成，并继续执行下一个任务。
         * @param data 传递给下个异步任务的数据。
         */
        AsyncQueue.prototype.resume = function (data) {
            this._suspendCount--;
            if (data !== undefined) {
                this._data = data;
            }
            this._progress();
        };
        Object.defineProperty(AsyncQueue.prototype, "suspended", {
            /**
             * 判断当前队列是否已被阻止。
             */
            get: function () { return !!this._suspendCount; },
            enumerable: true,
            configurable: true
        });
        /**
         * 执行队首的异步任务。
         */
        AsyncQueue.prototype._progress = function () {
            while (this.length && !this._suspendCount) {
                this._abortable = undefined;
                this.shift()(this._data);
            }
        };
        return AsyncQueue;
    }(Array));
    exports.default = AsyncQueue;
});
//# sourceMappingURL=asyncQueue.js.map