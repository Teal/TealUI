import * as assert from "assert";
import * as tradionalChinese from "./tradionalChinese";

export function toSimpleChineseTest() {
    assert.equal(tradionalChinese.toSimpleChinese("簡体"), "简體");
}

export function toTradionalChineseTest() {
    assert.equal(tradionalChinese.toTradionalChinese("简體"), "簡体");
}
