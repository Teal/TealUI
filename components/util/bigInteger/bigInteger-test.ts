import * as assert from "assert";
import * as bigInteger from "./bigInteger";

export function addTest() {
    assert.strictEqual(bigInteger.add("1", "2"), "3");
}

export function mulTest() {
    assert.strictEqual(bigInteger.mul("1", "2"), "2");
}
