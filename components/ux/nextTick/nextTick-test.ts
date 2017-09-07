import * as assert from "assert";
import nextTick from "./nextTick";

export function nextTickTest(done: Function) {
    let i = 0;
    nextTick(() => {
        i++;
    });
    nextTick(() => {
        assert.strictEqual(i, 1);
        done();
    });
    assert.strictEqual(i, 0);
}
