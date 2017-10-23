import * as assert from "assert";
import * as active from "./active";

export function getActiveTest() {
    document.getElementById("qunit-fixture")!.innerHTML = `<span id="active1" class="active"></span><span id="active2"></span>`;
    assert.equal(active.getActive([document.getElementById("active1")!, document.getElementById("active2")!], "active"), document.getElementById("active1"));
}

export function setActiveTest() {
    document.getElementById("qunit-fixture")!.innerHTML = `<span id="active1"></span><span id="active2"></span>`;
    active.setActive([document.getElementById("active1")!, document.getElementById("active2")!], "active", document.getElementById("active1"));
    assert.equal(document.getElementById("qunit-fixture")!.innerHTML, `<span id="active1" class="active"></span><span id="active2"></span>`);
}