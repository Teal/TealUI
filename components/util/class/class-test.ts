import * as assert from "assert";
import * as classes from "./class";

export function extendTest() {
    var clazz = classes.Class.extend({
        fontSize: 1
    });
    assert.strictEqual(new clazz().fontSize, 1);
    assert.ok(clazz.extend);
}
