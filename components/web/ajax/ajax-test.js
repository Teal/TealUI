define(["require", "exports", "assert", "./ajax"], function (require, exports, assert, ajax_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function ajaxTest(done) {
        ajax_1.default({
            type: "GET",
            url: "",
            data: null,
            success: function (data) {
                assert.ok(data);
                done();
            }
        });
    }
    exports.ajaxTest = ajaxTest;
});
//# sourceMappingURL=ajax-test.js.map