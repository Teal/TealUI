import * as assert from "assert";
import formatCurrencyToChinese from "./formatCurrencyToChinese";

export function formatCurrencyToChineseTest() {
    assert.strictEqual(formatCurrencyToChinese(10000000), "壹仟万元整");
}
