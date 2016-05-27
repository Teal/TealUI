
/**
 * 表示一个委托。
 * @class
 */
function Delegate() {
    var delegate = function() {
        for (var i = 0; i < arguments.callee.handlers.length; i++) {
            arguments.callee.handlers[i].apply(this, arguments);
        }
    };
    for (var key in Delegate.prototype) {
        delegate[key] = Delegate.prototype[key];
    }
    delegate.handlers = [];
    delegate.handlers.push.apply(delegate.handlers, arguments);
    return delegate;
}

/**
 * 增加一个委托函数。
 * @param {Function} fn 函数。
 * @returns this
 * @example new Delegate().add(function(){})
 */
Delegate.prototype.add = function (fn) {
    typeof console === "object" && console.assert(fn instanceof Function, "delegate.add(fn: 必须是函数)");
    this.handlers.push(fn);
    return this;
};

/**
 * 删除一个函数。
 * @param {Function} fn 函数。
 * @returns {Delegate} this。
 * @example new Delegate().remove(function(){})
 */
Delegate.prototype.remove = function (fn) {
    this.handlers.indexOf(fn) >= 0 && this.handlers.splice(this.handlers.indexOf(fn), 1);
    return this;
};

/**
 * 删除所有函数。
 * @returns {Delegate} this。
 * @example new Delegate().clear()
 */
Delegate.prototype.clear = function () {
    this.handlers.length = 0;
    return this;
};
