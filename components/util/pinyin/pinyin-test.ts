import * as assert from "assert";
import getPinYin from "./pinyin";

export function getPinYinTest() {
    assert.deepEqual(getPinYin("啊"), [["a"]]);
}
