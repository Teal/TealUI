/**
 * 表示一个确认对象。
 * @since ES6
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
Promise = this.Promise || class {

    /**
     * 状态。0：正在等待。1：已解析。2：已阻止。
     */
    _status;

    /**
     * 存储相关的数据。如果状态为正在等待则为回调函数列表。如果状态为已解析则为返回值，如果为已阻止则为错误原因。
     */
    _data;

    /**
     * 初始化新的确认对象。
     * @param resolver 解析函数。
     */
    constructor(resolver) {
        const resolve = value => {
            Promise._fulfill(this, value, value => {
                this._set(1, value);
            }, reject);
        };
        const reject = reason => {
            this._set(2, reason);
        };
        try {
            resolver(resolve, reject);
        } catch (e) {
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
    static _fulfill(promise, value, resolve, reject) {
        let called = false;
        try {
            const then = value && (typeof value === "object" || typeof value === "function") && value.then;
            if (typeof then === "function") {
                if (promise === value) {
                    reject(new TypeError("Chaining cycle detected for promise"));
                } else {
                    then.call(value, value => {
                        if (!called) {
                            called = true;
                            Promise._fulfill(promise, value, resolve, reject);
                        }
                    }, reason => {
                        if (!called) {
                            called = true;
                            return reject(reason);
                        }
                    });
                }
            } else {
                resolve(value);
            }
        } catch (e) {
            if (!called) {
                called = true;
                reject(e);
            }
        }
    }

    /**
     * 设置状态和数据。
     * @param status 解析的状态。可以是 1 或 2。
     * @param data 解析的数据。
     */
    _set(status, data) {
        if (!this._status) {
            setTimeout(() => {
                if (!this._status) {
                    this._status = status;
                    const callbacks = this._data;
                    this._data = data;
                    if (callbacks) {
                        for (const callback of callbacks) {
                            callback(status, data);
                        }
                    }
                }
            });
        }
    }

    /**
     * 添加确认对象已解析后的回调函数。
     * @param onFulfilled 对象已解析后执行。
     * @param onRejected 对象已阻止后执行。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     */
    then(onFulfilled, onRejected) {
        const r = new Promise((resolve, reject) => {
            const end = (status, data) => {
                try {
                    if (status === 2 && typeof onRejected !== "function") {
                        reject(data);
                    } else {
                        Promise._fulfill(r, status === 2 ? onRejected(data) : typeof onFulfilled === "function" ? onFulfilled(data) : data, resolve, reject);
                    }
                } catch (e) {
                    return reject(e);
                }
            };
            if (this._status) {
                setTimeout(end, 0, this._status, this._data);
            } else {
                this._data = this._data || [];
                this._data.push(end);
            }
        });
        return r;
    }

    /**
     * 添加确认对象已阻止后的回调函数。
     * @param onRejected 对象已阻止后执行。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
     */
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    /**
     * 创建一个新确认对象，该对象等待所有确认对象都已确认。
     * @param promises 要等待的所有确认对象。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
     */
    static all(promises) {
        return new Promise((resolve, reject) => {
            let counter = promises.length;
            const resolvedValues = new Array(counter);
            if (counter) {
                for (let i = 0; i < counter; i++) {
                    Promise.resolve(promises[i]).then(value => {
                        resolvedValues[i] = value
                        if (--counter === 0) {
                            return resolve(resolvedValues);
                        }
                    }, reject);
                }
            } else {
                resolve(resolvedValues);
            }
        })
    }

    /**
     * 创建一个新确认对象，该对象等待所有确认对象任一个已确认。
     * @param promises 要等待的所有确认对象。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
     */
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(resolve, reject);
            }
        });
    }

    /**
     * 创建一个已解析的确认对象。
     * @param value 解析的值。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
     */
    static resolve(value) {
        return new Promise(resolve => {
            resolve(value)
        });
    }

    /**
     * 创建一个已阻止的确认对象。
     * @param value 错误原因。
     * @return 返回新确认对象。
     * @since ES6
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
     */
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

};

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
