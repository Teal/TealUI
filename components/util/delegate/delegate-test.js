define(["require", "exports", "assert", "./delegate"], function (require, exports, assert, delegate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function delegateTest() {
        var i = 0;
        var del = new delegate_1.default(function () { return i++; });
        del.add(function () { return i++; });
        del.remove(del.funcs[0]);
        del();
        assert.strictEqual(i, 1);
    }
    exports.delegateTest = delegateTest;
});
//# sourceMappingURL=delegate-test.js.map