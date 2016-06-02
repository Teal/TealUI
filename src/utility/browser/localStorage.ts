// #todo

/**
 * @fileOverview �� C ��������֧�ֱ��ش洢��
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("../browser/cookie");

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
