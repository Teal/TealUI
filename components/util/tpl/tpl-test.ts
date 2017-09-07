import * as assert from "assert";
import tpl from "./tpl";

export function tplTest() {
    assert.strictEqual(tpl("Hello <%= $.name %>!", { name: "world" }), "Hello world!");
}
