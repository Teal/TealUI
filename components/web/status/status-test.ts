import * as assert from "assert";
import * as status from "./status";

export function statusTest() {
    const elem = document.getElementById("qunit-fixture")!;
    status.setStatus(elem, "x-", "error");
    assert.strictEqual(status.getStatus(elem, "x-"), "error");
}
