/**
 * @fileOverview 提供 Cookie 操作功能。
 * @author xuld@vip.qq.com
 */

// #region 基本功能

/**
 * 获取一个 Cookie 值。
 * @param name 要获取的 Cookie 名字。
 * @returns 返回对应的 Cookie 值。如果 Cookie 不存在则返回 @null。
 * @example getCookie("sample") // 如果 Cookie 不存在，返回 null 。
 */
export function getCookie(name: string) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : null;
}

/**
 * 设置或删除一个 Cookie 值。
 * @param name 要设置的 Cookie 名字。
 * @param value 要设置的 Cookie 值。如果设为 null 则删除 Cookie。
 * @param expires=365*24*60*60*10 Cookie 过期的秒数。如果设为 -1 表示永不过期。如果设为 0 则立即过期。
 * @param path 设置 Cookie 的路径。
 * @param domain 设置 Cookie 的所在域。
 * @param secure 设置 Cookie 的安全限制。
 * @returns 返回 *value*。
 * @example
 * ##### 设置 Cookie
 * setCookie("sample", "the value")
 * 
 * ##### 删除 Cookie
 * setCookie("sample", null)
 */
export function setCookie(name: string, value: string, expires: number, path: string, domain: string, secure: string) {
    let t = new Date();
    t.setSeconds(t.getSeconds() + (value === null || expires === 0 ? -1 : expires == null ? 365 * 24 * 60 * 60 * 10 : expires));

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + ';expires=' + t.toUTCString();

    if (path != null) updatedCookie += ";path=" + path;
    if (domain != null) updatedCookie += ";domain=" + domain;
    if (secure != null) updatedCookie += ";secure=" + secure;

    // #assert updatedCookie.length <= 4096, "Cookie 过长（超过 4096 字节），可能导致 Cookie 写入失败"

    document.cookie = updatedCookie;
    return value;
}

// #endregion

// #region 扩展功能

/**
 * 获取所有 Cookie 。
 * @returns 返回包含所有 Cookie 的键值对。
 * @example getAllCookies()
 */
function getAllCookies() {
    var cookies = {};
    document.cookie.replace(/(.+?)=(.+?)(;\s*|$)/g, (_: string, cookieName: string, cookieValue: string) => {
        cookies[decodeURIComponent(cookieName)] = decodeURIComponent(cookieValue);
        return "";
    });
    return cookies;
}

import {get} from "../text/queryString";

/**
 * 获取一个子 Cookie 值。
 * @param name 要获取的 Cookie 名字。
 * @param subname 要获取的子 Cookie 名字。
 * @returns 返回对应的 Cookie 值。如果 Cookie 不存在则返回 null。
 * @example getSubcookie("sample", "subName") // 如果 Cookie 不存在，返回 null 。
 */
function getSubcookie(name: string, subname: string) {
    return get(getCookie(name) || "", subname);
}

import {set} from "../text/queryString";

/**
 * 设置或删除一个子 Cookie 值。
 * @param name 要设置的 Cookie 名字。
 * @param subname 要设置的子 Cookie 名字。
 * @param value 要设置的 Cookie 值。如果设为 @null 则删除 Cookie。
 * @param expires=365*24*60*60*10 Cookie 过期的秒数。如果设为 0 则立即过期。
 * @param path 设置 Cookie 的路径。
 * @param domain 设置 Cookie 的所在域。
 * @param secure 设置 Cookie 的安全限制。
 * @returns {String} 返回 value。
 * @example
 * ##### 设置子 Cookie
 * setSubcookie("sample", "subName", "the value")
 * 
 * ##### 删除子 Cookie
 * setSubcookie("sample", "subName", null)
 */
function setSubcookie(name: string, subname: string, value: string, expires: number, path: string, domain: string, secure: string) {
    return setCookie(name, set("?" + (getCookie(name) || ""), subname, value).substr(1), expires, path, domain, secure);
}

// #endregion
