define(["require", "exports", "assert", "./checkPassword"], function (require, exports, assert, checkPassword_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function checkPasswordTest() {
        assert.strictEqual(checkPassword_1.default("123456"), -1);
    }
    exports.checkPasswordTest = checkPasswordTest;
});
//# sourceMappingURL=checkPassword-test.js.map