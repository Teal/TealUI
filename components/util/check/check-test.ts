import * as assert from "assert";
import * as check from "./check";

export function isLetterTest() {
    assert.strictEqual(check.isLetter("abc"), true);
    assert.strictEqual(check.isLetter("ab0"), false);
}

export function isDightTest() {
    assert.strictEqual(check.isDight("1"), true);
    assert.strictEqual(check.isDight("a"), false);
}

export function isLetterOrDightTest() {
    assert.strictEqual(check.isLetterOrDight("x09"), true);
    assert.strictEqual(check.isLetterOrDight("1.2f"), false);
}

export function isIntegerTest() {
    assert.strictEqual(check.isInteger("-45"), true);
    assert.strictEqual(check.isInteger("-45.0"), false);
}

export function isNumberTest() {
    assert.strictEqual(check.isNumber("-45.35"), true);
    assert.strictEqual(check.isNumber("0x00"), false);
}

export function isEmailTest() {
    assert.strictEqual(check.isEmail("bug@tealui.com"), true);
    assert.strictEqual(check.isEmail("bug@@tealui.com"), false);
}

export function isDateTest() {
    assert.strictEqual(check.isDate("2014/1/1"), true);
    assert.strictEqual(check.isDate("hello"), false);
    assert.strictEqual(check.isDate("2014年1月1日"), false);
}

export function isIpTest() {
    assert.strictEqual(check.isIp("127.0.0.1"), true);
}

export function isPhoneTest() {
    assert.strictEqual(check.isPhone("+8613211111111"), true);
}

export function isTelephoneTest() {
    assert.strictEqual(check.isTelephone("010-86000000"), true);
}

export function isUrlTest() {
    assert.strictEqual(check.isUrl("http://tealui.com/"), true);
}

export function isIndentifierTest() {
    assert.strictEqual(check.isIndentifier("x09"), true);
}

export function isEnglishTest() {
    assert.strictEqual(check.isEnglish("Hello"), true);
}

export function isPostCodeTest() {
    assert.strictEqual(check.isPostCode("310000"), true);
}

export function isQQTest() {
    assert.strictEqual(check.isQQ("10000"), true);
}

export function isChineseTest() {
    assert.strictEqual(check.isChinese("你好"), true);
}

export function isChineseIdTest() {
    assert.strictEqual(check.isChineseId("152500198909267865"), true);
}
