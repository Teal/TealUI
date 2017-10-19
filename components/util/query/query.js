define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 解析查询字符串（如“foo=1&goo=2&goo=3”）为对象。
     * @param value 要解析的查询字符串。
     * @param separator 不同查询参数的分隔符。
     * @param equal 查询参数名和参数值的分隔符。
     * @return 返回一个以每个查询参数名作为键、查询参数值作为值的新对象。同名的参数对应的值是一个数组。
     * @example parseQuery("foo=1&goo=2&goo=3") // { foo: "1", goo: ["2", "3"] }
     */
    function parseQuery(value, separator, equal) {
        if (separator === void 0) { separator = "&"; }
        if (equal === void 0) { equal = "="; }
        var r = {};
        if (value) {
            for (var _i = 0, _a = value.split(separator); _i < _a.length; _i++) {
                var pair = _a[_i];
                var kv = pair.split(equal, 2);
                var key = decodeURIComponent(kv[0]);
                var value_1 = decodeURIComponent(kv[1]);
                var exist = r[key];
                if (Array.isArray(exist)) {
                    exist.push(value_1);
                }
                else if (typeof exist === "string") {
                    r[key] = [exist, value_1];
                }
                else {
                    r[key] = value_1;
                }
            }
        }
        return r;
    }
    exports.parseQuery = parseQuery;
    /**
     * 格式化对象为查询字符串（如“foo=1&goo=2&goo=3”）。
     * @param obj 要格式化的对象。
     * @param separator 不同查询参数的分隔符。
     * @param equal 查询参数名和参数值的分隔符。
     * @return 返回格式化后的字符串。
     * @example formatQuery({ a: "2", c: "4" }) // "a=2&c=4"
     * @example formatQuery({ a: [2, 4] }) // "a=2&a=4"
     */
    function formatQuery(obj, separator, equal) {
        if (separator === void 0) { separator = "&"; }
        if (equal === void 0) { equal = "="; }
        var parts = [];
        for (var key in obj) {
            var value = obj[key];
            if (Array.isArray(value)) {
                for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                    var item = value_2[_i];
                    parts.push("" + key + equal + encodeURIComponent(item));
                }
            }
            else {
                parts.push("" + key + equal + encodeURIComponent(value));
            }
        }
        return parts.join(separator);
    }
    exports.formatQuery = formatQuery;
    /**
     * 获取地址中指定的查询参数值。
     * @param name 查询参数名。
     * @param url 原地址。
     * @return 返回查询参数值。如果找不到则返回 null。
     * @example getQuery("foo", "?foo=1") // "1"
     * @example getQuery("goo", "?foo=1") // null
     */
    function getQuery(name, url) {
        if (url === void 0) { url = location.href; }
        var match = /\?([^#]*)/.exec(url);
        if (match) {
            match = new RegExp("(?:^|&)" + encodeURIComponent(name).replace(/([\-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^&]*)(?:&|$)", "i").exec(match[1]);
            if (match) {
                return decodeURIComponent(match[1]);
            }
        }
        return null;
    }
    exports.getQuery = getQuery;
    /**
     * 设置地址中指定的查询参数值。
     * @param name 查询参数名。
     * @param value 要设置的查询参数值。如果值为 null 则删除指定的查询参数。
     * @param url 原地址。
     * @return 返回设置后的新地址。如果原参数不存在则添加到末尾。
     * @example setQuery("foo", "1", "page.html") // "page.html?foo=1"
     * @example setQuery("foo", "2", "page.html?foo=1") // "page.html?foo=2"
     * @example setQuery("foo", null, "page.html") // "page.html"
     */
    function setQuery(name, value, url) {
        if (url === void 0) { url = location.href; }
        var match = /^(.*?)(\?.*?)?(#.*)?$/.exec(url);
        match[0] = "";
        if (value != null) {
            value = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        }
        if (match[2]) {
            match[2] = match[2].replace(new RegExp("([?&])" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\$1") + "(=[^&]*)?(&|$)"), function (source, left, oldValue, right) {
                source = value == null ? right && left : left + value + right;
                // 标记已解析过。
                value = null;
                return source;
            });
        }
        if (value != null) {
            match[2] = (match[2] ? match[2] === "?" ? "?" : match[2] + "&" : "?") + value;
        }
        return match.join("");
    }
    exports.setQuery = setQuery;
    /**
     * 在地址后添加请求参数。
     * @param url 地址。
     * @param query 要添加的请求参数，以查询字符串格式且不含“?”。
     * @return 返回已添加的新地址。
     * @example appendQuery("index.html", "from=link") // "index.html?from=link"
     */
    function appendQuery(url, query) {
        return query != null ? url + (url.indexOf("?") >= 0 ? "&" : "?") + query : url;
    }
    exports.appendQuery = appendQuery;
});
//# sourceMappingURL=query.js.map