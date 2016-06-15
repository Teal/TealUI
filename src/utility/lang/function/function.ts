/**
 * @fileOverview 函数(Function)扩展
 * @author xuld@vip.qq.com
 * @description 提供 JavaScript 内置对象 Function 的扩展 API。
 * @namespace Function
 */

// #region 语言内置

/**
 * 返回一个新函数，这个函数执行时 @_this 始终为指定的 @scope。
 * @param scope 要绑定的 *_this* 的值。
 * @returns 返回一个新函数。
 * @example (function(){ return _this;  }).bind(0)() // 0
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
export function bind(_this: Function, scope: any, ...args: any[]) {
    return function () {
        return _this.apply(scope, args.concat(arguments));
    };
};

/**
 * 返回一个新函数，这个函数执行时 @_this 始终为指定的 @scope。
 * @param scope 要绑定的 *_this* 的值。
 * @returns 返回一个新函数。
 * @example (function(){ return _this;  }).bind(0)() // 0
 * @since ES5
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
export function bind_simple(_this: Function, scope) {
    return function () {
        return _this.apply(scope, arguments);
    };
};

// #endregion

// #region 普通扩展

/**
 * 空函数。
 * @example var fn = Function.empty
 */
export function empty() { };

/**
 * 返回一个新函数，这个函数始终返回指定值。
 * @param value 新函数的返回值。
 * @returns 返回一个新函数，这个函数始终返回指定值。
 * @example Function.from(false)() // false
 */
export function from<T>(value: T) {
    return () => value;
}

/**
 * 判断一个对象是否是函数。
 * @param obj 要判断的对象。
 * @returns 如果 *obj* 是函数则返回 true，否则返回 false。
 * @example Function.isFunction(function () {}) // true
 * @example Function.isFunction(null) // false
 * @example Function.isFunction(new Function) // true
 */
export function isFunction(obj: any): obj is Function {
    return Object.prototype.toString.call(obj) === "[object Function]";
}

/**
 * 串联多个函数并返回一个将依次执行串联的函数新函数。
 * @param functions 要串联的函数。
 * @returns 返回一个新函数。该函数无返回值。
 * @example Function.concat(function(){}, function(){})()
 */
export function concat(...functions: Function[]) {
    return function () {
        for (let i = 0; i < functions.length; i++) {
            functions[i] && functions[i].apply(this, arguments);
        }
    };
}

/**
 * 运行多个函数，如果函数发生异常则继续执行下一个函数，否则返回其返回值。
 * @param functions 要运行的函数。
 * @returns 返回第一个未发生异常函数的返回值。如果所有函数都发生异常则返回 undefined。
 * @example 
 * var xhr = Function.tryThese(function(){ 
 *      return new ActiveXObject("Microsoft.XMLHttp"); 
 * }, function(){
 *      return new XMLHttpRequest();
 * })
 */
export function tryThese(...functions: Function[]) {
    for (let i = 0; i < arguments.length; i++) {
        try {
            return arguments[i].apply(this, arguments);
        } catch (e) { }
    }
}

/**
 * 每隔指定时间执行一次函数。
 * @param fn 要执行的函数。其参数为：
 * * param count 当前执行的次数。
 * * returns 如果返回 false 则强制停止执行。
 * @param times 执行的次数。如果指定为 -1 则无限次执行。
 * @param duration 每次执行之间的间隔毫秒数。
 * @example Function.interval(function(a){console.log(a) }, 10, 400)
 */
export function interval(fn: (count: number) => boolean | void, times = -1, duration = 0) {
    let count = 0;
    callback();
    function callback() {
        if ((times < 0 || count <= times) && fn(count++) !== false) {
            setTimeout(callback, duration);
        }
    }
}

/**
 * 创建一个延时执行函数。
 * @param fn 执行的函数。
 * @param duration 延时的毫秒数。
 * @returns 返回一个可触发延时执行的函数。
 * 如果在延时等待期间有新的调用，则之前的延时失效，重新开始延时执行。
 * @example document.onscroll = Function.createDelayed(function(){ console.log('延时执行'); }, 100);
 */
export function delay(fn: Function, duration = 0) {
    let timer;
    return function () {
        let args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            timer = 0;
            fn.apply(this, args);
        }, duration || 0);
    };
}

/**
 * 获取指定函数的源码。
 * @param fn 要获取的函数。
 * @returns 返回函数源码。
 * @example Function.getSource(function(x){ return x; })
 */
export function getSource(fn: Function) {
    return fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, (a: string, b: string, c: string) => String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16))));
}

// #endregion
