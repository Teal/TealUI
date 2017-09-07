import { getCookie, setCookie } from "./cookie";
import { getQuery, setQuery } from "util/query";

/**
 * 获取所有 Cookie 。
 * @return 返回包含所有 Cookie 的键值对。
 * @example getAllCookies()
 */
export function getAllCookies() {
    const result: { [key: string]: string } = {};
    document.cookie.replace(/(.+?)=(.+?)(;\s*|$)/g, (_: string, cookieName: string, cookieValue: string) => {
        result[decodeURIComponent(cookieName)] = decodeURIComponent(cookieValue);
        return "";
    });
    return result;
}

/**
 * 获取一个子 Cookie 值。
 * @param name 要获取的 Cookie 名字。
 * @param subname 要获取的子 Cookie 名字。
 * @return 返回对应的 Cookie 值。如果 Cookie 不存在则返回 null。
 * @example getSubcookie("sample", "subName") // 如果不存在则返回 null。
 */
export function getSubcookie(name: string, subname: string) {
    const cookie = getCookie(name);
    return cookie == null ? null : getQuery(subname, "?" + cookie);
}

/**
 * 设置或删除一个子 Cookie 值。
 * @param name 要设置的 Cookie 名字。
 * @param subname 要设置的子 Cookie 名字。
 * @param value 要设置的 Cookie 值。如果设为 null 则删除 Cookie。
 * @param expires Cookie 过期的秒数。如果设为 -1 表示永不过期。如果设为 0 表示立即过期。
 * @param path 设置 Cookie 的路径。
 * @param domain 设置 Cookie 的所在域。
 * @param secure 设置 Cookie 的安全限制。
 * @example
 * // 设置子 Cookie
 * setSubcookie("sample", "subName", "the value")
 *
 * // 删除子 Cookie
 * setSubcookie("sample", "subName", null)
 */
export function setSubcookie(name: string, subname: string, value: string | null, expires?: number, path?: string, domain?: string, secure?: string) {
    setCookie(name, setQuery(subname, value, "?" + (getCookie(name) || "")).slice(1), expires, path, domain, secure);
}
