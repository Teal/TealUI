/**
 * @fileOverview 处理查询字符串。
 */

/**
 * 提供处理查询字符串的方法。
 * @class
 * @static
 */
var QueryString = {

    /**
     * 解析查询字符串为对象。
     * @param {String} value 要解析的字符串。
     * @returns {Object} 已解析的对象。
     */
    parse: function (value) {
        var result = {};
        if (value) {
            value = value.replace(/^\?/, "").replace(/\+/g, '%20').split('&');
            for (var i = 0; i < value.length; i++) {
                var t = value[i].indexOf('='),
                    key = t >= 0 ? value[i].substr(0, t) : value[i];
                    val = value[i].substr(key.length + 1);

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

    /**
     * 将指定对象格式化为字符串。
     * @param {Object} obj 要格式化的对象。
     * @returns {String} 已处理的字符串。
     */
    stringify: function (obj, name) {
        if (obj && typeof obj === 'object') {
            var s = [];
            for (var key in obj) {
                s.push(QueryString.stringify(obj[key], name || key));
            }
            obj = s.join('&');
        } else if (name) {
            obj = encodeURIComponent(name) + "=" + encodeURIComponent(obj);
        }
        return obj;
    },

    /**
     * 获取 URL 上的查询字符串部分。
     * @param {String} url 要获取的地址。
     */
    getQuery: function (url) {
        var p = url.indexOf('?');
        return p >= 0 ? QueryString.parse(url.substr(p + 1)) : {
        };
    },

    /**
     * 在指定地址追加一段查询字符串参数。
     * @param {String} url 要追加参数的地址。
     * @param {String} query 要查询的字符串参数。
     * @returns {String} 已添加的字符串。
     */
    append: function (/*String*/url, /*String?*/query) {
        if (query) {
            url = (url + '&' + query).replace(/[&?]{1,2}/, '?');
        }
        return url;
    }

};
