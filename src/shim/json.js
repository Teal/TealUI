/**
 * @fileOverview 为 C 类浏览器（IE6-7, FF2-3, SF3-4）提供 JSON 对象。
 * @author xuld
 */

/**
 * 提供解析 JSON 的函数。
 */
var JSON = JSON || {};

if (!JSON.stringify) {

    JSON.specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };

    JSON.replaceChars = function(chr){
        return JSON.specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    };

    JSON.stringify = function (obj) {
        switch (typeof obj) {
            case 'string':
                return '"' + obj.replace(/[\x00-\x1f\\"]/g, JSON.replaceChars) + '"';
            case 'object':
                if (obj) {
                    var s = [];
                    if (obj instanceof Array) {
                        for (var i = 0; i < obj.length; i++) {
                            s[i] = JSON.stringify(obj[i]);
                        }
                        return '[' + s + ']';
                    }

                    for (var key in obj) {
                        s.push(JSON.stringify(key) + ':' + JSON.stringify(obj[key]));
                    }
                    return '{' + s + '}';
                }
                // 直接转到 default
            default:
                return String(obj);
        }
    };

    JSON.parse = function (str) {
        return new Function('return ' + str)();
    };

}
