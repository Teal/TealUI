define(["require", "exports", "assert", "./events"], function (require, exports, assert, events_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function eventEmitterTest() {
        var ee = new events_1.default();
        var func = function (arg1, arg2) {
            assert.equal(arg1, "arg1");
            assert.equal(arg2, "arg2");
        };
        ee.on("foo", func);
        ee.emit("foo", "arg1", "arg2");
        ee.off("foo", func);
        ee.emit("foo", "arg1-error", "arg2-error");
    }
    exports.eventEmitterTest = eventEmitterTest;
});
//# sourceMappingURL=events-test.js.map