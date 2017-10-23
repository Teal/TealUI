/**
 * 表示一个地址。
 */
export interface Url {

    /**
     * 协议部分。如 "http:"。
     */
    protocol?: string;

    /**
     * 主机部分。如 "localhost:80"。
     */
    host?: string;

    /**
     * 端口部分。如 "80"。
     */
    port?: string;

    /**
     * 主机名部分。如 "localhost"。
     */
    hostname?: string;

    /**
     * 哈希值部分。如 "#hash"。
     */
    hash?: string;

    /**
     * 查询参数部分。如 "?q=1"。
     */
    search?: string;

    /**
     * 查询参数部分。如 {q: 1}。
     */
    query?: string;

    /**
     * 路径名部分。如 "/foo/a.html?q=1"。
     */
    pathname?: string;

    /**
     * 路径部分。如 "/foo/a.html"。
     */
    path?: string;

    /**
     * 完整地址。如 "http://localhost:80/foo/a.html?q=1"。
     */
    href?: string;

}

/**
 * 解析指定的地址为对象。
 * @param url 要解析的地址。
 * @return 返回解析后的新对象。
 * @example parseUrl("http://tealui.com/index.html?from=parse") // { href: "http://tealui.com/index.html?from=parse", protocol: "http:", host: "tealui.com", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse", "hash": "", "port": "" }
 */
export function parseUrl(url: string) {
    const anchor = document.createElement("a");
    anchor.href = url;
    const pathname = anchor.pathname.charAt(0) != "/" ? "/" + anchor.pathname : anchor.pathname;
    return {
        href: anchor.href,
        host: anchor.host || location.host,
        port: anchor.port,
        hash: anchor.hash,
        hostname: anchor.hostname || location.hostname,
        path: pathname + anchor.search,
        pathname: pathname,
        protocol: !anchor.protocol || ":" == anchor.protocol ? location.protocol : anchor.protocol,
        search: anchor.search,
        query: anchor.search.slice(1)
    } as Url;
}

/**
 * 格式化指定的地址为字符串。
 * @param url 地址。
 * @return 返回格式化后的字符串。
 * @example formatUrl({ protocol:"http:", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse" }) // "http://tealui.com/index.html?from=parse"
 */
export function formatUrl(url: Url) {
    return `${url.protocol || ""}//${url.host || `${url.hostname || ""}${url.port ? ":" + url.port : ""}`}${url.path || `${url.pathname || ""}${url.search || ""}`}${url.hash || ""}`;
}
