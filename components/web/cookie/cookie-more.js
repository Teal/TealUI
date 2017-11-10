define(["require", "exports", "./cookie", "util/query"], function (require, exports, cookie_1, query_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 获取所有 Cookie。
     * @return 返回包含所有 Cookie 的键值对。
     * @example getAllCookies()
     */
    function getAllCookies() {
        var r = {};
        document.cookie.replace(/(.+?)=(.+?)(;\s*|$)/g, function (_, cookieName, cookieValue) {
            r[decodeURIComponent(cookieName)] = decodeURIComponent(cookieValue);
            return "";
        });
        return r;
    }
    exports.getAllCookies = getAllCookies;
    /**
     * 获取指定的子 Cookie 值。
     * @param name Cookie 名。
     * @param subname 子 Cookie 名。
     * @return 返回对应的 Cookie 值。如果 Cookie 不存在则返回 null。
     * @example getSubcookie("sample", "child") // 如果不存在则返回 null。
     */
    function getSubcookie(name, subname) {
        var cookie = cookie_1.getCookie(name);
        return cookie == null ? cookie : query_1.getQuery(subname, "?" + cookie);
    }
    exports.getSubcookie = getSubcookie;
    /**
     * 设置或删除指定的子 Cookie 值。
     * @param name Cookie 名。
     * @param subname 子 Cookie 名。
     * @param value 要设置的 Cookie 值。如果设为 null 则删除子 Cookie。
     * @param expires Cookie 过期的秒数。
     * @param path 要设置的 Cookie 路径。
     * @param domain 要设置的 Cookie 所在域。
     * @param secure 要设置的 Cookie 安全限制。
     * @example setSubcookie("sample", "child", "the value") // 设置子 Cookie
     * @example setSubcookie("sample", "child", undefined) // 删除子 Cookie
     */
    function setSubcookie(name, subname, value, expires, path, domain, secure) {
        cookie_1.setCookie(name, query_1.setQuery(subname, value, "?" + (cookie_1.getCookie(name) || "")).slice(1) || undefined, expires, path, domain, secure);
    }
    exports.setSubcookie = setSubcookie;
});
//# sourceMappingURL=cookie-more.js.map