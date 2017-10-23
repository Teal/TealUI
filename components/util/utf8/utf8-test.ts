import * as assert from "assert";
import * as utf8 from "./utf8";

export function encodeUTF8Test() {
    assert.strictEqual(utf8.encodeUTF8("你"), "\\u4f60");
}

export function decodeUTF8Test() {
    assert.strictEqual(utf8.decodeUTF8("\\u4f60"), "你");
}
