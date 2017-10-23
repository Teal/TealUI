import { getCookie, setCookie } from "./cookie";
import { getQuery, setQuery } from "util/query";

/**
 * 获取所有 Cookie。
 * @return 返回包含所有 Cookie 的键值对。
 * @example getAllCookies()
 */
export function getAllCookies() {
    const r: { [key: string]: string } = {};
    document.cookie.replace(/(.+?)=(.+?)(;\s*|$)/g, (_: string, cookieName: string, cookieValue: string) => {
        r[decodeURIComponent(cookieName)] = decodeURIComponent(cookieValue);
        return "";
    });
    return r;
}

/**
 * 获取指定的子 Cookie 值。
 * @param name Cookie 名。
 * @param subname 子 Cookie 名。
 * @return 返回对应的 Cookie 值。如果 Cookie 不存在则返回 null。
 * @example getSubcookie("sample", "child") // 如果不存在则返回 null。
 */
export function getSubcookie(name: string, subname: string) {
    const cookie = getCookie(name);
    return cookie == null ? cookie : getQuery(subname, "?" + cookie);
}

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
export function setSubcookie(name: string, subname: string, value: string | null | undefined, expires?: number, path?: string, domain?: string, secure?: string) {
    setCookie(name, setQuery(subname, value, "?" + (getCookie(name) || "")).slice(1) || undefined, expires, path, domain, secure);
}
