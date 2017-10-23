import * as assert from "assert";
import * as base64 from "./base64";

export function encodeBase64Test() {
    assert.strictEqual(base64.encodeBase64("中文"), "5Lit5paH");
}

export function decodeBase64Test() {
    assert.strictEqual(base64.decodeBase64("5Lit5paH"), "中文");
}
