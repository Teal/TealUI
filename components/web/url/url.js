define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 解析指定的地址为对象。
     * @param url 要解析的地址。
     * @return 返回解析后的新对象。
     * @example parseUrl("http://tealui.com/index.html?from=parse") // { href: "http://tealui.com/index.html?from=parse", protocol: "http:", host: "tealui.com", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse", "hash": "", "port": "" }
     */
    function parseUrl(url) {
        var anchor = document.createElement("a");
        anchor.href = url;
        var pathname = anchor.pathname.charAt(0) != "/" ? "/" + anchor.pathname : anchor.pathname;
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
        };
    }
    exports.parseUrl = parseUrl;
    /**
     * 格式化指定的地址为字符串。
     * @param url 地址。
     * @return 返回格式化后的字符串。
     * @example formatUrl({ protocol:"http:", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse" }) // "http://tealui.com/index.html?from=parse"
     */
    function formatUrl(url) {
        return (url.protocol || "") + "//" + (url.host || "" + (url.hostname || "") + (url.port ? ":" + url.port : "")) + (url.path || "" + (url.pathname || "") + (url.search || "")) + (url.hash || "");
    }
    exports.formatUrl = formatUrl;
});
//# sourceMappingURL=url.js.map