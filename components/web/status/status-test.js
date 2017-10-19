define(["require", "exports", "assert", "./status"], function (require, exports, assert, status) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function statusTest() {
        var elem = document.getElementById("qunit-fixture");
        status.setStatus(elem, "x-", "error");
        assert.strictEqual(status.getStatus(elem, "x-"), "error");
    }
    exports.statusTest = statusTest;
});
//# sourceMappingURL=status-test.js.map