import * as assert from "assert";
import within from "./within";

export function withinTest() {
    document.getElementById("qunit-fixture")!.innerHTML = `<div id="input" style="position:fixed; width:10px; height:10px; left: 10px; top: 10px;"></div>`;
    assert.strictEqual(within(document.getElementById("input")!, { x: 0, y: 0, width: 400, height: 500 }), true);
    assert.strictEqual(within(document.getElementById("input")!, { x: 0, y: 0, width: 10, height: 10 }), true);
    assert.strictEqual(within(document.getElementById("input")!, { x: 0, y: 0, width: 9, height: 9 }), false);
}
