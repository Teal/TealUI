define(["require", "exports", "assert", "./color"], function (require, exports, assert, color) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function clean(color) {
        if (color.a == undefined) {
            delete color.a;
        }
        return color;
    }
    function toRGBTest() {
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
    exports.toRGBTest = toRGBTest;
    function toHSLTest() {
        assert.deepEqual(clean(color.toHSL("#000")), { h: 0, s: 0, l: 0 });
    }
    exports.toHSLTest = toHSLTest;
    function toHSVTest() {
        assert.deepEqual(clean(color.toHSV("#000")), { h: 0, s: 0, v: 0 });
    }
    exports.toHSVTest = toHSVTest;
    function toIntTest() {
        assert.deepEqual(color.toInt("#000"), 0);
    }
    exports.toIntTest = toIntTest;
    function formatTest() {
        assert.strictEqual(color.format("rgb(0, 0, 0)"), "#000000");
    }
    exports.formatTest = formatTest;
    function spinTest() {
        assert.strictEqual(color.spin("#666", 50), "#666666");
    }
    exports.spinTest = spinTest;
    function saturateTest() {
        assert.strictEqual(color.saturate("#666", 0.5), "#993333");
    }
    exports.saturateTest = saturateTest;
    function darkenTest() {
        assert.strictEqual(color.darken("#666", 0.5), "#000000");
    }
    exports.darkenTest = darkenTest;
    function lightenTest() {
        assert.strictEqual(color.lighten("#666", 0.5), "#e6e6e6");
    }
    exports.lightenTest = lightenTest;
    function fadeTest() {
        assert.strictEqual(color.fade("#666", 0.5), "rgba(102,102,102,0.5)");
    }
    exports.fadeTest = fadeTest;
    function alphaTest() {
        assert.strictEqual(color.alpha("#666", 0.5), "rgba(102,102,102,0.5)");
    }
    exports.alphaTest = alphaTest;
    function invertTest() {
        assert.strictEqual(color.invert("#666"), "#999999");
    }
    exports.invertTest = invertTest;
    function mixTest() {
        assert.strictEqual(color.mix("#0f0", "#f00"), "#808000");
    }
    exports.mixTest = mixTest;
    function lumaTest() {
        assert.strictEqual(color.luma("#666"), 0.13286832155381795);
    }
    exports.lumaTest = lumaTest;
    function contrastTest() {
        assert.strictEqual(color.contrast("#666", "#000", "#fff"), "#fff");
    }
    exports.contrastTest = contrastTest;
});
//# sourceMappingURL=color-test.js.map