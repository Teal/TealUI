import * as assert from "assert";
import pinyin from "./pinyin";

export function pinyinTest() {
    assert.deepEqual(pinyin("啊"), [["a"]]);
}
