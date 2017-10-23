import * as assert from "assert";
import * as xml from "./xml";

export function xmlTest() {
    assert.equal(xml.parseXML("<a>content</a>").firstChild!.nodeName, "a");
}
