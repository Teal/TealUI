/**
 * @author xuld
 */


//#include utils/deferrable.js

/**
 * 用于发送和接收 AJAX 请求的工具。
 * @class
 * @extends Deferrable
 */
var Ajax = (function () {

    var ajaxLoc,
		ajaxLocParts,
		rUrl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
		defaultAccepts = ["*/"] + ["*"],
		Ajax;

    // 如果设置了 document.domain, IE 会抛出异常。
    try {
        ajaxLoc = location.href;
    } catch (e) {
        // 使用 a 的默认属性获取当前地址。
        ajaxLoc = document.createElement("a");
        ajaxLoc.href = "";
        ajaxLoc = ajaxLoc.href;
    }

    ajaxLocParts = rUrl.exec(ajaxLoc.toLowerCase()) || [];

	/**
	 * @class Ajax
	 */
    Ajax = Deferrable.extend({

		/**
		 * 当前 Ajax 对象的默认配置。
		 * @type {Object}
		 */
		options: {
			
			/**
			 * 默认的地址。
			 * @type {String}
			 */
			url: ajaxLoc,

			/**
			 * 默认超时数。
			 * @type {Number}
			 */
			timeout: -1

		},

        constructor: function () {

        },

        /**
		 * 发送一个 AJAX 请求。
		 * @param {Object} xhrObject 发送的配置。
		 *
		 * - async: 是否为异步的请求。默认为 true 。
		 * - cache: 是否允许缓存。默认为 true 。
		 * - charset: 请求的字符编码。
		 * - complete(statusCode, xhrObject): 请求完成时的回调。
		 * - crossDomain: 指示 AJAX 强制使用跨域方式的请求。默认为 null,表示系统自动判断。
		 * - data: 请求的数据。
		 * - dataType: 请求数据的类型。默认为根据返回内容自动识别。
		 * - error(message, xhrObject): 请求失败时的回调。
		 * - headers: 附加的额外请求头信息。
		 * - jsonp: 如果使用 jsonp 请求，则指示 jsonp 参数。如果设为 false，则不添加后缀。默认为 callback。
		 * - jsonpCallback: jsonp请求回调函数名。默认为根据当前时间戳自动生成。
		 * - password: 请求的密码 。
		 * - start(data, xhrObject): 请求开始时的回调。return false 可以终止整个请求。
		 * - success(data, xhrObject): 请求成功时的回调。
		 * - timeout: 请求超时时间。单位毫秒。默认为 -1 无超时 。
		 * - type: 请求类型。默认是 "GET" 。
		 * - url: 请求的地址。
		 * - username: 请求的用户名 。
		 *
		 * @param {String} link='wait' 当出现两次并发的请求后的操作。
		 * 
		 * - wait: 等待上个任务完成。
		 * - ignore: 忽略新的任务。
		 * - stop: 正常中断上个任务，上个操作的回调被立即执行，然后执行当前任务。
		 * - abort: 强制停止上个任务，上个操作的回调被忽略，然后执行当前任务。
		 * - replace: 替换上个任务为新的任务，上个任务的回调将被复制。
		 * @return this
		 */
        send: function (xhrObject, link) {
            var me = this, parts;

            // 串联请求。
            if (!me.defer(xhrObject, link)) {

                // 首先复制默认配置，然后复制用户对应的配置。
                xhrObject = Object.extend({
                    owner: me,
                    timeout: me.options.timeout
                }, xhrObject);

                //assert(!xhrObject.url || xhrObject.url.replace, "Ajax#run(xhrObject): {xhrObject.url} 必须是字符串。", xhrObject.url);

                // url
                xhrObject.url = xhrObject.url ? xhrObject.url.replace(/#.*$/, "") : me.options.url;

                // data
                xhrObject.data = xhrObject.data ? typeof xhrObject.data !== 'string' ? Ajax.param(xhrObject.data) : xhrObject.data : null;

                // crossDomain
                if (xhrObject.crossDomain == null) {

                    parts = rUrl.exec(xhrObject.url.toLowerCase());

                    // from jQuery: 跨域判断。
                    xhrObject.crossDomain = !!(parts &&
						(parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] ||
							(parts[3] || (parts[1] === "http:" ? 80 : 443)) !=
								(ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443)))
					);

                }

                // 根据 dataType 获取当前用于传输的工具。
                // 实际的发送操作。
                (Ajax.transports[xhrObject.dataType] || Ajax.transports.text)(xhrObject);

            }

            return me;
        },

        /**
		 * 停止当前的请求。
		 * @protected override
		 * @return this
		 */
        pause: function () {
            if (this.callback)
                this.callback('Aborted', -3);
            return this;
        }
	
        /**
         * 由 XHR 负责调用的状态检测函数。
         * @param {Object} extraArgs 忽略的参数。
         * @param {Integer} errorCode 系统控制的错误码。
         *
         * - 0: 成功。
         * - -1: 程序出现异常，导致进程中止。
         * - -2: HTTP 相应超时， 程序自动终止。
         * - -3: 用户强制中止操作。
         * - 1: HTTP 成功相应，但返回的状态码被认为是不对的。
         * - 2: HTTP 成功相应，但返回的内容格式不对。
         * @method callback
         * @private 
         */

    });
	
	/**
	 * @namespace Ajax
	 */
    Object.extend(Ajax, {
		
		/**
		 * 发送一个新的 AJAX 请求。
		 * @param {Object} xhrObject 发送的配置。
		 *
		 * - async: 是否为异步的请求。默认为 true 。
		 * - cache: 是否允许缓存。默认为 true 。
		 * - charset: 请求的字符编码。
		 * - complete(statusCode, xhrObject): 请求完成时的回调。
		 * - crossDomain: 指示 AJAX 强制使用跨域方式的请求。默认为 null,表示系统自动判断。
		 * - data: 请求的数据。
		 * - dataType: 请求数据的类型。默认为 text。
		 * - error(message, xhrObject): 请求失败时的回调。
		 * - headers: 附加的额外请求头信息。
		 * - jsonp: 如果使用 jsonp 请求，则指示 jsonp 参数。如果设为 false，则不添加后缀。默认为 callback。
		 * - jsonpCallback: jsonp请求回调函数名。默认为根据当前时间戳自动生成。
		 * - password: 请求的密码 。
		 * - start(data, xhrObject): 请求开始时的回调。return false 可以终止整个请求。
		 * - success(data, xhrObject): 请求成功时的回调。
		 * - timeout: 请求超时时间。单位毫秒。默认为 -1 无超时 。
		 * - type: 请求类型。默认是 "GET" 。
		 * - url: 请求的地址。
		 * - username: 请求的用户名 。
		 *
		 */
        send: function (xhrObject) {
            return new Ajax().send(xhrObject);
        },

        transports: {},

        accepts: {},

        dataParsers: {},

        /**
		 * 返回变量的地址形式。
		 * @param {Object} obj 变量。
		 * @return {String} 字符串。
		 * @example <pre>
		 * Ajax.param({a: 4, g: 7}); //  a=4&g=7
		 * </pre>
		 */
        param: function (obj, name) {

            var s;
            if (obj && typeof obj === 'object') {
                s = [];
                Object.each(obj, function (value, key) {
                    s.push(Ajax.param(value, name ? name + "[" + key + "]" : key));
                });
                s = s.join('&');
            } else {
                s = encodeURIComponent(name) + "=" + encodeURIComponent(obj);
            }

            return s.replace(/%20/g, '+');
        },

        concatUrl: function (url, param) {
            return param ? url + (url.indexOf('?') >= 0 ? '&' : '?') + param : url;
        },

        addCachePostfix: function (url) {
            return /[?&]_=/.test(url) ? url : Ajax.concatUrl(url, '_=' + Date.now() + JPlus.id++);
        },

        /**
		 * 判断一个 HTTP 状态码是否表示正常响应。
		 * @param {Number} status 要判断的状态码。
		 * @return {Boolean} 如果正常则返回true, 否则返回 false 。
		 * @remark 一般地， 200、304、1223 被认为是正常的状态吗。
		 */
        checkStatus: function (status) {

            // 获取状态。
            if (!status) {

                // 获取协议。
                var protocol = window.location.protocol;

                // 对谷歌浏览器, 在有些协议， status 不存在。
                return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
            }

            // 检查， 各浏览器支持不同。
            return (status >= 200 && status < 300) || status == 304 || status == 1223;
        },

        /**
		 * 初始化一个 XMLHttpRequest 对象。
		 * @return {XMLHttpRequest} 请求的对象。
		 */
        createNativeRequest: window.ActiveXObject ? function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } : function () {
            return new XMLHttpRequest();
        },

        /**
		 * 用于让 transport 直接调用的回调函数。
		 * @type Boolean
		 */
        done: function (xhrObject, error, status, statusText, eventArgs, done) {

            var eventName;

            if (error) {
                xhrObject.errorMessage = eventArgs;
                eventName = 'error';
            } else {

                try {
                    eventArgs = eventArgs.call(Ajax.dataParsers, xhrObject);
                } catch (parseDataError) {
                    return Ajax.done(xhrObject, 2, status, statusText, parseDataError.message, done);
                }

                eventName = 'success';
            }

            xhrObject.errorCode = error;
            xhrObject.status = status;
            xhrObject.statusText = statusText;

            // 系统内置的全部完成后的回调。
            if (done) {
                done();
            }

            try {

                if (xhrObject[eventName]) {
                    xhrObject[eventName].call(xhrObject.owner, eventArgs, xhrObject);
                }

                if (xhrObject.complete)
                    xhrObject.complete.call(xhrObject.owner, error, xhrObject);

            } finally {

                xhrObject.xhr = null;

                xhrObject.owner.progress();

            }

        },

        error: function (xhrObject, errorThrown) {
            // 赋予新的空对象，避免再次访问 XHR 。
            xhrObject.xhr = { readyState: 4 };
            xhrObject.errorThrown = errorThrown;
            xhrObject.owner.callback(errorThrown.message, -1);
        }

    });
    
    /**
     * 根据 xhr 获取响应。
     * @ignore
     * @type {Object} xhrObject 要处理的原始 xhrObject。
     */
    Ajax.dataParsers.text = function (xhrObject) {

        var responseText;

        // 如果请求了一个二进制格式的文件， IE6-9 报错。
        try {
            responseText = xhrObject.xhr.responseText;
        } catch (ieResponseTextError) {
            responseText = '';
        }

        return xhrObject.responseText = responseText;
    };

    /**
     * 发送指定配置的 Ajax 对象。
     * @ignore
     * @type {Object} xhrObject 要发送的 AJAX 对象。
     * @type {Function} parseData 使用当前发送器发送数据后的回调函数。
     */
    Ajax.transports.text = function (xhrObject, parseData, done) {

        var headers = {}, xhr, key, callback;

        // type
        xhrObject.type = xhrObject.type ? xhrObject.type.toUpperCase() : 'GET';

        // async
        xhrObject.async = xhrObject.async !== false;

        // data
        if (xhrObject.data && xhrObject.type === 'GET') {
            xhrObject.url = Ajax.concatUrl(xhrObject.url, xhrObject.data);
            xhrObject.data = null;
        }

        // cache
        if (xhrObject.cache !== true) {
            xhrObject.url = Ajax.addCachePostfix(xhrObject.url);
        }

        // headers['Accept']
        headers.Accept = xhrObject.dataType in Ajax.accepts ? Ajax.accepts[xhrObject.dataType] + ", " + defaultAccepts + "; q=0.01" : defaultAccepts;

        // headers['Content-Type']
        if (xhrObject.data) {
            headers['Content-Type'] = "application/x-www-form-urlencoded; charset=" + (xhrObject.charset || "UTF-8");
        }

        // headers['Accept-Charset']
        if (xhrObject.charset) {
            headers["Accept-Charset"] = value;
        }

        // headers['x-Requested-With']
        if (!xhrObject.crossDomain) {
            headers['x-Requested-With'] = 'XMLHttpRequest';
        }

        // 如果参数有 headers, 复制到当前 headers 。
        for (key in xhrObject.headers) {
            headers[key] = xhrObject.headers[key];
        }

        // 发送请求。

        // 请求对象。
        xhrObject.xhr = xhr = Ajax.createNativeRequest();

        xhrObject.owner.callback = callback = function (eventArgs, error) {

            // xhr
            var xhr = xhrObject.xhr, status, statusText;

            try {

                if (!xhr || (!error && xhr.readyState !== 4)) {
                    return;
                }

                // 删除 readystatechange  。
                // 删除 xhrObject.callback 避免被再次触发。
                xhr.onreadystatechange = xhrObject.owner.callback = Function.empty;

                // 如果存在错误。
                if (error) {

                    // 如果是因为超时引发的，手动中止请求。
                    if (xhr.readyState !== 4) {
                        xhr.abort();
                    }

                    status = error;
                    statusText = "";

                } else {

                    // 正确的状态码。
                    status = xhr.status;

                    // 如果跨域，火狐报错。
                    try {
                        statusText = xhr.statusText;
                    } catch (firefoxCrossDomainError) {
                        // 模拟 Webkit: 设为空字符串。
                        statusText = "";
                    }

                    // 检验状态码是否正确。
                    if (Ajax.checkStatus(status)) {
                        eventArgs = parseData || Ajax.dataParsers[xhrObject.dataType] || Ajax.dataParsers.text;
                    } else {
                        error = 1;
                        eventArgs = statusText;
                    }

                }

                // 清空变量的引用。
                xhr = null;

            } catch (firefoxAccessError) {
                return Ajax.error(xhrObject, firefoxAccessError);
            }

            // 统一处理回调。
            Ajax.done(xhrObject, error, status, statusText, eventArgs, done);
        };

        // 预处理数据。
        if (xhrObject.start && xhrObject.start.call(xhrObject.owner, xhrObject.data, xhrObject) === false)
            return callback('Prevented', -3);

        try {

            if (xhrObject.username)
                xhr.open(xhrObject.type, xhrObject.url, xhrObject.async, xhrObject.username, xhrObject.password);
            else
                xhr.open(xhrObject.type, xhrObject.url, xhrObject.async);

        } catch (ieOpenError) {

            //  出现错误地址时  ie 在此产生异常 。
            return Ajax.error(xhrObject, ieOpenError);
        }

        // 设置文件头。
        // 如果跨域了， 火狐会报错。
        for (key in headers)
            try {
                xhr.setRequestHeader(key, headers[key]);
            } catch (firefoxSetHeaderError) {
            }

        // 进行真实的发送。

        try {
            xhr.send(xhrObject.data);
        } catch (sendError) {

            //  出现 ajax 地址时，在此产生异常 。
            return Ajax.error(xhrObject, sendError);
        }

        // 同步时，火狐不会自动调用 onreadystatechange
        if (!xhrObject.async) {
            callback();
        } else if (xhr.readyState === 4) {
            // IE6/7： 如果存在缓存，需要手动执行回调函数。
            setTimeout(callback, 0);
        } else {

            // 绑定 onreadystatechange， 让 xhr 根据请求情况调用 callback。
            xhr.onreadystatechange = callback;

            // 监听超时功能。
            if (xhrObject.timeouts > 0) {
                setTimeout(function () {
                    callback('Timeout', -2);
                }, xhrObject.timeouts);
            }
        }

        // 发送完成。

    };
	
	/**
	 * 发送一个 get 请求。
	 * @method get
	 * @param {String} [url] 请求的地址。
	 * @param {Object} [data] 请求的数据。
	 * @param {String} [onsuccess] 请求成功时的回调。
	 * @param {String} [onerror] 请求失败时的回调。
	 * @param {String} dataType='text' 请求数据的类型。默认为 text。
	 */

	/**
	 * 发送一个 post 请求。
	 * @method post
	 * @param {String} [url] 请求的地址。
	 * @param {Object} [data] 请求的数据。
	 * @param {String} [onsuccess] 请求成功时的回调。
	 * @param {String} [onerror] 请求失败时的回调。
	 * @param {String} dataType='text' 请求数据的类型。默认为 text。
	 */

    Object.map("get post", function (type) {

        Ajax[type] = function (url, data, onsuccess, onerror, dataType) {
            if (typeof data == 'function') {
                dataType = onerror;
                onerror = onsuccess;
                onsuccess = data;
                data = null;
            }

            return Ajax.send({
                url: url,
                data: data,
                success: onsuccess,
                error: onerror,
                type: type,
                dataType: dataType
            });
        };

    });

    return Ajax;

})();



