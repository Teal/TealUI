import * as assert from "assert";
import Delegate from "./delegate";

export function delegateTest() {
    let i = 0;
    const del = new Delegate(() => i++);
    del.add(() => i++);
    del.remove(del.funcs[0]);
    del();
    assert.strictEqual(i, 1);
}
