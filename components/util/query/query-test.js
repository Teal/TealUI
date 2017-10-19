define(["require", "exports", "assert", "./query"], function (require, exports, assert, query) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseQueryTest() {
        assert.deepEqual(query.parseQuery("foo=1&goo=2&goo=3"), { foo: "1", goo: ["2", "3"] });
    }
    exports.parseQueryTest = parseQueryTest;
    function formatQueryTest() {
        assert.strictEqual(query.formatQuery({ a: "2", c: "4" }), "a=2&c=4");
        assert.strictEqual(query.formatQuery({ a: [2, 4] }), "a=2&a=4");
    }
    exports.formatQueryTest = formatQueryTest;
    function getQueryTest() {
        assert.strictEqual(query.getQuery("foo", "?foo=1"), "1");
        assert.strictEqual(query.getQuery("goo", "?foo=1"), null);
    }
    exports.getQueryTest = getQueryTest;
    function setQueryTest() {
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
    exports.setQueryTest = setQueryTest;
});
//# sourceMappingURL=query-test.js.map