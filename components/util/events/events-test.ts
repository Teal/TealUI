import * as assert from "assert";
import EventEmitter from "./events";

export function eventEmitterTest() {
    const ee = new EventEmitter();
    const func = (arg1: any, arg2: any) => {
        assert.equal(arg1, "arg1");
        assert.equal(arg2, "arg2");
    };
    ee.on("foo", func);
    ee.emit("foo", "arg1", "arg2");
    ee.off("foo", func);
    ee.emit("foo", "arg1-error", "arg2-error");
}
