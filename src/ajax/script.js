/**
 * AJAX 传输 JavaScript 。
 * @author xuld
 */

//#include ajax/base.js

Ajax.accepts.script = "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript";

Ajax.dataParsers.script = function (xhrObject) {
    window.execScript(this.text(xhrObject));
};

Ajax.transports.script = function (xhrObject, parseData, done) {
    if (!xhrObject.crossDomain) {
        return Ajax.transports.text(xhrObject, parseData && function (xhrObject) {
            this.script(xhrObject);
            return parseData(xhrObject);
        }, done);
    }

    var script, t, callback;

    xhrObject.type = "GET";

    // cache
    if (xhrObject.cache !== false) {
        xhrObject.cache = false;

        xhrObject.url = Ajax.addCachePostfix(xhrObject.url);
    }

    // data
    if (xhrObject.data) {
        xhrObject.url = Ajax.concatUrl(xhrObject.url, xhrObject.data);
        xhrObject.data = null;
    }

    xhrObject.xhr = script = document.createElement('SCRIPT');

    xhrObject.owner.callback = callback = function (eventArgs, error) {
        var script = xhrObject.xhr;
        if (script && (error || !script.readyState || !/in/.test(script.readyState))) {

            // 删除 callback 避免再次执行。
            xhrObject.owner.callback = Function.empty;

            // 删除全部绑定的函数。
            script.onerror = script.onload = script.onreadystatechange = null;

            // 删除当前脚本。
            script.parentNode.removeChild(script);

            // 清空对 script 的引用。
            script = null;

            // 执行全部回调。
            if (error) {
                Ajax.done(xhrObject, error, error, "", eventArgs, done);
            } else {
                Ajax.done(xhrObject, 0, 200, "OK", parseData || Function.empty, done);
            }

        }
    };

    script.src = xhrObject.url;
    script.type = "text/javascript";
    script.async = "async";
    if (xhrObject.charset)
        script.charset = xhrObject.charset;

    // 预处理数据。
    if (xhrObject.start && xhrObject.start.call(xhrObject.owner, xhrObject.data, xhrObject) === false)
        return callback('Prevented', -3);

    script.onload = script.onreadystatechange = callback;

    script.onerror = function (e) {
        callback('Script Execute Error', 2);
    };

    if (xhrObject.timeouts > 0) {
        setTimeout(function () {
            callback('Timeout', -2);
        }, xhrObject.timeouts);
    }

    t = document.getElementsByTagName("SCRIPT")[0];
    t.parentNode.insertBefore(script, t);
};
