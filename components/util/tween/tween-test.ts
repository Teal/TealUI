import * as assert from "assert";
import { Tween } from "./tween";

export function tweenTest(done: Function) {
    const tween = new Tween();
    let c = 0;
    tween.set = (e) => { c = e; };
    tween.done = () => {
        assert.equal(c, 1);
        done();
    };
    tween.reset();
    tween.start();
}
