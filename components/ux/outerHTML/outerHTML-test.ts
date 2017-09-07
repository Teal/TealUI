import * as assert from "assert";
import * as outerHTML from "./outerHTML";

export function getOuterHTMLTest() {
    assert.strictEqual(outerHTML.getOuterHTML(document.getElementById("qunit-fixture")!), `<div id="qunit-fixture"></div>`);
}

export function setOuterHTMLTest() {
    outerHTML.setOuterHTML(document.getElementById("qunit-fixture")!, `<div id="qunit-fixture" class="doc"></div>`);
    assert.strictEqual(outerHTML.getOuterHTML(document.getElementById("qunit-fixture")!), `<div id="qunit-fixture" class="doc"></div>`);
}
