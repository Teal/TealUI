import * as assert from "assert";
import * as active from "./selected";

export function getSelectedTest() {
    document.getElementById("qunit-fixture")!.innerHTML = `<span id="active1" class="active"></span><span id="active2"></span>`;
    assert.equal(active.getSelected([document.getElementById("active1")!, document.getElementById("active2")!], "active"), document.getElementById("active1"));
}

export function setSelectedTest() {
    document.getElementById("qunit-fixture")!.innerHTML = `<span id="active1"></span><span id="active2"></span>`;
    active.setSelected([document.getElementById("active1")!, document.getElementById("active2")!], "active", document.getElementById("active1"));
    assert.equal(document.getElementById("qunit-fixture")!.innerHTML, `<span id="active1" class="active"></span><span id="active2"></span>`);
}