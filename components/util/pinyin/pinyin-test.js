define(["require", "exports", "assert", "./pinyin"], function (require, exports, assert, pinyin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getPinYinTest() {
        assert.deepEqual(pinyin_1.default("啊"), [["a"]]);
    }
    exports.getPinYinTest = getPinYinTest;
});
//# sourceMappingURL=pinyin-test.js.map