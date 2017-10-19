define(["require", "exports", "assert", "./within"], function (require, exports, assert, within_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function withinTest() {
        document.getElementById("qunit-fixture").innerHTML = "<div id=\"input\" style=\"position:fixed; width:10px; height:10px; left: 10px; top: 10px;\"></div>";
        assert.strictEqual(within_1.default(document.getElementById("input"), { x: 0, y: 0, width: 400, height: 500 }), true);
        assert.strictEqual(within_1.default(document.getElementById("input"), { x: 0, y: 0, width: 10, height: 10 }), true);
        assert.strictEqual(within_1.default(document.getElementById("input"), { x: 0, y: 0, width: 9, height: 9 }), false);
    }
    exports.withinTest = withinTest;
});
//# sourceMappingURL=within-test.js.map