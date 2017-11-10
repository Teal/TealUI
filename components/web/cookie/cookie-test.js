define(["require", "exports", "assert", "./cookie", "./cookie-more"], function (require, exports, assert, cookie, cookieMore) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getCookieAndSetCookieTest() {
        cookie.setCookie("_test", "foo");
        assert.equal(cookie.getCookie("_test"), "foo");
        cookie.setCookie("_test", null);
        assert.equal(cookie.getCookie("_test"), undefined);
    }
    exports.getCookieAndSetCookieTest = getCookieAndSetCookieTest;
    function getSubcookieAndSetSubcookieTest() {
        cookieMore.setSubcookie("_test", "_filed", "foo");
        assert.equal(cookieMore.getSubcookie("_test", "_filed"), "foo");
        cookieMore.setSubcookie("_test", "_filed", null);
        assert.equal(cookieMore.getSubcookie("_test", "_filed"), undefined);
    }
    exports.getSubcookieAndSetSubcookieTest = getSubcookieAndSetSubcookieTest;
});
//# sourceMappingURL=cookie-test.js.map