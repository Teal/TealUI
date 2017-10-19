define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 获取指定的 Cookie 值。
     * @param name Cookie 名。
     * @return 返回 Cookie 值。如果 Cookie 不存在则返回 null。
     * @example getCookie("sample") // 如果不存在则返回 null。
     */
    function getCookie(name) {
        var match = new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)").exec(document.cookie);
        return match ? decodeURIComponent(match[1]) : null;
    }
    exports.getCookie = getCookie;
    /**
     * 设置或删除指定的 Cookie 值。
     * @param name Cookie 名。
     * @param value 要设置的 Cookie 值。如果设为 null 则删除 Cookie。
     * @param expires Cookie 过期的秒数。
     * @param path 要设置的 Cookie 路径。
     * @param domain 要设置的 Cookie 所在域。
     * @param secure 要设置的 Cookie 安全限制。
     * @example setCookie("sample", "the value") // 设置 Cookie
     * @example setCookie("sample", null) // 删除 Cookie
     */
    function setCookie(name, value, expires, path, domain, secure) {
        if (expires === void 0) { expires = 365 * 24 * 60 * 60 * 10; }
        var date = new Date();
        date.setSeconds(date.getSeconds() + (value == null ? -1 : expires));
        var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ";expires=" + date.toUTCString();
        if (path != null)
            updatedCookie += ";path=" + path;
        if (domain != null)
            updatedCookie += ";domain=" + domain;
        if (secure != null)
            updatedCookie += ";secure=" + secure;
        document.cookie = updatedCookie;
    }
    exports.setCookie = setCookie;
});
//# sourceMappingURL=cookie.js.map