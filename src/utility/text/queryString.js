/**
 * @author xuld
 * @fileOverview 处理查询字符串。
 */

/**
 * 提供处理查询字符串的方法。
 */
var QueryString = {

    // #region @QueryString.parse

    /**
     * 解析查询字符串为对象。
     * @param {String} str 要解析的字符串。
     * @returns {Object} 返回解析后的对象。
     * @example QueryString.parse("a=1&b=3") // {a: 1, b:3}
     */
    parse: function (str) {
        var result = {};
        if (str) {
            typeof console === "object" && console.assert(typeof str === "string", "QueryString.parse(str: 必须是字符串)");
            str = str.replace(/^\?/, "").replace(/\+/g, '%20').split('&');
            for (var i = 0; i < str.length; i++) {
                var t = str[i].indexOf('='),
                    key = t >= 0 ? str[i].substr(0, t) : str[i];
                val = str[i].substr(key.length + 1);

                try {
                    key = decodeURIComponent(key);
                } catch (e) {
                }

                try {
                    val = decodeURIComponent(val);
                } catch (e) {
                }

                if (result.hasOwnProperty(key)) {
                    if (result[key].constructor === String) {
                        result[key] = [result[key], val];
                    } else {
                        result[key].push(val);
                    }
                } else {
                    result[key] = val;
                }
            }
        }
        return result;
    },

    // #endregion

    // #region @QueryString.stringify

    /**
     * 将指定对象格式化为字符串。
     * @param {Object} obj 要格式化的对象。
     * @returns {String} 返回格式化后的字符串。
     * @example QueryString.stringify({ a: "2", c: "4" }) // "a=2&c=4"
     */
    stringify: function (obj, name) {
        if (obj && typeof obj === 'object') {
            var s = [], key;
            for (key in obj) {
                s.push(QueryString.stringify(obj[key], name || key));
            }
            obj = s.join('&');
        } else if (name) {
            obj = encodeURIComponent(name) + "=" + encodeURIComponent(obj);
        }
        return obj;
    }

    // #endregion

};
