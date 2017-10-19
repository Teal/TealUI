define(["require", "exports", "assert", "./searchPinYin"], function (require, exports, assert, searchPinYin_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function searchPinYinest() {
        assert.deepEqual(searchPinYin_1.default(["ab", "b"], "a"), [[{ start: 0, end: 1, level: 1 }]]);
    }
    exports.searchPinYinest = searchPinYinest;
});
//# sourceMappingURL=searchPinYin-test.js.map