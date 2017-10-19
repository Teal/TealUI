define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 表示一个事件触发器。
     */
    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
        }
        /**
         * 添加一个事件。
         * @param eventName 要添加的事件名。
         * @param eventHandler 要添加的事件处理函数。
         * @example
         * var ee = new EventEmitter();
         * ee.on("error", data => console.log(data));    // 绑定 error 事件
         * ee.emit("error", "hello");                    // 触发 error 事件，输出 hello
         */
        EventEmitter.prototype.on = function (eventName, eventHandler) {
            var events = this._events || (this._events = { __proto__: null });
            var eventHandlers = events[eventName];
            if (Array.isArray(eventHandlers)) {
                eventHandlers.push(eventHandler);
            }
            else {
                events[eventName] = eventHandler;
            }
            return this;
        };
        /**
         * 删除一个或多个事件。
         * @param eventName 要删除的事件名。如果不传递此参数，则删除所有事件处理函数。
         * @param eventHandler 要删除的事件处理函数。如果不传递此参数，则删除指定事件的所有监听器。如果同一个监听器被添加多次，则只删除第一个。
         * @example
         * var fn = data => console.log(data);
         * var ee = new EventEmitter();
         * ee.on("error", fn);                       // 绑定 error 事件
         * ee.off("error", fn);                      // 解绑 error 事件
         * ee.emit("error", "hello");                // 触发 error 事件，不输出内容
         */
        EventEmitter.prototype.off = function (eventName, eventHandler) {
            var events = this._events;
            if (events) {
                if (eventName) {
                    var eventHandlers = events[eventName];
                    if (eventHandlers) {
                        if (eventHandler) {
                            if (Array.isArray(eventHandlers)) {
                                var index = eventHandlers.indexOf(eventHandler);
                                if (index >= 0) {
                                    eventHandlers.splice(index, 1);
                                    eventHandler = eventHandlers.length;
                                }
                            }
                            else if (eventHandlers === eventHandler) {
                                eventHandler = undefined;
                            }
                        }
                        if (!eventHandler) {
                            delete events[eventName];
                        }
                    }
                }
                else {
                    delete this._events;
                }
            }
            return this;
        };
        /**
         * 触发一个事件。
         * @param eventName 要触发的事件名。
         * @param eventArgs 传递给监听器的所有参数。
         * @return 如果已执行一个或多个监听器则返回 true，否则返回 false。
         * @example
         * var ee = new EventEmitter();
         * ee.on("error", data => console.log(data));    // 绑定 error 事件
         * ee.emit("error", "hello");                    // 触发 error 事件，输出 hello
         */
        EventEmitter.prototype.emit = function (eventName) {
            var eventArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                eventArgs[_i - 1] = arguments[_i];
            }
            var t = this._events;
            if (t && (t = t[eventName])) {
                if (typeof t === "function") {
                    t.apply(this, eventArgs);
                }
                else {
                    for (var _a = 0, _b = t.slice(0); _a < _b.length; _a++) {
                        var eventHandler = _b[_a];
                        eventHandler.apply(this, eventArgs);
                    }
                }
                return true;
            }
            return false;
        };
        return EventEmitter;
    }());
    exports.default = EventEmitter;
});
//# sourceMappingURL=events.js.map