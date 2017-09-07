import * as assert from "assert";
import * as encryptString from "./encryptString";

export function dencryptStringTest() {
    assert.strictEqual(encryptString.dencryptString("abc", 123), "cce");
}

export function encryptStringTest() {
    assert.strictEqual(encryptString.encryptString("abc", 123), "``e");
}
