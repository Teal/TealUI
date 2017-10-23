import * as assert from "assert";
import * as html from "./html";

export function encodeHTMLTest() {
    assert.strictEqual(html.encodeHTML("<a></a>"), "&lt;a&gt;&lt;/a&gt;");
}

export function encodeHTMLAttributeTest() {
    assert.strictEqual(html.encodeHTMLAttribute("'"), "&#39;");
}

export function decodeHTMLTest() {
    assert.strictEqual(html.decodeHTML("&lt;a&gt;&lt;/a&gt;"), "<a></a>");
}

export function escapeHTMLAttributeTest() {
    assert.strictEqual(html.wrapHTMLAttribute("a", '"'), "\"a\"");
}

export function unescapeHTMLAttributeTest() {
    assert.strictEqual(html.unwrapHTMLAttribute("'a'"), "a");
}
