import * as assert from "assert";
import searchPinYin from "./searchPinYin";

export function searchPinYinest() {
    assert.deepEqual(searchPinYin(["ab", "b"], "a"), [[{ start: 0, end: 1, level: 1 }]]);
}
