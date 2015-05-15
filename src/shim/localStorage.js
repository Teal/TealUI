/**
 * @author xuld
 */

// #require cookie.js

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
