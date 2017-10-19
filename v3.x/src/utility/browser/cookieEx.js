/**
 * @fileOverview 获取所有 Cookie 和支持和传统 ASP 兼容的子 Cookie 功能。
 * @author xuld
 */

typeof include === "function" && include("cookie
");
typeof include === "function" && include("../text/queryString
");

// #region @getAllCookies

/**
 * 获取所有 Cookie 。
 * @returns {Object} 返回包含所有 Cookie 的键值对。
 * @example getAllCookies()
 */
function getAllCookies() {
    var cookies = {};
    document.cookie.replace(/(.+?)=(.+?)(;\s*|$)/g, function (_, cookieName, cookieValue) {
        cookies[decodeURIComponent(cookieName)] = decodeURIComponent(cookieValue);
    });
    return cookies;
}

// #endregion

// #region @subCookie

/**
 * 获取一个子 Cookie 值。
 * @param {String} name 要获取的 Cookie 名字。
 * @param {String} name 要获取的子 Cookie 名字。
 * @returns {String} 返回对应的 Cookie 值。如果 Cookie 不存在则返回 null。
 * @example getSubcookie("sample", "subName") // 如果 Cookie 不存在，返回 null 。
 */
function getSubcookie(name, subname) {
    var cookie = getCookie(name);
    if (!cookie) {
        return null;
    }

    cookie = QueryString.parse(cookie);
    return subname === undefined ? cookie : subname in cookie ? cookie[subname] : null;
}

// #region @setSubCookie

/**
 * 设置或删除一个子 Cookie 值。
 * @param {String} name 要设置的 Cookie 名字。
 * @param {String} subname 要设置的子 Cookie 名字。
 * @param {String} value 要设置的 Cookie 值。如果设为 @null 则删除 Cookie。
 * @param {Object} [expires=365*24*60*60*10] Cookie 过期的秒数。如果设为 0 则立即过期。
 * @param {Object} [path] 设置 Cookie 的路径。
 * @param {Object} [domain] 设置 Cookie 的所在域。
 * @param {Object} [secure] 设置 Cookie 的安全限制。
 * @returns {String} 返回 value。
 * @example
 * ##### 设置子 Cookie
 * setSubcookie("sample", "subName", "the value")
 * 
 * ##### 删除子 Cookie
 * setSubcookie("sample", "subName", null)
 */
function setSubcookie(name, subname, value, expires, path, domain, secure) {
    var cookie = getSubcookie(name);
    if (value !== null) {
        cookie = cookie || {};
        cookie[subname] = value;
    } else if (cookie) {
        delete cookie[subname];
        for (subname in cookie) {
            subname = null;
            break;
        }
        if (subname) {
            cookie = null;
        }
    }
    setCookie(name, cookie === null ? cookie : QueryString.stringify(cookie), expires, path, domain, secure);
    return value;
}

// #endregion

// #endregion
