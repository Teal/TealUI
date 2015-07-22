/**
 * @author xuld
 */

// #require ../shim/html5
// #require ../text/queryString#QueryString.stringify

/**
 * 用于发送和接收 AJAX 请求的工具。
 */
var Ajax = {

    /**
     * 全局 Ajax 请求之前回调，可用于初始化指定配置项，如重写请求 URL。
     * @field init
     */

    /**
     * 所有支持的 MimeType。
     */
    accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',

        // #region @json

        json: 'application/json',

        // #endregion

        // #region @xml

        xml: 'application/xml, text/xml',

        // #endregion

        html: 'text/html',
        text: 'text/plain'
    },

    /**
     * 支持的数据解析器。
     */
    parsers: {

        /**
         * 获取文本格式数据。
         * @type {Object} options 要处理的原始 options。
         */
        text: function (options) {
            var responseText;
            try {
                responseText = options.xhr.responseText;
            } catch (ieResponseTextError) {
                // IE6-9：请求二进制格式的文件报错。
                responseText = '';
            }
            return options.responseText = responseText;
        },

        // #region @script

        /**
         * 执行 JavaScript 代码。
         * @type {Object} options 要处理的原始 options。
         */
        script: function (options) {
            var sourceCode = Ajax.parsers.text(options);
            window.execScript ? window.execScript(sourceCode) : window.eval(sourceCode);
        },

        // #endregion

        // #region @json

        /**
         * 获取 JSON 格式数据。
         * @type {Object} options 要处理的原始 options。
         */
        json: function (options) {
            return JSON.parse(Ajax.parsers.text(options));
        },

        // #endregion

        // #region @xml

        /**
         * 获取 XML 格式数据。
         * @type {Object} options 要处理的原始 options。
         */
        xml: function (options) {
            var xml = options.xhr.responseXML;
            return xml && xml.documentElement ? xml : null;
        }

        // #endregion

    },

    /**
     * 所有支持的传输协议集合。
     */
    transports: {

        // #region @text

        /**
         * 文本格式传输协议。
         */
        text: function (options, callback) {

            // headers['Accept']
            var headers = {
                Accept: options.dataType in Ajax.accepts ? Ajax.accepts[options.dataType] + ", *\u005c*; q=0.01" : "*\u005c*"
            }, xhr, key;

            // headers['Accept-Charset']
            if (options.charset) headers["Accept-Charset"] = value;

            // headers['Content-Type']
            if (options.data) headers['Content-Type'] = "application/x-www-form-urlencoded; charset=" + (options.charset || "UTF-8");
            if (options.contentType) headers['Content-Type'] = options.contentType;

            // headers['x-Requested-With']
            if (!options.crossDomain) headers['x-Requested-With'] = 'XMLHttpRequest';

            // 如果参数有 headers, 复制到当前 headers 。
            for (key in options.headers) headers[key] = options.headers[key];

            // 发送请求。

            // 请求对象。
            options.xhr = xhr = new XMLHttpRequest();

            // 统一执行回调。
            function done(errorText, errorCode) {

                try {

                    // 如果目前是成功状态且正在等待，则退出等待下次回调。
                    if (!xhr || (!errorCode && xhr.readyState !== 4)) return;

                    // 删除 readystatechange  。
                    xhr.onreadystatechange = null;

                    // 如果存在错误。
                    if (errorCode) {
                        // 如果是因为超时引发的，手动中止请求。
                        if (xhr.readyState !== 4) xhr.abort();
                    } else {

                        // 正确的状态码。
                        options.status = xhr.status;

                        // 如果跨域，火狐报错。
                        try {
                            options.statusText = xhr.statusText;
                        } catch (firefoxCrossDomainError) {
                            // 模拟 Webkit: 设为空字符串。
                            options.statusText = "";
                        }

                        // 检验状态码是否正确。
                        if (Ajax.checkStatus(options.status)) {

                            // 根据响应类型自动决定数据类型。
                            if (!options.dataType) {
                                errorText = (xhr.getResponseHeader("Content-Type") || "").toLowerCase();
                                for (key in Ajax.accepts) {
                                    if (errorText.indexOf(key) >= 0) {
                                        options.dataType = key;
                                        break;
                                    }
                                }
                            }

                            errorCode = 0;
                            try {
                                errorText = (Ajax.parsers[options.dataType] || Ajax.parsers.text)(options);
                            } catch (parseDataError) {
                                errorCode = 2;
                                errorText = parseDataError;
                            }

                        } else {
                            errorCode = 1;
                            errorText = options.status + ": " + options.statusText;
                        }

                    }

                    // 清空变量的引用。
                    xhr = null;

                } catch (firefoxAccessError) {
                    return done(firefoxAccessError, -1);
                }

                // 设置错误码。
                options.errorCode = errorCode;
                options.data = errorText;

                // 统一处理回调。
                callback(options);
            }

            // 调用用户自定义 Ajax 初始化回调。
            if (Ajax.init && Ajax.init(options) === false) return done('Cancelled', -3);

            try {
                options.username ? xhr.open(options.type, options.url, options.async, options.username, options.password) : xhr.open(options.type, options.url, options.async);
            } catch (ieOpenError) {
                //  出现错误地址时  ie 在此产生异常 。
                return done(ieOpenError, -1);
            }

            // 设置文件头。FF: 跨域时设置头会报错，因此需要 try..catch。
            for (key in headers)
                try {
                    xhr.setRequestHeader(key, headers[key]);
                } catch (firefoxSetHeaderError) { }

            // 进行真实的发送。

            try {
                xhr.send(options.data);
            } catch (sendError) {
                //  出现 ajax 地址时，在此产生异常 。
                return done(sendError, -1);
            }

            // 同步时，火狐不会自动调用 onreadystatechange
            if (!options.async) {
                done();
            } else if (xhr.readyState === 4) {
                // IE6/7： 如果存在缓存，需要手动执行回调函数。
                setTimeout(done, 0);
            } else {

                // 绑定 onreadystatechange， 让 xhr 根据请求情况调用 done。
                xhr.onreadystatechange = done;

                // 监听超时功能。
                if (options.timeout > 0) setTimeout(function () { done('Timeout', -2); }, options.timeout);
            }

            // 发送完成。

        },

        // #endregion

        // #region @script

        /**
         * 脚本格式传输协议。
         */
        script: function (options, callback) {

            // 加速请求。
            if (!options.crossDomain && Ajax.transports.text) {
                options.dataType = 'script';
                return Ajax.transports.text(options, callback);
            }

            var script = options.xhr = document.createElement('SCRIPT'), t;

            function done(eventText, errorCode) {
                if (script && (errorCode || !script.readyState || !/in/.test(script.readyState))) {

                    // 删除全部绑定的函数。
                    script.onerror = script.onload = script.onreadystatechange = null;

                    // 删除当前脚本。
                    script.parentNode.removeChild(script);

                    // 设置错误码。
                    options.errorCode = errorCode;
                    options.data = eventText;

                    callback(options);

                    // 清空对 script 的引用。
                    script = null;

                }
            };

            script.src = options.url;
            script.type = "text/javascript";
            if (options.async) script.async = "async";
            if (options.charset) script.charset = options.charset;

            script.onload = script.onreadystatechange = done;
            script.onerror = function (e) { done(e, 2); };

            if (options.timeout > 0) setTimeout(function () { done('Timeout', -2); }, options.timeout);

            t = document.getElementsByTagName("SCRIPT")[0];
            t.parentNode.insertBefore(script, t);

        },

        // #region @jsonp

        /**
         * 脚本远程执行格式传输协议。
         */
        jsonp: function (options, callback) {

            var jsonpCallback = "jsonp" + +new Date() + (Ajax._jsonpCounter = Ajax._jsonpCounter + 1 || 0),
                jsonpCallbackOverwritten = window[jsonpCallback],
                responseData;

            // jsonp
            if (options.jsonp == null) options.jsonp = 'done';

            // done=jsonp123
            if (options.jsonp) options.url = Ajax.appendQuerys(options.url, options.jsonp + "=" + jsonpCallback);

            // 插入 JSONP 回调。
            window[jsonpCallback] = function () {
                responseData = arguments;
            };

            // 最后使用 Script 协议发送。
            Ajax.transports.script(options, function () {

                // 未执行数据函数。
                if (!responseData) {
                    options.errorCode = 2;
                    options.data = new Error(jsonpCallback + ' was not called');
                }

                // 执行全部回调。
                callback(options);

                // 回复初始的 jsonpCallback 函数。
                if (jsonpCallbackOverwritten !== undefined) window[jsonpCallback] = jsonpCallbackOverwritten;
            });

        }

        // #endregion

        // #endregion

    },

    /**
     * 发送一个 AJAX 请求。
     * @param {Object} options 发送的配置。具体的值有：
     *
     * - async: 是否为异步的请求。默认为 true 。
     * - cache: 是否允许缓存。默认为 true 。
     * - charset: 请求的字符编码。
     * - complete(data): 请求完成时的回调。
     * - crossDomain: 指示 AJAX 强制使用跨域方式的请求。默认为 null,表示系统自动判断。
     * - data: 请求的数据。
     * - dataType: 请求数据的类型。默认为根据返回内容自动识别。
     * - error(message): 请求失败时的回调。
     * - headers: 附加的额外请求头信息。
     * - jsonp: 如果使用 jsonp 请求，则指示 jsonp 参数。如果设为 false，则不添加后缀。默认为 done。
     * - jsonpCallback: jsonp请求回调函数名。默认为根据当前时间戳自动生成。
     * - password: 请求的密码 。
     * - start(): 请求开始时的回调。return false 可以终止整个请求。
     * - success(data): 请求成功时的回调。
     * - timeout: 请求超时时间。单位毫秒。默认为 -1 无超时 。
     * - type: 请求类型。默认是 "GET" 。
     * - url: 请求的地址。请求的多个地址时可使用数组，所有请求完成后才触发回调。
     * - username: 请求的用户名 。
     * 
     * 响应时， options 将被追加以下参数：
     * 
     * - errorCode: 返回的错误码。-3：操作被取消；-2：请求超时；-1：其它内部错误；0：无错误；1：状态码错误；2：数据解析错误。
     * - status: 服务器返回的状态码。
     * - statusText: 服务器返回的状态文本。
     * - data: 如果有错误则返回错误信息，否则返回成功的数据。
     *
     * @returns options
     */
    send: function (options) {

        // url
        options.url = options.url || Ajax.getCurrentUrl();
        if (options.url.constructor === Array) {
            options.counter = options.url.length;

            // 将外部配置拷贝到子对象。
            for (var i = 0, url, key; url = options.url[i++];) {
                for (key in options) {
                    if (!(key in url) && !(key in { url: 1, success: 1, error: 1, complete: 1 })) {
                        url[i] = options[key];
                    }
                }

                url._callback = function () {
                    if (--options.counter < 1) {
                        var datas = [], funcName = 'success';
                        for (i = 0; url = options.url[i]; i++) {
                            datas[i] = url.data;
                            if (url.errorCode) funcName = 'error';
                        }
                        options[funcName] && options[funcName].apply(options, datas);
                        options.complete && options.complete.apply(options, datas);
                    }
                };

                Ajax.send(url);
            }
            return;
        }

        // url
        options.url = options.url.replace(/#.*$/, "");

        // type
        options.type = options.type ? options.type.toUpperCase() : 'GET';

        // data
        options.data = QueryString.stringify(options.data);
        if (options.data && options.type === 'GET') {
            options.url = Ajax.appendQuerys(options.url, options.data);
            options.data = null;
        }

        // cache
        if (options.cache !== true) options.url = Ajax.appendCacheQuery(options.url);

        // async
        options.async = options.async !== false;

        // crossDomain
        if (options.crossDomain == null) options.crossDomain = Ajax.isCrossDomain(options.url);

        // 调用用户自定义 Ajax 初始化回调。
        // 根据 dataType 获取当前用于传输的工具。实际的发送操作。
        if (!Ajax.init || Ajax.init(options) !== false) (Ajax.transports[options.dataType] || Ajax.transports.text)(options, Ajax.done);

        return options;
    },

    /**
     * 当 AJAX 完成后统一回调此接口。
     * @param {Object} options 发送的配置。
     */
    done: function (options) {
        var funcName = options.errorCode ? 'error' : 'success';
        options[funcName] && options[funcName](options.data);
        options.complete && options.complete(options.data);
        options._callback && options._callback();
        options.xhr = null;
    },

    /**
     * 获取当前页的地址。
     * @returns {String} 返回当前地址。
     */
    getCurrentUrl: function () {
        // 如果设置了 document.domain, IE 会抛出异常。
        try {
            return location.href;
        } catch (e) {
            // 使用 a 的默认属性获取当前地址。
            var ajaxLoc = document.createElement("a");
            ajaxLoc.href = "";
            return ajaxLoc.href;
        }
    },

    /**
     * 判断指定的地址是否跨域。
     * @param {String} url 要判断的地址。
     * @returns {String} 返回处理后的地址。
     */
    isCrossDomain: function (url) {
        var rUrl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
            locParts = rUrl.exec(Ajax.getCurrentUrl().toLowerCase()) || 0;
        url = rUrl.exec(url.toLowerCase());
        return !!url && (url[1] != locParts[1] || url[2] != locParts[2] || (url[3] || (url[1] === "http:" ? 80 : 443)) != (locParts[3] || (locParts[1] === "http:" ? 80 : 443)));
    },

    /**
     * 在指定地址添加参数以避免服务器端缓存。
     * @param {String} url 要处理的地址。
     * @param {String} param 要添加的参数。
     * @returns {String} 返回处理后的地址。
     */
    appendQuerys: function (url, param) {
        return param ? url + (url.indexOf('?') >= 0 ? '&' : '?') + param : url;
    },

    /**
     * 在指定地址添加参数以避免服务器端缓存。
     * @param {String} url 要处理的地址。
     * @returns {String} 返回处理后的地址。
     */
    appendCacheQuery: function (url) {
        // 不需要完美添加或删除功能。
        // return (/[?&]_=/.test(url) ? url : Ajax.appendQuerys(url, "_=")).replace(/([?&]_=)([^&]*)/, "$1" + +new Date);
        return Ajax.appendQuerys(url, "_=" + +new Date);
    },

    _request: function (options, url, data, onsuccess, onerror, dataType) {
        if ((data && data.constructor === Function) || (onsuccess && onsuccess.constructor == Function)) {
            dataType = onerror;
            onerror = onsuccess;
            onsuccess = data;
            data = null;
        }
        options.url = url;
        options.data = data;
        options.success = onsuccess;
        options.error = onerror;
        options.dataType = dataType;
        return Ajax.send(options);
    },

    // #region @text

    /**
     * 判断一个 HTTP 状态码是否表示正常响应。
     * @param {Number} status 要判断的状态码。
     * @returns {Boolean} 如果正常则返回true, 否则返回 false 。
     * @remark 一般地， 200、304、1223 被认为是正常的状态吗。
     */
    checkStatus: function (statusCode) {

        // 获取状态。
        if (!statusCode) {

            // 获取协议。
            var protocol = window.location.protocol;

            // 对谷歌浏览器, 在有些协议， status 不存在。
            return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
        }

        // 检查， 各浏览器支持不同。
        return (statusCode >= 200 && statusCode < 300) || statusCode == 304 || statusCode == 1223;
    },

    /**
     * 发送一个 GET 异步请求。
	 * @param {String} [url] 请求的地址。
	 * @param {Object} [data] 请求的数据。
	 * @param {String} [onsuccess] 请求成功时的回调。
	 * @param {String} [onerror] 请求失败时的回调。
	 * @param {String} dataType='text' 请求数据的类型。默认为 text。
     */
    get: function (url, data, onsuccess, onerror, dataType) {
        return Ajax._request({ type: 'GET' }, url, data, onsuccess, onerror, dataType);
    },

    /**
     * 发送一个 POST 异步请求。
	 * @param {String} [url] 请求的地址。
	 * @param {Object} [data] 请求的数据。
	 * @param {String} [onsuccess] 请求成功时的回调。
	 * @param {String} [onerror] 请求失败时的回调。
	 * @param {String} dataType='text' 请求数据的类型。默认为 text。
     */
    post: function (url, data, onsuccess, onerror, dataType) {
        return Ajax._request({ type: 'POST' }, url, data, onsuccess, onerror, dataType);
    },

    // #endregion

    // #region @jsonp

    /**
     * 快速发送一个 POST 异步请求。
	 * @param {String} [url] 请求的地址。
	 * @param {Object} [data] 请求的数据。
	 * @param {String} [onsuccess] 请求成功时的回调。
	 * @param {String} [onerror] 请求失败时的回调。
	 * @param {String} dataType='text' 请求数据的类型。默认为 text。
     */
    jsonp: function (url, data, onsuccess, onerror) {
        return Ajax._request({}, url, data, onsuccess, onerror, 'jsonp');
    }

    // #endregion

};
