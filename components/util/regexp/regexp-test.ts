import * as assert from "assert";
import * as regexp from "./regexp";

export function parseTest() {
    assert.strictEqual(regexp.parse("\\s").source, /\\s/.source);
}

export function isRegExpTest() {
    assert.strictEqual(regexp.isRegExp(/a/), true);
    assert.strictEqual(regexp.isRegExp("a"), false);
}

export function joinTest() {
    assert.strictEqual(regexp.join(/a/, /b/).source, /a|b/.source);
}

export function fromWildcardTest() {
    assert.strictEqual(regexp.fromWildcard("a*b").test("ab"), true);
    assert.strictEqual(regexp.fromWildcard("a*b").test("acb"), true);
    assert.strictEqual(regexp.fromWildcard("a*b").test("acbd"), false);
}
