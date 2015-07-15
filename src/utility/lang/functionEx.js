//===========================================
//  函数       
//===========================================

/**
 * 函数。
 * @class Function
 */
Function.implementIf({



    /**
     * 返回一个新函数，这个函数始终返回 *value*。
     * @param {Object} value 需要返回的参数。
     * @return {Function} 执行得到参数的一个函数。
     * @example
     * <pre>
     * var fn = Function.from(0);
     * fn()    // 0
     * </pre>
     */
    from: function (value) {

        // 返回一个值，这个值是当前的参数。
        return function () {
            return value;
        }
    },

    isFunction: jQuery.browser.msie ?
	        function (fn) {
	            if (!fn)
	                return false;
	            var s = "toString",
	                v = "valueOf",
	                t = typeof fn[s] === "function" && fn[s],
	                o = typeof fn[v] === "function" && fn[v],
	                r;
	            if (t)
	                delete fn[s];
	            if (o)
	                delete fn[v];
	            r = typeof fn !== "string" && !(fn instanceof String) && !fn.nodeName && fn.constructor != Array && /^[\s[]?function/.test(fn + "");
	            if (t)
	                fn[s] = t;
	            if (o)
	                fn[v] = o;
	            return r;
	        } :
	        function (fn) {
	            return fn && fn instanceof Function;
	        },

    /**
	 * 连接函数, 同时运行另一个, 参数为函数, 参数, 参数。
	 * @param {Function} 连接的成员。
	 * @return {Function} 连接函数。
	 */
    concat: function () {
        var s = Array.create(arguments);
        return function () {
            var a = arguments, me = this;
            Object.each(s, function (fn) {
                fn.apply(me, a);
            });
        }
    },

    /**
	 * 延时运行某个函数。
	 * @param {Number} time 时间（毫秒）。
	 * @param {Object} bind 绑定的对象员。
	 * @return {Object} ... 参数。
	 * @return {Timer} 可用于 clearTimeout 的计时器。
	 */
    delay: function (time, bind) {
        var fn = this;
        var args = Array.create(arguments, 2);
        return setTimeout(function () { fn.apply(bind, args); }, time);
    },

    /**
	 * 绑定一个对象和参数。
	 * @param {Object} bind 绑定的对象员。
	 * @return {Object} ... 参数。
	 * @return {Function} 函数。
	 */
    bind: function (bind) {
        var fn = this;
        if (arguments.length > 1) {
            var args = Array.create(arguments, 1);
            return function () {
                return fn.apply(bind, args.concat(Array.create(arguments)))
            };
        } else
            return function () { return fn.apply(bind, arguments) };
    },

    pass: function (args, bind) {
        var self = this;
        if (args != null) args = Array.from(args);
        return function () {
            return self.apply(bind, args || arguments);
        };
    },

    /**
	 * 每隔时间执行一次函数。
	 * @param {Number} time 时间（毫秒）。
	 * @param {Number} times (默认 -1)运行次数。
	 * @param {Object} bind 绑定的对象员。
	 * @return {Object} ... 参数。
	 * @return {Timer} 可用于 clearInterval 的计时器。
	 */
    periodical: function (itime, times, bind) {
        var fn = this,
			args = Array.create(arguments, 3),
			my = times == undefined ? -1 : times,
			timer;
        return timer = setInterval((function () { if (my--) fn.apply(bind, args); else clearTimeout(timer); }), itime);
    }

});

Object.extendIf(Function, {

    /**
	 * 尝试运行返回正确的才内容。
	 * @param {Funcion} 运行的函数。
	 */
    tryThese: function () {
        var result = null;
        for (var i = 0, l = arguments.length; i < l; i++) {
            try {
                result = arguments[i].apply(this, arguments);
            } catch (e) { }
        }
        return result;
    },

    /**
	 * 生成一个函数。
	 * @param {Function/String} statement 函数/函数的字符串形式。
	 * @param {Number} time 时间（毫秒）。
	 * @param {Number} times (默认 -1)运行次数。
	 * @return {Timer} 可用于 clearInterval 的计时器。
	 */
    create: function (statement, time, times) {
        var fn = typeof statement === 'function' ? statement : new Function(statement);
        return (time ? (function () { return fn[times == 1 ? "delay" : "periodical"].apply(this, arguments); }) : fn);
    },

    /**
   * A very commonly used method throughout the framework. It acts as a wrapper around another method
   * which originally accepts 2 arguments for `name` and `value`.
   * The wrapped function then allows "flexible" value setting of either:
   *
   * - `name` and `value` as 2 arguments
   * - one single object argument with multiple key - value pairs
   *
   * For example:
   *
   *     var setValue = Ext.Function.flexSetter(function(name, value) {
   *         this[name] = value;
   *     });
   *
   *     // Afterwards
   *     // Setting a single name - value
   *     setValue('name1', 'value1');
   *
   *     // Settings multiple name - value pairs
   *     setValue({
   *         name1: 'value1',
   *         name2: 'value2',
   *         name3: 'value3'
   *     });
   *
   * @param {Function} setter
   * @returns {Function} flexSetter
   */
    flexSetter: function (fn) {
        return function (a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }

                if (Ext.enumerables) {
                    for (i = Ext.enumerables.length; i--;) {
                        k = Ext.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    },


    /**
     * Create an alias to the provided method property with name `methodName` of `object`.
     * Note that the execution scope will still be bound to the provided `object` itself.
     *
     * @param {Object/Function} object
     * @param {String} methodName
     * @return {Function} aliasFn
     */
    alias: function (object, methodName) {
        return function () {
            return object[methodName].apply(object, arguments);
        };
    },


    /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     }
     *
     *     sayHi('Fred'); // alerts "Hi, Fred"
     *
     *     // create a new function that validates input without
     *     // directly modifying the original function:
     *     var sayHiToFriend = Ext.Function.createInterceptor(sayHi, function(name){
     *         return name == 'Brian';
     *     });
     *
     *     sayHiToFriend('Fred');  // no alert
     *     sayHiToFriend('Brian'); // alerts "Hi, Brian"
     *
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to call before the original
     * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
     * **If omitted, defaults to the scope in which the original function is called or the browser window.**
     * @param {Mixed} returnValue (optional) The value to return if the passed function return false (defaults to null).
     * @return {Function} The new function
     */
    createInterceptor: function (origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (typeof newFn !== 'function') {
            return origFn;
        }
        else {
            return function () {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || window, args) !== false) ? origFn.apply(me || window, args) : returnValue || null;
            };
        }
    },




    /**
     * Creates a delegate (callback) which, when called, executes after a specific delay.
     *
     * @param {Function} fn The function which will be called on a delay when the returned function is called.
     * Optionally, a replacement (or additional) argument list may be specified.
     * @param {Number} delay The number of milliseconds to defer execution by whenever called.
     * @param {Object} scope (optional) The scope (`this` reference) used by the function at execution time.
     * @param {Array} args (optional) Override arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position.
     * @return {Function} A function which, when called, executes the original function after the specified delay.
     */
    createDelayed: function (fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
        }
        return function () {
            var me = this;
            setTimeout(function () {
                fn.apply(me, arguments);
            }, delay);
        };
    },



    /**
     * Creates a delegate function, optionally with a bound scope which, when called, buffers
     * the execution of the passed function for the configured number of milliseconds.
     * If called again within that period, the impending invocation will be canceled, and the
     * timeout period will begin again.
     *
     * @param {Function} fn The function to invoke on a buffered timer.
     * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
     * function.
     * @param {Object} scope (optional) The scope (`this` reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @param {Array} args (optional) Override arguments for the call. Defaults to the arguments
     * passed by the caller.
     * @return {Function} A function which invokes the passed function after buffering for the specified time.
     */
    createBuffered: function (fn, buffer, scope, args) {
        return function () {
            var timerId;
            return function () {
                var me = this;
                if (timerId) {
                    clearInterval(timerId);
                    timerId = null;
                }
                timerId = setTimeout(function () {
                    fn.apply(scope || me, args || arguments);
                }, buffer);
            };
        }();
    },

    /**
     * Creates a throttled version of the passed function which, when called repeatedly and
     * rapidly, invokes the passed function only after a certain interval has elapsed since the
     * previous invocation.
     *
     * This is useful for wrapping functions which may be called repeatedly, such as
     * a handler of a mouse move event when the processing is expensive.
     *
     * @param {Function} fn The function to execute at a regular time interval.
     * @param {Number} interval The interval **in milliseconds** on which the passed function is executed.
     * @param {Object} scope (optional) The scope (`this` reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @returns {Function} A function which invokes the passed function at the specified interval.
     */
    createThrottled: function (fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function () {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function () {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    }


});