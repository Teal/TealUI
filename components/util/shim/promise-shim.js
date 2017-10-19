/**
 * 表示一个确认对象。
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
Promise = this.Promise || /** @class */ (function () {
    /**
     * 初始化新的确认对象。
     * @param resolver 解析函数。
     */
    function class_1(resolver) {
        var _this = this;
        var resolve = function (value) {
            Promise._fulfill(_this, value, function (value) {
                _this._set(1, value);
            }, reject);
        };
        var reject = function (reason) {
            _this._set(2, reason);
        };
        try {
            resolver(resolve, reject);
        }
        catch (e) {
            reject(e);
        }
    }
    /**
     * 处理一个解析值。
     * @param promise 当前确认对象。
     * @param value 已解析的值。
     * @param resolve 解析完成的回调函数。
     * @param reject 解析失败的回调函数。
     */
    class_1._fulfill = function (promise, value, resolve, reject) {
        var called = false;
        try {
            var then = value && (typeof value === "object" || typeof value === "function") && value.then;
            if (typeof then === "function") {
                if (promise === value) {
                    reject(new TypeError("Chaining cycle detected for promise"));
                }
                else {
                    then.call(value, function (value) {
                        if (!called) {
                            called = true;
                            Promise._fulfill(promise, value, resolve, reject);
                        }
                    }, function (reason) {
                        if (!called) {
                            called = true;
                            return reject(reason);
                        }
                    });
                }
            }
            else {
                resolve(value);
            }
        }
        catch (e) {
            if (!called) {
                called = true;
                reject(e);
            }
        }
    };
    /**
     * 设置状态和数据。
     * @param status 解析的状态。可以是 1 或 2。
     * @param data 解析的数据。
     */
    class_1.prototype._set = function (status, data) {
        var _this = this;
        if (!this._status) {
            setTimeout(function () {
                if (!_this._status) {
                    _this._status = status;
                    var callbacks = _this._data;
                    _this._data = data;
                    if (callbacks) {
                        for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                            var callback = callbacks_1[_i];
                            callback(status, data);
                        }
                    }
                }
            });
        }
    };
    /**
     * 添加确认对象已解析后的回调函数。
     * @param onFulfilled 对象已解析后执行。
     * @param onRejected 对象已阻止后执行。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     */
    class_1.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        var r = new Promise(function (resolve, reject) {
            var end = function (status, data) {
                try {
                    if (status === 2 && typeof onRejected !== "function") {
                        reject(data);
                    }
                    else {
                        Promise._fulfill(r, status === 2 ? onRejected(data) : typeof onFulfilled === "function" ? onFulfilled(data) : data, resolve, reject);
                    }
                }
                catch (e) {
                    return reject(e);
                }
            };
            if (_this._status) {
                setTimeout(end, 0, _this._status, _this._data);
            }
            else {
                _this._data = _this._data || [];
                _this._data.push(end);
            }
        });
        return r;
    };
    /**
     * 添加确认对象已阻止后的回调函数。
     * @param onRejected 对象已阻止后执行。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
     */
    class_1.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    };
    /**
     * 创建一个新确认对象，该对象等待所有确认对象都已确认。
     * @param promises 要等待的所有确认对象。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
     */
    class_1.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var counter = promises.length;
            var resolvedValues = new Array(counter);
            if (counter) {
                var _loop_1 = function (i) {
                    Promise.resolve(promises[i]).then(function (value) {
                        resolvedValues[i] = value;
                        if (--counter === 0) {
                            return resolve(resolvedValues);
                        }
                    }, reject);
                };
                for (var i = 0; i < counter; i++) {
                    _loop_1(i);
                }
            }
            else {
                resolve(resolvedValues);
            }
        });
    };
    /**
     * 创建一个新确认对象，该对象等待所有确认对象任一个已确认。
     * @param promises 要等待的所有确认对象。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
     */
    class_1.race = function (promises) {
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(resolve, reject);
            }
        });
    };
    /**
     * 创建一个已解析的确认对象。
     * @param value 解析的值。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
     */
    class_1.resolve = function (value) {
        return new Promise(function (resolve) {
            resolve(value);
        });
    };
    /**
     * 创建一个已阻止的确认对象。
     * @param value 错误原因。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
     */
    class_1.reject = function (reason) {
        return new Promise(function (resolve, reject) {
            reject(reason);
        });
    };
    return class_1;
}());
// 测试方法：
// 1. 添加以下代码：
// Promise.deferred = Promise.defer = function () {
//     var dfd = {}
//     dfd.promise = new Promise(function (resolve, reject) {
//         dfd.resolve = resolve
//         dfd.reject = reject
//     })
//     return dfd
// }
// try { // CommonJS compliance
//     module.exports = Promise
// } catch (e) { }
// 2. 安装测试包：
// npm install -g promises-aplus-tests
// 3. 执行测试：
// promises-aplus-tests ./promise-shim.js
//# sourceMappingURL=promise-shim.js.map