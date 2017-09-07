/**
 * 获取一个 Cookie。
 * @param name 要获取的 Cookie 名。
 * @return 返回对应的 Cookie 值。如果不存在则返回 null。
 * @example getCookie("sample") // 如果不存在则返回 null。
 */
export function getCookie(name: string) {
    const match = new RegExp("(?:^|; )" + encodeURIComponent(name).replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)").exec(document.cookie);
    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * 设置或删除一个 Cookie。
 * @param name 要设置的 Cookie 名。
 * @param value 要设置的 Cookie 值。如果设为 null 则删除 Cookie。
 * @param expires Cookie 过期的秒数。如果设为 -1 表示永不过期。如果设为 0 表示立即过期。
 * @param path 设置 Cookie 的路径。
 * @param domain 设置 Cookie 的所在域。
 * @param secure 设置 Cookie 的安全限制。
 * @example
 * // 设置 Cookie
 * setCookie("sample", "the value")
 *
 * // 删除 Cookie
 * setCookie("sample", null)
 */
export function setCookie(name: string, value: string | null, expires = 365 * 24 * 60 * 60 * 10, path?: string, domain?: string, secure?: string) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + (value === null || expires === 0 ? -1 : expires));
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value!) + ";expires=" + date.toUTCString();
    if (path != undefined) updatedCookie += ";path=" + path;
    if (domain != undefined) updatedCookie += ";domain=" + domain;
    if (secure != undefined) updatedCookie += ";secure=" + secure;
    document.cookie = updatedCookie;
}
