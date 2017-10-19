define(["require", "exports", "util/query"], function (require, exports, query_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 发送一个异步请求。
     * @param options 发送的选项。
     * @return 返回请求对象。
     */
    function ajax(options) {
        var r = new Ajax();
        Object.assign(r, options);
        if (r.data != undefined && !(r.data instanceof FormData)) {
            r.contentType = r.contentType || "application/x-www-form-urlencoded";
            if (typeof r.data === "object") {
                r.data = r.contentType === "application/json" && r.type !== "GET" ? JSON.stringify(r.data) : query_1.formatQuery(r.data);
            }
            if (r.type === "GET") {
                r.url = query_1.appendQuery(r.url, r.data);
                r.data = null;
            }
        }
        r.send();
        return r;
    }
    exports.default = ajax;
    /**
     * 表示一个异步请求。
     */
    var Ajax = /** @class */ (function () {
        function Ajax() {
            var _this = this;
            /**
             * 处理请求状态改变的回调函数。
             * @param data 数据。
             * @param internalError 如果是内置错误则值为内置错误码。
             */
            this.progress = function (data, internalError) {
                var xhr = _this.xhr;
                try {
                    // 仅当正在发送请求且请求已完成时继续执行。
                    if (!_this.sending || !internalError && xhr.readyState !== 4) {
                        return;
                    }
                    _this.sending = false;
                    // 删除 readystatechange 以避免有些浏览器的内存泄露。
                    xhr.onreadystatechange = null;
                    // 处理内置错误。
                    if (internalError) {
                        _this.status = internalError;
                        if (xhr.readyState !== 4) {
                            xhr.abort();
                        }
                    }
                    else if (checkStatus(_this.status = xhr.status)) {
                        try {
                            switch (_this.responseType) {
                                case undefined:
                                case "text":
                                    _this.response = xhr.responseText;
                                    break;
                                case "json":
                                    _this.response = JSON.parse(xhr.responseText);
                                    break;
                                case "document":
                                    _this.response = xhr.responseXML;
                                    break;
                                default:
                                    _this.response = xhr.response;
                                    break;
                            }
                            data = undefined;
                        }
                        catch (responseError) {
                            // 解析响应数据报错。
                            // IE6-9：请求二进制格式的文件报错。
                            _this.status = -6;
                            _this.response = undefined;
                            data = responseError;
                        }
                    }
                    else {
                        data = xhr.statusText;
                    }
                }
                catch (firefoxAccessError) {
                    _this.progress(firefoxAccessError, -5);
                    return;
                }
                // 触发回调。
                if (data === undefined) {
                    _this.success && _this.success(_this.response, _this);
                }
                else {
                    _this.error && _this.error(data, _this);
                }
                _this.complete && _this.complete(data, _this);
            };
        }
        /**
         * 获取响应头。
         * @param name 响应头。
         * @return 返回响应头数据。如果响应头不存在则返回 null。
         */
        Ajax.prototype.getResponseHeader = function (name) {
            return this.xhr && this.xhr.getResponseHeader(name);
        };
        /**
         * 发送请求。
         * @return 如果请求发送成功则返回 true，否则返回 false。
         */
        Ajax.prototype.send = function () {
            this.sending = true;
            var xhr = this.xhr = new XMLHttpRequest();
            try {
                xhr.open(this.type, this.url, true, this.username, this.password);
            }
            catch (ieOpenError) {
                // IE：地址错误时可能产生异常。
                this.progress(ieOpenError, -3);
                return false;
            }
            for (var header in this.headers) {
                try {
                    xhr.setRequestHeader(header, this.headers[header]);
                }
                catch (firefoxSetHeaderError) {
                    // FF：跨域时设置头可能产生异常。
                }
            }
            if (this.contentType) {
                try {
                    xhr.setRequestHeader("Content-Type", this.contentType);
                }
                catch (firefoxSetHeaderError) {
                    // FF：跨域时设置头可能产生异常。
                }
            }
            if (this.withCredentials) {
                xhr.withCredentials = true;
            }
            if (this.responseType && (this.responseType === "arraybuffer" || this.responseType === "blob")) {
                xhr.responseType = this.responseType;
            }
            try {
                xhr.onreadystatechange = this.progress;
                xhr.send(this.data);
            }
            catch (sendError) {
                // 地址错误时会产生异常。
                this.progress(sendError, -4);
                return false;
            }
            if (this.timeout >= 0) {
                setTimeout(this.progress, this.timeout, "Timeout", -2);
            }
            return true;
        };
        /**
         * 终止当前请求。
         */
        Ajax.prototype.abort = function () {
            this.progress("Aborted", -1);
        };
        return Ajax;
    }());
    exports.Ajax = Ajax;
    Ajax.prototype.type = "GET";
    Ajax.prototype.url = "";
    /**
     * 判断一个 HTTP 状态码是否表示正确响应。
     * @param status 要判断的状态码。
     * @return 如果正确则返回 true, 否则返回 false 。一般地，2xx、304、1223 被认为是正确的状态吗。
     */
    function checkStatus(status) {
        if (!status) {
            var protocol = window.location.protocol;
            // CH：status 在有些协议不存在。
            return protocol === "file:" || protocol === "chrome:" || protocol === "app:";
        }
        return status >= 200 && status < 300 || status === 304 || status === 1223;
    }
    exports.checkStatus = checkStatus;
});
//# sourceMappingURL=ajax.js.map