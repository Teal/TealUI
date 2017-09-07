import * as assert from "assert";
import sha1 from "./sha1";

export function sha1Test() {
    assert.strictEqual(sha1("abc"), "a9993e364706816aba3e25717850c26c9cd0d89d");
}
