import * as assert from "assert";
import * as url from "./url";

export function parseUrlTest() {
    assert.deepEqual(url.parseUrl("http://tealui.com/index.html?from=parse"), { href: "http://tealui.com/index.html?from=parse", protocol: "http:", host: "tealui.com", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse", "hash": "", "port": "" });
}

export function formatUrlTest() {
    assert.strictEqual(url.formatUrl({ href: "http://tealui.com/index.html?from=parse", protocol: "http:", host: "tealui.com", hostname: "tealui.com", path: "/index.html?from=parse", pathname: "/index.html", search: "?from=parse", query: "from=parse", "hash": "", "port": "" }), "http://tealui.com/index.html?from=parse");
}
