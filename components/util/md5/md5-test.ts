import * as assert from "assert";
import md5 from "./md5";

export function md5Test() {
    assert.strictEqual(md5("a"), "0cc175b9c0f1b6a831c399e269772661");
}
