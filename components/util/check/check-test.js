define(["require", "exports", "assert", "./check"], function (require, exports, assert, check) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function isLetterTest() {
        assert.strictEqual(check.isLetter("abc"), true);
        assert.strictEqual(check.isLetter("ab0"), false);
    }
    exports.isLetterTest = isLetterTest;
    function isDightTest() {
        assert.strictEqual(check.isDight("1"), true);
        assert.strictEqual(check.isDight("a"), false);
    }
    exports.isDightTest = isDightTest;
    function isLetterOrDightTest() {
        assert.strictEqual(check.isLetterOrDight("x09"), true);
        assert.strictEqual(check.isLetterOrDight("1.2f"), false);
    }
    exports.isLetterOrDightTest = isLetterOrDightTest;
    function isIntegerTest() {
        assert.strictEqual(check.isInteger("-45"), true);
        assert.strictEqual(check.isInteger("-45.0"), false);
    }
    exports.isIntegerTest = isIntegerTest;
    function isNumberTest() {
        assert.strictEqual(check.isNumber("-45.35"), true);
        assert.strictEqual(check.isNumber("0x00"), false);
    }
    exports.isNumberTest = isNumberTest;
    function isDateTest() {
        assert.strictEqual(check.isDate("2014/1/1"), true);
        assert.strictEqual(check.isDate("hello"), false);
        assert.strictEqual(check.isDate("2014年1月1日"), false);
    }
    exports.isDateTest = isDateTest;
    function isTimeTest() {
        assert.strictEqual(check.isTime("10:00:00"), true);
        assert.strictEqual(check.isTime(""), false);
    }
    exports.isTimeTest = isTimeTest;
    function isEmailTest() {
        assert.strictEqual(check.isEmail("bug@tealui.com"), true);
        assert.strictEqual(check.isEmail("bug@@tealui.com"), false);
    }
    exports.isEmailTest = isEmailTest;
    function isIpTest() {
        assert.strictEqual(check.isIp("127.0.0.1"), true);
    }
    exports.isIpTest = isIpTest;
    function isUrlTest() {
        assert.strictEqual(check.isUrl("http://tealui.com/"), true);
    }
    exports.isUrlTest = isUrlTest;
    function isIndentifierTest() {
        assert.strictEqual(check.isIndentifier("x09"), true);
    }
    exports.isIndentifierTest = isIndentifierTest;
    function isCurrencyTest() {
        assert.strictEqual(check.isCurrency("0"), false);
        assert.strictEqual(check.isCurrency("0.01"), true);
        assert.strictEqual(check.isCurrency("1"), true);
        assert.strictEqual(check.isCurrency("1.25"), true);
        assert.strictEqual(check.isCurrency("1.250"), false);
    }
    exports.isCurrencyTest = isCurrencyTest;
    function isPhoneTest() {
        assert.strictEqual(check.isPhone("+8613211111111"), true);
    }
    exports.isPhoneTest = isPhoneTest;
    function isTelephoneTest() {
        assert.strictEqual(check.isTelephone("010-86000000"), true);
    }
    exports.isTelephoneTest = isTelephoneTest;
    function isEnglishTest() {
        assert.strictEqual(check.isEnglish("Hello"), true);
    }
    exports.isEnglishTest = isEnglishTest;
    function isPostCodeTest() {
        assert.strictEqual(check.isPostCode("310000"), true);
    }
    exports.isPostCodeTest = isPostCodeTest;
    function isQQTest() {
        assert.strictEqual(check.isQQ("10000"), true);
    }
    exports.isQQTest = isQQTest;
    function isChineseTest() {
        assert.strictEqual(check.isChinese("你好"), true);
    }
    exports.isChineseTest = isChineseTest;
    function isChineseIdTest() {
        assert.strictEqual(check.isChineseId("152500198909267865"), true);
    }
    exports.isChineseIdTest = isChineseIdTest;
});
//# sourceMappingURL=check-test.js.map