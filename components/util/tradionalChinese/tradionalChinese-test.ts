import * as assert from "assert";
import * as tradionalChinese from "./tradionalChinese";

export function toSimpleChineseTest() {
    assert.equal(tradionalChinese.toSimpleChinese("简體"), "简体");
}

export function toTradionalChineseTest() {
    assert.equal(tradionalChinese.toTradionalChinese("简体"), "簡體");
}
