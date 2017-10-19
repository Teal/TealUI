/**
 * @fileOverview 提供 Cookie 操作功能。
 * @author xuld
 */

// #region @getCookie

/**
 * 获取一个 Cookie 值。
 * @param {String} name 要获取的 Cookie 名字。
 * @returns {String} 返回对应的 Cookie 值。如果 Cookie 不存在则返回 @null。
 * @example getCookie("sample") // 如果 Cookie 不存在，返回 null 。
 */
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : null;
}

// #endregion

// #region @setCookie

/**
 * 设置或删除一个 Cookie 值。
 * @param {String} name 要设置的 Cookie 名字。
 * @param {String} value 要设置的 Cookie 值。如果设为 @null 则删除 Cookie。
 * @param {Object} [expires=365*24*60*60*10] Cookie 过期的秒数。如果设为 0 则立即过期。
 * @param {Object} [path] 设置 Cookie 的路径。
 * @param {Object} [domain] 设置 Cookie 的所在域。
 * @param {Object} [secure] 设置 Cookie 的安全限制。
 * @returns {String} 返回 @value。
 * @example
 * ##### 设置 Cookie
 * setCookie("sample", "the value")
 * 
 * ##### 删除 Cookie
 * setCookie("sample", null)
 */
function setCookie(name, value, expires, path, domain, secure) {
    var e = encodeURIComponent,
        updatedCookie = e(name) + "=" + e(value),
        t = new Date();
    t.setSeconds(t.getSeconds() + (value === null || expires <= 0 ? -1 : expires == undefined ? 365*24*60*60*10 : expires));
    updatedCookie += '; expires=' + t.toGMTString();

    if (path != undefined) updatedCookie += "; path=" + path;
    if (domain != undefined) updatedCookie += "; domain=" + domain;
    if (secure != undefined) updatedCookie += "; secure=" + secure;

    typeof console === "object" && console.assert(updatedCookie.length <= 4096, "setCookie(name, value, [expires], [path], [domain], [secure]): Cookie 过长（超过 4096 字节），可能导致 Cookie 写入失败");

    document.cookie = updatedCookie;
    return value;
}

// #endregion
