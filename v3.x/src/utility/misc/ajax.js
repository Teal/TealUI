/**
 * @author xuld
 */

typeof include === "function" && include("../lang/html5");
typeof include === "function" && include("../text/queryString#QueryString.stringify");

/**
 * 表示一个 Ajax 请求。
 * @param {Object} options 发送的配置。具体见`Ajax.send`。
 * @class
 * @inner
 */
function Ajax(options) {

    // 复制用户传递的配置。
    var me = this;
    for (var key in options) {
        me[key] = options[key];
    }

    // 支持同时发送多个请求。
    if (me.url && me.url.constructor === Array) {
        me.dataType = 'subAjax';
    } else {

        // url
        me.url = me.url ? me.url.replace(/#.*$/, "") : Ajax.getCurrentUrl();

        // type
        me.type = me.type ? me.type.toUpperCase() : 'GET';

        // data
        me.data = QueryString.stringify(me.data);
        if (me.data && me.type === 'GET') {
            me.url = Ajax.appendQuery(me.url, me.data);
            me.data = null;
        }

        // async
        me.async = me.async !== false;

        // crossDomain
        if (me.crossDomain == null) {
            me.crossDomain = Ajax.isCrossDomain(me.url);
        }

    }

}

Ajax.prototype = {

    constructor: Ajax,

    /**
     * 发送当前的请求。
     */
    send: function () {

        var me = this;

        // 调用用户自定义 Ajax 初始化回调。
        // 根据 dataType 获取当前用于传输的工具。实际的发送操作。
        (!Ajax.init || Ajax.init(me) !== false) &&
        (!me.start || me.start() !== false) &&
        (Ajax.transports[me.dataType] || Ajax.transports.text)(me, Ajax.done) !== false &&
        (me.timeout > 0 && me.done && setTimeout(function () {
            me.done('Timeout', -2);
        }, me.timeout));

        return me;

    },

    /**
     * 当被子类重写时，负责终止当前请求。
     */
    abort: function () {
        this.done && this.done('Aborted', -1);
    }

};

/**
 * 获取当前页的地址。
 * @returns {String} 返回当前地址。
 * @inner
 */
Ajax.getCurrentUrl = function () {
    // 如果设置了 document.domain, IE 会抛出异常。
    try {
        return location.href;
    } catch (e) {
        // 使用 a 的默认属性获取当前地址。
        var ajaxLoc = document.createElement("a");
        ajaxLoc.href = "";
        return ajaxLoc.href;
    }
};

/**
 * 判断指定的地址是否跨域。
 * @param {String} url 要判断的地址。
 * @returns {String} 返回处理后的地址。
 * @inner
 */
Ajax.isCrossDomain = function (url) {
    typeof console === "object" && console.assert(typeof url === "string", "Ajax.isCrossDomain(url: 必须是字符串)");
    var rUrl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        locParts = rUrl.exec(Ajax.getCurrentUrl().toLowerCase()) || 0;
    url = rUrl.exec(url.toLowerCase());
    return !!url && (url[1] != locParts[1] || url[2] != locParts[2] || (url[3] || (url[1] === "http:" ? 80 : 443)) != (locParts[3] || (locParts[1] === "http:" ? 80 : 443)));
};

/**
 * 在指定地址添加参数以避免服务器端缓存。
 * @param {String} url 要处理的地址。
 * @param {String} param 要添加的参数。
 * @returns {String} 返回处理后的地址。
 * @inner
 */
Ajax.appendQuery = function (url, param) {
    typeof console === "object" && console.assert(typeof url === "string", "Ajax.appendQuery(url: 必须是字符串, [param])");
    return param ? url + (url.indexOf('?') >= 0 ? '&' : '?') + param : url;
};

/**
 * 在指定地址添加参数以避免服务器端缓存。
 * @param {String} url 要处理的地址。
 * @returns {String} 返回处理后的地址。
 * @inner
 */
Ajax.appendCacheQuery = function (url) {
    // 不需要完美添加或删除功能。
    // return (/[?&]_=/.test(url) ? url : Ajax.appendQuery(url, "_=")).replace(/([?&]_=)([^&]*)/, "$1" + +new Date);
    return Ajax.appendQuery(url, "_=" + +new Date);
};

/**
 * 所有支持的 MimeType。
 * @inner
 */
Ajax.accepts = {
    script: 'text/javascript, application/javascript, application/x-javascript',

    // #region @json

    json: 'application/json',

    // #endregion

    // #region @xml

    xml: 'application/xml, text/xml',

    // #endregion

    html: 'text/html',
    text: 'text/plain'
};

/**
 * 支持的数据解析器。
 * @inner
 */
Ajax.parsers = {

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

};

/**
 * 所有支持的传输协议集合。
 * @inner
 */
Ajax.transports = {

    // #region @text

    /**
     * 文本格式传输协议。
     */
    text: function (ajax, callback) {

        // #region 生成请求头

        // headers['Accept']
        var headers = {
            Accept: ajax.dataType in Ajax.accepts ? Ajax.accepts[ajax.dataType] + ", *\u005c*; q=0.01" : "*\u005c*"
        };

        // headers['Accept-Charset']
        if (ajax.charset) {
            headers["Accept-Charset"] = value;
        }

        // headers['Content-Type']
        if (ajax.data) {
            headers['Content-Type'] = "application/x-www-form-urlencoded; charset=" + (ajax.charset || "UTF-8");
        }

        if (ajax.contentType) {
            headers['Content-Type'] = ajax.contentType;
        }

        // headers['x-Requested-With']
        if (!ajax.crossDomain) {
            headers['x-Requested-With'] = 'XMLHttpRequest';
        }

        // 如果参数有 headers, 复制到当前 headers 。
        for (var key in ajax.headers) {
            headers[key] = ajax.headers[key];
        }

        // #endregion

        // #region 发送请求

        // 生成请求地址。
        var url = ajax.url;
        if (ajax.cache !== true) {
            url = Ajax.appendCacheQuery(url);
        }

        // 请求对象。
        var xhr = ajax.xhr = new XMLHttpRequest();

        // 统一执行回调。
        var done = ajax.done = function (response, errorCode) {

            try {

                // 如果目前是成功状态且正在等待，则退出等待下次回调。
                if (!xhr || (!errorCode && xhr.readyState !== 4)) return;

                // 删除 readystatechange  。
                xhr.onreadystatechange = null;

                // 如果存在错误。
                if (errorCode) {
                    // 如果是因为超时引发的，手动中止请求。
                    if (xhr.readyState !== 4) {
                        xhr.abort();
                    }
                } else {

                    // 正确的状态码。
                    ajax.status = xhr.status;

                    // 如果跨域，火狐报错。
                    try {
                        ajax.statusText = xhr.statusText;
                    } catch (firefoxCrossDomainError) {
                        // 模拟 Webkit: 设为空字符串。
                        ajax.statusText = "";
                    }

                    // 检验状态码是否正确。
                    if (Ajax.checkStatus(ajax.status)) {

                        // 根据响应类型自动决定数据类型。
                        if (!ajax.dataType) {
                            response = (xhr.getResponseHeader("Content-Type") || "").toLowerCase();
                            for (key in Ajax.accepts) {
                                if (response.indexOf(key) >= 0) {
                                    ajax.dataType = key;
                                    break;
                                }
                            }
                        }

                        errorCode = 0;
                        try {
                            response = (Ajax.parsers[ajax.dataType] || Ajax.parsers.text)(ajax);
                        } catch (parseDataError) {
                            errorCode = 2;
                            response = parseDataError;
                        }

                    } else {
                        errorCode = 1;
                        response = ajax.status + ": " + ajax.statusText;
                    }

                }

                // 清空变量的引用。
                xhr = null;

            } catch (firefoxAccessError) {
                return ajax.done(firefoxAccessError, -5);
            }

            // 设置错误码。
            ajax.errorCode = errorCode;
            ajax.response = response;

            // 统一处理回调。
            callback(ajax);
        }

        try {
            ajax.username ? xhr.open(ajax.type, url, ajax.async, ajax.username, ajax.password) : xhr.open(ajax.type, url, ajax.async);
        } catch (ieOpenError) {
            // IE: 地址错误时产生异常。
            done(ieOpenError, -3);
            return false;
        }

        // 设置文件头。
        for (var key in headers) {
            try {
                xhr.setRequestHeader(key, headers[key]);
            } catch (firefoxSetHeaderError) {
                // FF: 跨域时设置头产生异常。
            }
        }

        // 开始发送。
        try {
            xhr.send(ajax.data);
        } catch (sendError) {
            // 地址错误时产生异常 。
            done(sendError, -4);
            return false;
        }

        // 同步时，火狐不会自动调用 onreadystatechange
        if (!ajax.async) {
            done();
            return false;
        }

        // IE6/7：如果存在缓存，需要手动执行回调函数。
        if (xhr.readyState === 4) {
            setTimeout(done, 0);
            return false;
        }

        // 绑定 onreadystatechange， 让 xhr 根据请求情况调用 done。
        xhr.onreadystatechange = done;

        // #endregion

    },

    // #endregion

    // #region @script

    /**
     * 脚本格式传输协议。
     */
    script: function (ajax, callback) {

        // 如果未跨域则使用 AJAX 加速请求。
        if (!ajax.crossDomain && Ajax.transports.text) {
            ajax.dataType = 'script';
            return Ajax.transports.text(ajax, callback);
        }

        // 生成请求地址。
        var url = ajax.url;
        if (ajax.cache !== true) {
            url = Ajax.appendCacheQuery(url);
        }

        var script = ajax.xhr = document.createElement('SCRIPT');

        ajax.done = function (response, errorCode) {
            if (script && (errorCode || !script.readyState || !/in/.test(script.readyState))) {

                // 删除全部绑定的函数。
                script.onerror = script.onload = script.onreadystatechange = null;

                // 删除当前脚本。
                script.parentNode.removeChild(script);

                // 设置错误码。
                ajax.errorCode = errorCode;
                ajax.response = response;

                callback(ajax);

                // 清空对 script 的引用。
                script = null;

            }
        };

        script.src = url;
        script.type = "text/javascript";
        if (ajax.async) {
            script.async = "async";
        }
        if (ajax.charset) {
            script.charset = ajax.charset;
        }
        script.onload = script.onreadystatechange = Ajax.done;
        script.onerror = function (e) { Ajax.done(e, 2); };

        var t = document.getElementsByTagName("SCRIPT")[0];
        t.parentNode.insertBefore(script, t);

    },

    // #region @jsonp

    /**
     * 脚本远程执行格式传输协议。
     */
    jsonp: function (ajax, callback) {
        
        var jsonpCallback = "jsonp" + +new Date() + (Ajax._jsonpCounter = Ajax._jsonpCounter + 1 || 0),
            jsonpCallbackOverwritten = window[jsonpCallback],
            responseData;

        // jsonp
        if (ajax.jsonp == null) {
            ajax.jsonp = "callback";
        }

        // callback=jsonp123
        if (ajax.jsonp) {
            ajax.url = Ajax.appendQuery(ajax.url, ajax.jsonp + "=" + jsonpCallback);
            // 由于已经加入了用于避免缓存的后缀，强制禁止缓存。
            ajax.cache = false;
        }

        // 插入 JSONP 回调。
        window[jsonpCallback] = function () {
            responseData = arguments;
        };

        // 最后使用 Script 协议发送。
        return Ajax.transports.script(ajax, function () {

            // 未执行数据函数。
            if (!responseData) {
                ajax.errorCode = 2;
                ajax.response = new Error(jsonpCallback + ' was not called');
            }

            // 执行全部回调。
            callback(ajax);

            // 回复初始的 jsonpCallback 函数。
            if (jsonpCallbackOverwritten !== undefined) window[jsonpCallback] = jsonpCallbackOverwritten;
        });

    },

    // #endregion

    // #endregion

    /**
     * 多个外部 AJAX 请求组成。
     */
    subAjax: function (ajax) {
        ajax.url = ajax.url.slice(0);
        ajax.counter = ajax.url.length;
        ajax.done = function () {
            if (--ajax.counter < 1) {
                var responses = ajax.responses = [], funcName = 'success';
                for (var i = 0; i < ajax.url.length; i++) {
                    responses[i] = ajax.url[i].response;
                    if (ajax.url[i].errorCode) {
                        funcName = 'error';
                    }
                }
                ajax[funcName] && ajax[funcName].apply(ajax, responses);
                ajax.complete && ajax.complete.apply(ajax, responses);
            }
        };

        // 为每个请求创建独立的 AJAX 对象。
        for (var i = 0; i < ajax.url.length; i++) {

            // 创建子 AJAX 对象。
            var subAjax = ajax.url[i] = new Ajax(ajax.url[i]);
            subAjax.parent = ajax;

            // 拷贝主对象配置到子对象。
            for (var key in ajax) {
                if (!(key in subAjax) && !(key in { url: 1, dataType: 1, start: 1, success: 1, error: 1, complete: 1 })) {
                    subAjax[key] = ajax[key];
                }
            }

            subAjax.send();
        }

        return false;

    }

};

/**
 * 发送一个 AJAX 请求。
 * @param {Object} options 发送的配置。支持的值有：
 * 
 * * @param {Boolean} [async=true] 是否为异步的请求。
 * * @param {Boolean} [cache=true] 是否允许缓存。
 * * @param {String} [charset=true] 请求的字符编码。
 * * @param {Function} [complete] 请求完成时的回调。回调参数为请求的数据或发生的错误。
 * * @param {Boolean} [crossDomain] 指示 AJAX 强制使用跨域方式的请求。如未指定则自动判断。
 * * @param {Object} [data] 请求的数据。
 * * @param {String} [dataType] 请求数据的类型。可选的值有：`"text"/"script"/"html"/"xml"/"json"/"jsonp"`。如未指定则自动判断。
 * * @param {Function} [error] 请求失败时的回调。回调参数为发生的错误。
 * * @param {Object} [headers] 附加的额外请求头信息。
 * * @param {String} [jsonp] 如果使用 jsonp 请求，则指示 jsonp 参数名。如果设为 @false，则不添加 jsonp 参数。
 * * @param {Boolean} [jsonpCallback] jsonp 请求回调函数名。如未指定则根据当前时间戳自动生成。
 * * @param {String} [password] 请求的密码。
 * * @param {Function} [start] 请求开始时的回调。
 * * @param {Function} [success] 请求成功时的回调。参数为请求的数据。
 * * @param {Number} [timeout=-1] 请求超时毫秒数。-1 表示不设超时。
 * * @param {mixed} [type="GET"] 请求类型。
 * * @param {String} [url] 请求的地址。请求的多个地址时可使用error: error数组，这时所有请求完成后才触发回调。如未指定则使用当前页面。
 * * @param {String} [username] 请求的用户名。
 * 
 * 响应时， options 将被追加以下参数：
 * 
 * * @param {Number} errorCode 返回的错误码。0： 无错误；-1：状态码错误；2：数据解析错误。-1：操作被取消；-2：请求超时；-3...-6：其它内部错误。
 * * @param {Number} status 服务器返回的状态码。
 * * @param {Number} statusText 服务器返回的状态文本。
 * * @param {Object} response 如果有错误则返回错误信息，否则返回请求的数据。
 *
 * @returns {Ajax} 返回新创建的 Ajax 对象。
 * @example 
 * Ajax.send({
 *       url: "../../../assets/resources/ajax/test.txt", 
 *       success:function(data){
 *           alert(data)
 *       }
 * });
 * 
 * ##### 同时发送多个请求统一回调
 * Ajax.send({
 *      url: [{
 *          url: "../../../assets/resources/ajax/test.txt"
 *      }, {
 *          url: "../../../assets/resources/ajax/test.txt"
 *      }], 
 *      success:function(data1, data2){
 *          alert(data1 + data2)
 *      }
 * });
 */
Ajax.send = function (options, url, data, onsuccess, onerror, dataType) {
    typeof console === "object" && console.assert(options != null, "Ajax.send(options: 不能为空, [url], [data], [onsuccess], [onerror], [dataType])");
    // 支持直接传递相关参数以发起请求。
    if (options.constructor === String) {

        // 填充 data 参数。
        if (data instanceof Function) {
            dataType = dataType || onerror;
            onerror = onsuccess;
            onsuccess = data;
            data = null;
        }

        options = {
            type: options,
            url: url,
            data: data,
            dataType: dataType,
            success: onsuccess,
            error: onerror
        };
    }

    typeof console === "object" && console.assert(!options.start || options.start instanceof Function, "Ajax.send(options: start 必须是函数, [url], [data], [onsuccess], [onerror], [dataType])");
    typeof console === "object" && console.assert(!options.error || options.error instanceof Function, "Ajax.send(options: error 必须是函数, [url], [data], [onsuccess], [onerror], [dataType])");
    typeof console === "object" && console.assert(!options.success || options.success instanceof Function, "Ajax.send(options: success 必须是函数, [url], [data], [onsuccess], [onerror], [dataType])");
    typeof console === "object" && console.assert(!options.complete || options.complete instanceof Function, "Ajax.send(options: complete 必须是函数, [url], [data], [onsuccess], [onerror], [dataType])");
    return new Ajax(options).send();

};

/**
 * 全局 Ajax 请求之前的回调，可用于初始化指定配置项，如重写请求 URL。
 * @memberOf Ajax
 * @field init
 * @type Function
 * @example Ajax.init = function(options){ options.url = options.url.replace("~/", "http://api.domain.com");  }
 */

/**
 * 当 AJAX 完成后统一回调此接口。
 * @param {Object} options 发送的配置。
 * @inner
 */
Ajax.done = function (ajax) {
    var funcName = ajax.errorCode ? 'error' : 'success';
    ajax[funcName] && ajax[funcName](ajax.response);
    ajax.complete && ajax.complete(ajax.response);
    ajax.parent && ajax.parent.done();
    ajax.xhr = ajax.done = null;
};

// #region @text

/**
 * 判断一个 HTTP 状态码是否表示正常响应。
 * @param {Number} status 要判断的状态码。
 * @returns {Boolean} 如果正常则返回true, 否则返回 false 。
 * @remark 一般地， 200、304、1223 被认为是正常的状态吗。
 * @inner
 */
Ajax.checkStatus = function (statusCode) {

    // 获取状态。
    if (!statusCode) {

        // 获取协议。
        var protocol = window.location.protocol;

        // 对谷歌浏览器, 在有些协议， status 不存在。
        return (protocol == "file: " || protocol == "chrome: " || protocol == "app: ");
    }

    // 检查， 各浏览器支持不同。
    return (statusCode >= 200 && statusCode < 300) || statusCode == 304 || statusCode == 1223;
};

/**
 * 发送一个 GET 异步请求。
 * @param {String} [url] 请求的地址。
 * @param {Object} [data] 请求的数据。
 * @param {String} [onsuccess] 请求成功时的回调。
 * @param {String} [onerror] 请求失败时的回调。
 * @param {String} [dataType='text'] 请求数据的类型。
 * @returns {Object} 返回请求对象。
 * @example Ajax.get("../../../assets/resources/ajax/test.txt", function(data){alert(data)})
 */
Ajax.get = function (url, data, onsuccess, onerror, dataType) {
    return Ajax.send('GET', url, data, onsuccess, onerror, dataType);
};

/**
 * 发送一个 POST 异步请求。
 * @param {String} [url] 请求的地址。
 * @param {Object} [data] 请求的数据。
 * @param {String} [onsuccess] 请求成功时的回调。
 * @param {String} [onerror] 请求失败时的回调。
 * @param {String} [dataType='text'] 请求数据的类型。
 * @returns {Object} 返回请求对象。
 * @example Ajax.post("../../../assets/resources/ajax/test.txt", function(data){alert(data)})
 */
Ajax.post = function (url, data, onsuccess, onerror, dataType) {
    return Ajax.send('POST', url, data, onsuccess, onerror, dataType);
};

// #endregion

// #region @jsonp

/**
 * 快速发送一个 POST 异步请求。
 * @param {String} [url] 请求的地址。
 * @param {Object} [data] 请求的数据。
 * @param {String} [onsuccess] 请求成功时的回调。
 * @param {String} [onerror] 请求失败时的回调。
 * @returns {Object} 返回请求对象。
 * @example Ajax.jsonp("../../../assets/resources/ajax/jsonp.js", function(data){alert(data)})
 */
Ajax.jsonp = function (url, data, onsuccess, onerror) {
    return Ajax.send('', url, data, onsuccess, onerror, 'jsonp');
};

// #endregion
