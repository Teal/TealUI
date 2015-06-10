/**
 * @fileOverview 让 C 类浏览器支持本地存储。
 * @author xuld
 */

// #require ../browser/cookie

var localStorage = localStorage || {

    getItem: function (name) {
        return getCookie(name);
    },

    setItem: function (name, value) {
        return setCookie(name, String(value));
    },

    removeItem: function (name) {
        setCookie(name, null);
    }

};
