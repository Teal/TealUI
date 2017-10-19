define(["require", "exports", "assert", "./url"], function (require, exports, assert, url) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseUrlTest() {
        assert.deepEqual(url.parseUrl("http://tealui.com/index.html?from=parse"), { href: "http://tealui.com/index.html?from=parse", protocol: "http:", host: "tealui.com", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse", "hash": "", "port": "" });
    }
    exports.parseUrlTest = parseUrlTest;
    function formatUrlTest() {
        assert.strictEqual(url.formatUrl({ href: "http://tealui.com/index.html?from=parse", protocol: "http:", host: "tealui.com", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse", "hash": "", "port": "" }), "http://tealui.com/index.html?from=parse");
    }
    exports.formatUrlTest = formatUrlTest;
});
//# sourceMappingURL=url-test.js.map