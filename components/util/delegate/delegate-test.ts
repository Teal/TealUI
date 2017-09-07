import * as assert from "assert";
import * as delegate from "./delegate";

export function delegateTest() {
    let i = 0;
    const del = new delegate.Delegate(() => i++);
    del.add(() => i++);
    del.remove(del.funcs[0]);
    del();
    assert.strictEqual(i, 1);
}
