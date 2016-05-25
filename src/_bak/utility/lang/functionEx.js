
// #region @Function.isFunction

/**
 * 判断一个对象是否是函数。
 * @param {Object} obj 要判断的对象。
 * @returns {Boolean} 如果 @obj 是函数则返回 @true，否则返回 @false。
 * @example
 * Function.isFunction(function () {}); // true
 * 
 * Function.isFunction(null); // false
 * 
 * Function.isFunction(new Function); // true
 */
Function.isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
}

// #endregion

// #region @Function.concat

/**
 * 串联多个函数并返回一个将依次执行串联的函数新函数。
 * @param {Function} ... 要串联的函数。
 * @returns {Functin} 返回一个新函数。该函数无返回值。
 * @example Function.concat(function(){}, function(){})()
 */
Function.concat = function () {
    var s = Array.prototype.slice.call(arguments, 0);
    return function () {
        for (var i = 0; i < s.length; i++) {
            typeof console === "object" && console.assert(!s[i] || s[i] instanceof Function, "Function.concat(...: 必须是函数)");
            s[i] && s[i].apply(this, arguments);
        }
    };
};

// #endregion

// #region @Function.tryThese

/**
 * 运行多个函数，如果函数发生异常则继续执行下一个函数，否则返回其返回值。
 * @param {Funcion} ... 要运行的函数。
 * @returns {Object} 返回第一个未发生异常函数的返回值。如果所有函数都发生异常则返回 @undefined。
 * @example 
 * var xhr = Function.tryThese(function(){ 
 *      return new ActiveXObject("Microsoft.XMLHttp"); 
 * }, function(){
 *      return new XMLHttpRequest();
 * })
 */
Function.tryThese = function () {
    var result;
    for (var i = 0, l = arguments.length; i < l; i++) {
        typeof console === "object" && console.assert(arguments[i] instanceof Function, "Function.tryThese(...: 必须是函数)");
        try {
            result = arguments[i].apply(this, arguments);
        } catch (e) { }
    }
    return result;
};

// #endregion

// #region @Function.interval

/**
 * 每隔指定时间执行一次函数。
 * @param {Function} fn 要执行的函数。其参数为：
 * 
 * * @param {Number} count 当前执行的次数。
 * * @returns {Boolean}  如果返回 @false 则强制停止执行。
 * 
 * @param {Number} [times=-1] 执行的次数。如果指定为 -1 则无限次执行。
 * @param {Number} [duration=0] 每次执行之间的间隔毫秒数。
 * @example Function.interval(function(a){console.log(a) }, 10, 400)
 */
Function.interval = function (fn, times, duration) {
    typeof console === "object" && console.assert(fn instanceof Function, "Function.interval(fn: 必须是函数, [times], [duration])");
    var count = 0;
    duration = duration || 0;
    function callback() {
        if ((times < 0 || count <= times) && fn(count++) !== false) {
            setTimeout(callback, duration);
        }
    }
    callback();
};

// #endregion

// #region @Function.createDelayed

/**
 * 创建一个延时执行函数。
 * @param {Function} fn 执行的函数。
 * @param {Number} [duration=0] 延时的毫秒数。
 * @returns {Function} 返回一个可触发延时执行的函数。
 * 如果在延时等待期间有新的调用，则之前的延时失效，重新开始延时执行。
 * @example
 * document.onscroll = Function.createDelayed(function(){
 *      console.log('延时执行');
 * }, 100);
 */
Function.createDelayed = function (fn, duration) {
    typeof console === "object" && console.assert(fn instanceof Function, "Function.createDelayed(fn: 必须是函数, [duration])");
    var timer;
    return function () {
        var me = this, args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            timer = 0;
            fn.apply(me, args);
        }, duration || 0);
    };
};

// #endregion

// #region @Function.getSource

/**
 * 获取指定函数的源码。
 * @param {Function} fn 要获取的函数。
 * @returns {String} 返回函数源码。
 * @example Function.getSource(function(x){ return x; })
 */
Function.getSource = function (fn) {
    return fn.toString().replace(/^function\s+[^(]*\s*\(.*?\)\s*\{[\r\n]*/, "").replace(/\s*\}\s*$/, "").replace(/\\u([0-9a-f]{3})([0-9a-f])/gi, function (a, b, c) {
        return String.fromCharCode((parseInt(b, 16) * 16 + parseInt(c, 16)))
    });
};

// #endregion
