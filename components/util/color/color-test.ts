import * as assert from "assert";
import * as color from "./color";

function clean(color: color.RGB | color.HSL | color.HSV) {
    if (color.a == undefined) {
        delete color.a;
    }
    return color;
}

export function toRGBTest() {
    assert.deepEqual(clean(color.toRGB("#000")), { r: 0, g: 0, b: 0 });
    assert.deepEqual(clean(color.toRGB("#ff0000")), { r: 255, g: 0, b: 0 });
    assert.deepEqual(clean(color.toRGB("#ff0000ff")), { r: 255, g: 0, b: 0, a: 1 });
    assert.deepEqual(clean(color.toRGB("rgb(255,0,0)")), { r: 255, g: 0, b: 0 });
    assert.deepEqual(clean(color.toRGB("rgba(255,0,0,0.9)")), { r: 255, g: 0, b: 0, a: 0.9 });
    assert.deepEqual(clean(color.toRGB("hsl(255,0,0)")), { r: 0, g: 0, b: 0 });
    assert.deepEqual(clean(color.toRGB("hsla(255,0,0,0.9)")), { r: 0, g: 0, b: 0, a: 0.9 });
    assert.deepEqual(clean(color.toRGB({ h: 255, s: 0, l: 0 })), { r: 0, g: 0, b: 0 });
    assert.deepEqual(clean(color.toRGB({ h: 255, s: 0, l: 0, a: 0 })), { r: 0, g: 0, b: 0, a: 0 });
}

export function toHSLTest() {
    assert.deepEqual(clean(color.toHSL("#000")), { h: 0, s: 0, l: 0 });
}

export function toHSVTest() {
    assert.deepEqual(clean(color.toHSV("#000")), { h: 0, s: 0, v: 0 });
}

export function toIntTest() {
    assert.deepEqual(color.toInt("#000"), 0);
}

export function formatTest() {
    assert.strictEqual(color.format("rgb(0, 0, 0)"), "#000000");
}

export function spinTest() {
    assert.strictEqual(color.spin("#666", 50), "#666666");
}

export function saturateTest() {
    assert.strictEqual(color.saturate("#666", 0.5), "#993333");
}

export function darkenTest() {
    assert.strictEqual(color.darken("#666", 0.5), "#000000");
}

export function lightenTest() {
    assert.strictEqual(color.lighten("#666", 0.5), "#e6e6e6");
}

export function fadeTest() {
    assert.strictEqual(color.fade("#666", 0.5), "rgba(102,102,102,0.5)");
}

export function alphaTest() {
    assert.strictEqual(color.alpha("#666", 0.5), "rgba(102,102,102,0.5)");
}

export function invertTest() {
    assert.strictEqual(color.invert("#666"), "#999999");
}

export function mixTest() {
    assert.strictEqual(color.mix("#0f0", "#f00"), "#808000");
}

export function lumaTest() {
    assert.strictEqual(color.luma("#666"), 0.13286832155381795);
}

export function contrastTest() {
    assert.strictEqual(color.contrast("#666", "#000", "#fff"), "#fff");
}
