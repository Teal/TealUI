
// #region @Function.isFunction

/**
 * 判断一个变量是否是函数。
 * @param {Object} obj 要判断的变量。
 * @returns {Boolean} 如果是函数，返回 true， 否则返回 false。
 * @example
 * <pre>
 * Object.isFunction(function () {}); // true
 * Object.isFunction(null); // false
 * Object.isFunction(new Function); // true
 * </pre>
 */
Function.isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
}

// #endregion

// #region @Function.concat

/**
 * 串联多个函数。
 */
Function.concat = function () {
    var s = Array.prototype.slice.call(arguments, 0);
    return function () {
        for (var i = 0; i < s.length; i++) {
            s[i].apply(this, arguments);
        }
    };
};

// #endregion

// #region @Function.tryThese

/**
 * 尝试运行返回正确的才内容。
 * @param {Funcion} 运行的函数。
 */
Function.tryThese = function () {
    var result = null;
    for (var i = 0, l = arguments.length; i < l; i++) {
        try {
            result = arguments[i].apply(this, arguments);
        } catch (e) { }
    }
    return result;
};

// #endregion

// #region @Function.interval

/**
 * 每隔时间执行一次函数。
 * @param {Function} fn 执行的函数。
 * @param {Number} times (默认 -1)运行次数。
 * @param {Number} [duration=0] 延时（毫秒）。
 * @returns {Timer} 可用于 clearInterval 的计时器。
 */
Function.interval = function (fn, times, duration) {
    var args = Array.prototype.slice.call(arguments, 3),
		i = times == undefined ? -1 : times,
		timer;
    return timer = setInterval(function () {
        if (i--) fn.apply(this, args);
        else clearInterval(timer);
    }, duration || 0);
};

// #endregion

// #region @Function.createDalayed

/**
 * 创建一个延时执行函数。
 * @param {Function} fn 执行的函数。
 * @param {Number} [duration=0] 延时（毫秒）。
 * @returns {Timer} 可用于 clearInterval 的计时器。
 */
Function.createDalayed = function (fn, duration) {
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
