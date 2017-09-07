import * as assert from "assert";
import des from "./des";

export function desTest() {
    assert.strictEqual(des("a", "1"), "\u0082\u000e\u0056\u00cc\u007c\u0045\u0059\u00a4");
}
