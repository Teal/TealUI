import * as assert from "assert";
import * as color from "./color";

window.c = color;

export function toRGBTest() {
    // deepEqual  对象比较
    // strictEqual 非对象比较

    // string
    assert.deepEqual(color.toRGB("rgb(0, 255, 128)"), {r: 0, g: 255, b: 128, a: undefined});
    assert.deepEqual(color.toRGB("rgba(0, 255, 128, 1)"), {r: 0, g: 255, b: 128, a: 1});
    assert.deepEqual(color.toRGB("hsl(21, 245, 128)"), {r: 250, g: 91, b: 5, a: undefined});

    // hsla
    assert.deepEqual(color.toRGB({h: 21, s: 245, l: 128, a: 1}), {r: 250, g: 91, b: 5, a: 1});
    // hsl
    assert.deepEqual(color.toRGB({h: 21, s: 245, l: 128}), {r: 250, g: 91, b: 5, a: undefined});
    // rgba
    assert.deepEqual(color.toRGB({r: 0, g: 255, b: 128, a: 1}), {r: 0, g: 255, b: 128, a: 1});
    // rgb
    assert.deepEqual(color.toRGB({r: 0, g: 255, b: 128}), {r: 0, g: 255, b: 128});

    assert.deepEqual(color.toRGB({h: 0, s: 255, l: 128, a: 0}), {r: 255, g: 0, b: 0, a: 0});
}
