define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 空函数。
     */
    function empty() { }
    exports.empty = empty;
    /**
     * 始终返回第一个参数值的函数。
     * @param value 值。
     * @return 返回值。
     */
    function self(value) {
        return value;
    }
    exports.self = self;
    /**
     * 创建一个始终返回指定值的函数。
     * @param value 新函数要返回的值。
     * @return 返回一个新函数，该函数始终返回指定值。
     * @example from(false)() // false
     */
    function from(value) {
        return function () { return value; };
    }
    exports.from = from;
    /**
     * 判断对象是否是函数。
     * @param obj 对象。
     * @return 如果对象是函数则返回 true，否则返回 false。
     * @example isFunction(function () {}) // true
     * @example isFunction(null) // false
     * @example isFunction(new Function()) // true
     */
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    }
    exports.isFunction = isFunction;
    /**
     * 创建一个新函数，调用该函数后会依次调用所有原函数。
     * @param funcs 要调用的所有原函数。
     * @return 返回一个新函数。该函数无返回值。
     * @example concat(function (){}, function (){})()
     */
    function concat() {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        return function () {
            for (var _i = 0, funcs_1 = funcs; _i < funcs_1.length; _i++) {
                var fn = funcs_1[_i];
                fn && fn.apply(this, arguments);
            }
        };
    }
    exports.concat = concat;
    /**
     * 创建一个新函数，调用该函数后，重复调用原函数指定次数。
     * @param fn 要调用的原函数。
     * @param count 要调用的次数。
     * @return 返回一个新函数。
     * @example repeat(()=> console.log("hello"), 3)() // 输出 3 个 hello
     */
    function repeat(fn, count) {
        if (count === void 0) { count = 0; }
        return function () {
            for (var i = 0; i < count; i++) {
                fn.apply(this, arguments);
            }
        };
    }
    exports.repeat = repeat;
    /**
     * 创建一个新函数，仅在第一次调用该函数时调用原函数。
     * @param fn 要调用的原函数。
     * @return 返回一个新函数。
     */
    function once(fn) {
        var called = false;
        var r;
        return function () {
            if (called) {
                return r;
            }
            called = true;
            return r = fn.apply(this, arguments);
        };
    }
    exports.once = once;
    /**
     * 创建一个新函数，多次调用该函数时，仅在第一次调用原函数。
     * @param fn 要调用的原函数。
     * @param count 调用的次数。
     * @return 返回一个新函数。
     * @example
     * var done = before(() => console.log("hello"), 2);
     * done();  // 输出 hello
     * done();  // 不输出
     */
    function before(fn, count) {
        var i = -1;
        return function () {
            if (++i === count) {
                i = 0;
            }
            if (i === 0) {
                return fn.apply(this, arguments);
            }
        };
    }
    exports.before = before;
    /**
     * 创建一个新函数，多次调用该函数时，仅在最后一次调用原函数。
     * @param fn 要调用的原函数。
     * @param count 调用的次数。
     * @return 返回一个新函数。
     * @example
     * var done = after(() => console.log("hello"), 2);
     * done();  // 不输出
     * done();  // 输出 hello
     */
    function after(fn, count) {
        var i = 0;
        return function () {
            if (++i === count) {
                i = 0;
                return fn.apply(this, arguments);
            }
        };
    }
    exports.after = after;
    /**
     * 创建一个新函数，在指定时间内多次调用该函数时，仅在第一次调用原函数。
     * @param fn 要调用的原函数。
     * @param timeout 超时的毫秒数。
     * @return 返回一个新函数。
     */
    function limit(fn, timeout) {
        if (timeout === void 0) { timeout = 0; }
        var last;
        var timer;
        return function () {
            var _this = this;
            var remaining = last ? timeout - (Date.now() - last) : -1;
            if (remaining < 0) {
                last = Date.now();
                return fn.apply(this, arguments);
            }
            if (!timer) {
                var args_1 = arguments;
                timer = setTimeout(function () {
                    timer = 0;
                    fn.apply(_this, args_1);
                }, remaining);
            }
        };
    }
    exports.limit = limit;
    /**
     * 创建一个新函数，多次调用该函数时，仅在参数发生变化后调用原函数。
     * @param fn 要调用的原函数。
     * @return 返回一个新函数。
     */
    function cache(fn) {
        var caches = [];
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var _a = 0, caches_1 = caches; _a < caches_1.length; _a++) {
                var cache_1 = caches_1[_a];
                if (args.length === cache_1.length) {
                    var allSame = true;
                    for (var i = 0; i < cache_1.length; i++) {
                        if (cache_1[i] !== args[i]) {
                            allSame = false;
                            break;
                        }
                    }
                    if (allSame) {
                        return cache_1.r;
                    }
                }
            }
            caches.push(args);
            return args.r = fn.apply(void 0, args);
        };
    }
    exports.cache = cache;
    /**
     * 创建一个新函数，调用该函数后，延时调用原函数。
     * @param fn 要调用的原函数。
     * @param timeout 延时的毫秒数。
     * @return 返回一个新函数。
     * @example delay(() => console.log("延时执行"), 100)()
     */
    function delay(fn, timeout) {
        if (timeout === void 0) { timeout = 0; }
        return function () {
            var _this = this;
            var args = arguments;
            setTimeout(function () {
                fn.apply(_this, args);
            }, timeout);
        };
    }
    exports.delay = delay;
    /**
     * 创建一个新函数，调用该函数后，延时调用原函数。如果在延时等待期间有新的调用，则重新开始计时。
     * @param fn 要调用的原函数。
     * @param timeout 延时的毫秒数。
     * @return 返回一个新函数。
     * @example document.onscroll = defer(() => console.log("延时执行"), 100);
     */
    function defer(fn, duration) {
        if (duration === void 0) { duration = 0; }
        var timer;
        return function () {
            var _this = this;
            var args = arguments;
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                timer = 0;
                fn.apply(_this, args);
            }, duration);
        };
    }
    exports.defer = defer;
    /**
     * 创建一个新函数，调用该函数后每隔指定时间调用一次原函数。
     * @param fn 要调用的原函数，函数接收以下参数：
     * - count：当前执行的次数。
     *
     * 如果函数返回 false 则停止执行。
     * @param count 执行的次数。如果指定为 -1 则无限次执行。
     * @param timeout 每次执行之间的间隔毫秒数。
     * @example interval(function (a) { console.log(a) }, 10, 400)
     */
    function interval(fn, count, timeout) {
        if (count === void 0) { count = -1; }
        if (timeout === void 0) { timeout = 0; }
        progress(0);
        function progress(value) {
            if (value !== count && fn(value) !== false) {
                setTimeout(progress, timeout, value + 1);
            }
        }
    }
    exports.interval = interval;
    /**
     * 依次执行多个函数，如果函数没有发生异常则返回，否则继续执行下一个函数。
     * @param funcs 要调用的所有函数。
     * @return 返回第一个未发生异常的函数的返回值。如果所有函数都发生异常则返回 undefined。
     * @example
     * var xhr = tryThese(() => new ActiveXObject("Microsoft.XMLHttp"), () => new XMLHttpRequest())
     */
    function tryThese() {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        for (var _a = 0, funcs_2 = funcs; _a < funcs_2.length; _a++) {
            var fn = funcs_2[_a];
            try {
                return fn();
            }
            catch (e) { }
        }
    }
    exports.tryThese = tryThese;
    /**
     * 获取函数不含参数部分的源码。
     * @param fn 函数。
     * @return 返回源码。根据执行环境的不同，其中可能包含注释。
     * @example getSource(x => x)
     */
    function getSource(fn) {
        return fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/^(?:\([^)]*\)|[^=]+)\s*=>\s*/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) { return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16))); });
    }
    exports.getSource = getSource;
});
//# sourceMappingURL=function.js.map