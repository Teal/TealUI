import * as assert from "assert";
import * as boolean from "./boolean";

export function parseTest() {
    assert.equal(boolean.parse(undefined), false);
    assert.equal(boolean.parse(null), false);
    assert.equal(boolean.parse(""), false);
    assert.equal(boolean.parse("foo"), true);
    assert.equal(boolean.parse("yes"), true);
    assert.equal(boolean.parse("no"), false);
    assert.equal(boolean.parse("on"), true);
    assert.equal(boolean.parse("off"), false);
    assert.equal(boolean.parse("false"), false);
    assert.equal(boolean.parse("true"), true);
    assert.equal(boolean.parse("0"), false);
    assert.equal(boolean.parse("1"), true);
}
