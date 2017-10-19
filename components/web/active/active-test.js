define(["require", "exports", "assert", "./active"], function (require, exports, assert, active) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getActiveTest() {
        document.getElementById("qunit-fixture").innerHTML = "<span id=\"active1\" class=\"active\"></span><span id=\"active2\"></span>";
        assert.equal(active.getActive([document.getElementById("active1"), document.getElementById("active2")], "active"), document.getElementById("active1"));
    }
    exports.getActiveTest = getActiveTest;
    function setActiveTest() {
        document.getElementById("qunit-fixture").innerHTML = "<span id=\"active1\"></span><span id=\"active2\"></span>";
        active.setActive([document.getElementById("active1"), document.getElementById("active2")], "active", document.getElementById("active1"));
        assert.equal(document.getElementById("qunit-fixture").innerHTML, "<span id=\"active1\" class=\"active\"></span><span id=\"active2\"></span>");
    }
    exports.setActiveTest = setActiveTest;
});
//# sourceMappingURL=active-test.js.map