import * as assert from "assert";
import formatTimeToChinese from "./formatTimeToChinese";

export function formatTimeToChineseTest() {
    assert.strictEqual(formatTimeToChinese(new Date()), "刚刚");
}
