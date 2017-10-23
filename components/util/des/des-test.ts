import * as assert from "assert";
import * as des from "./des";

export function encryptDESTest() {
    assert.strictEqual(des.encryptDES("a", "1"), "\u0082\u000e\u0056\u00cc\u007c\u0045\u0059\u00a4");
}

export function decryptDESTest() {
    assert.strictEqual(des.decryptDES("\u0082\u000e\u0056\u00cc\u007c\u0045\u0059\u00a4", "1"), "a");
}
