import * as assert from "assert";
import getMNO from "./chineseMNO";

export function mnoTest() {
    assert.strictEqual(getMNO("13645465454"), "chinaMobile");
}
