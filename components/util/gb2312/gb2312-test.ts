import * as assert from "assert";
import * as gb2312 from "./gb2312";

export function encodeGB2312Test() {
    assert.strictEqual(gb2312.encodeGB2312("你"), "%C4%E3");
}

export function decodeGB2312Test() {
    assert.strictEqual(gb2312.decodeGB2312("%C4%E3"), "你");
}
