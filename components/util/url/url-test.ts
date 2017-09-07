import * as assert from "assert";
import Url from "./url";

export function urlTest() {
    assert.strictEqual(Url.format(Url.parse("http://tealui.com/index.html?from=parse")), "http://tealui.com/index.html?from=parse");
}
