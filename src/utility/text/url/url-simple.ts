/**
 * @fileOverview 快速解析地址
 * @author xuld@vip.qq.com
 */

/**
 * 表示一个地址。
 */
export interface Url {

    /**
     * 获取当前地址的协议部分。如 "http:"。
     */
    protocol?: string;

    /**
     * 获取当前地址的主机部分。如 "localhost:80"。
     */
    host?: string;

    /**
     * 获取当前地址的端口部分。如 "80"。
     */
    port?: string;

    /**
     * 获取当前地址的主机名部分。如 "localhost"。
     */
    hostname?: string;

    /**
     * 获取当前地址的哈希值部分。如 "#hash"。
     */
    hash?: string;

    /**
     * 获取当前地址的查询参数部分。如 "?q=1"。
     */
    search?: string;

    /**
     * 获取当前地址的查询参数部分。如 {q: 1}。
     */
    query?: string;

    /**
     * 获取当前地址的路径名部分。如 "/foo/a.html?q=1"。
     */
    pathname?: string;

    /**
     * 获取当前地址的路径部分。如 "/foo/a.html"。
     */
    path?: string;

    /**
     * 获取当前地址的完整地址。如 "http://localhost:80/foo/a.html?q=1"。
     */
    href?: string;

}

/**
 * 解析指定的地址。
 * @param url 要解析的地址。
 * @returns 返回解析好的 JSON 对象。
 * @example parseUrl("http://tealui.com") // {protocal:"http:", hostname: "tealui.com", path: ""}
 */
export function parseUrl(url: string): Url {
    const a = document.createElement('a');
    a.href = url;
    return {
        href: a.href,
        host: a.host || location.host,
        port: a.port,
        hash: a.hash,
        hostname: a.hostname || location.hostname,
        pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
        protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
        search: a.search,
        query: a.search.slice(1)
    };
}

/**
 * 解析指定的地址。
 * @param url 要解析的地址。
 * @returns 返回解析好的 JSON 对象。
 */
export function stringifyUrl(url: Url) {
    return `${url.protocol}//${url.hostname}${url.port ? ":" + url.port : ""}${url.pathname}${url.search}${url.hash}`;
}
