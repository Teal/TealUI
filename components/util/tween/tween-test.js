define(["require", "exports", "assert", "./tween"], function (require, exports, assert, tween_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function tweenTest(done) {
        var tween = new tween_1.Tween();
        var c = 0;
        tween.set = function (e) { c = e; };
        tween.done = function () {
            assert.equal(c, 1);
            done();
        };
        tween.reset();
        tween.start();
    }
    exports.tweenTest = tweenTest;
});
//# sourceMappingURL=tween-test.js.map