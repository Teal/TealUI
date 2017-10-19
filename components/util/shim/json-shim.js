/**
 * 提供解析 JSON 的函数。
 * @since ES5(IE6-7, FF2-3, SF3-4)
 */
JSON = this.JSON || {
    /**
     * 将对象格式化为字符串。
     * @return 返回字符串。
     * @example JSON.stringify([{}])
     */
    stringify: function (obj) {
        switch (typeof obj) {
            case "string":
                return "\"" + obj.replace(/[\x00-\x1f\\"]/g, function (chr) { return ({ "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" })[chr] || "\\u00" + Math.floor(chr.charCodeAt(0) / 16).toString(16) + (chr.charCodeAt(0) % 16).toString(16); }) + "\"";
            case "object":
                if (obj) {
                    var s = [];
                    if (obj instanceof Array) {
                        for (var i = 0; i < obj.length; i++) {
                            s[i] = JSON.stringify(obj[i]);
                        }
                        return "[" + s + "]";
                    }
                    for (var key in obj) {
                        s.push(JSON.stringify(key) + ":" + JSON.stringify(obj[key]));
                    }
                    return "{" + s + "}";
                }
            default:
                return String(obj);
        }
    },
    /**
     * 解析字符串为 JSON。
     * @return 返回 JSON 对象。
     * @example JSON.parse("[{}]")
     */
    parse: function (value) {
        return new Function("return (" + value + ")")();
    }
};
//# sourceMappingURL=json-shim.js.map