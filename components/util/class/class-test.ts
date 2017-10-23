import * as assert from "assert";
import Class from "./class";

export function extendTest() {
    const clazz = Class.extend({
        fontSize: 1
    });
    assert.strictEqual(new clazz().fontSize, 1);
    assert.ok(clazz.extend);
}
