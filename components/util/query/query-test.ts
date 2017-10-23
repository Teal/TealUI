import * as assert from "assert";
import * as query from "./query";

export function parseQueryTest() {
    assert.deepEqual(query.parseQuery("foo=1&goo=2&goo=3"), { foo: "1", goo: ["2", "3"] });
}

export function formatQueryTest() {
    assert.strictEqual(query.formatQuery({ a: "2", c: "4" }), "a=2&c=4");
    assert.strictEqual(query.formatQuery({ a: [2, 4] }), "a=2&a=4");
}

export function getQueryTest() {
    assert.strictEqual(query.getQuery("foo", "?foo=1"), "1");
    assert.strictEqual(query.getQuery("goo", "?foo=1"), null);
}

export function setQueryTest() {
    assert.strictEqual(query.setQuery("foo", "1", "page.html"), "page.html?foo=1");
    assert.strictEqual(query.setQuery("foo", "2", "page.html?foo=1"), "page.html?foo=2");
    assert.strictEqual(query.setQuery("goo", "2", "page.html?foo=1"), "page.html?foo=1&goo=2");
    assert.strictEqual(query.setQuery("goo", "2", "page.html?foo=1&goo=1"), "page.html?foo=1&goo=2");
    assert.strictEqual(query.setQuery("goo", "2", "page.html?foo=1&hoo=3"), "page.html?foo=1&hoo=3&goo=2");
    assert.strictEqual(query.setQuery("foo", null, "page.html"), "page.html");
    assert.strictEqual(query.setQuery("foo", null, "page.html?foo=1"), "page.html");
    assert.strictEqual(query.setQuery("foo", null, "page.html?foo=1&goo=2"), "page.html?goo=2");
    assert.strictEqual(query.setQuery("foo", null, "page.html?goo=2&foo=1"), "page.html?goo=2");
    assert.strictEqual(query.setQuery("foo", null, "page.html?goo=2&foo=1&hoo=3"), "page.html?goo=2&hoo=3");
}
