import * as assert from "assert";
import formatDateToChinese from "./formatDateToChinese";

export function formatDateToChineseTest() {
    assert.strictEqual(formatDateToChinese(new Date()), "刚刚");
}
