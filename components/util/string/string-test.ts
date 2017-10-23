import * as assert from "assert";
import * as string from "./string";

export function formatTest() {
    assert.strictEqual(string.format("我是{0}，不是{1}", "小黑", "大白"), "我是小黑，不是大白");
    assert.strictEqual(string.format("我是{xiaohei}，不是{dabai}", { xiaohei: "小黑", dabai: "大白" }), "我是小黑，不是大白");
    assert.strictEqual(string.format("在字符串内使用两个{{和}}避免被转换"), "在字符串内使用两个{和}避免被转换");
    assert.strictEqual(string.format("{0} {1}  {2}", 1, 2, 3), "1 2  3", "格式化{序号}");
    assert.strictEqual(string.format("{a} {b}  {c}", { a: 1, b: 2, c: 3 }), "1 2  3", "格式化{字段}");
    assert.strictEqual(string.format("{2} {2}  {2}", 1, 2, 3), "3 3  3", "重复序号");
    assert.strictEqual(string.format("{2}"), "", "不存在的序号");
    assert.strictEqual(string.format("{{}} {0}", 1), "{} 1", "格式化的字符串内有 { 和  }");
}

export function isStringTest() {
    assert.strictEqual(string.isString(""), true);
}

export function truncTest() {
    assert.strictEqual(string.trunc("1234567", 6), "123...");
    assert.strictEqual(string.trunc("1234567", 9), "1234567");
}

export function truncByWordTest() {
    assert.strictEqual(string.truncByWord("abc def", 6), "abc...");
}

export function containsWordTest() {
    assert.strictEqual(string.containsWord("abc ab", "ab"), true);
}

export function removeLeadingWhiteSpacesTest() {
    assert.strictEqual(string.removeLeadingWhiteSpaces("  a"), "a");
}

export function replaceAllTest() {
    assert.strictEqual(string.replaceAll("1121", "1", "3"), "3323");
}

export function cleanTest() {
    assert.strictEqual(string.clean(" a b   "), "ab");
}

export function byteLengthTest() {
    assert.strictEqual(string.byteLength("a中文"), 5);
}

export function capitalizeTest() {
    assert.strictEqual(string.capitalize("qwert"), "Qwert");
}

export function uncapitalizeTest() {
    assert.strictEqual(string.uncapitalize("Qwert"), "qwert");
}

export function toCamelCaseTest() {
    assert.strictEqual(string.toCamelCase("font-size"), "fontSize");
    assert.strictEqual(string.toCamelCase("foo-bar"), "fooBar");
    assert.strictEqual(string.toCamelCase("foo-bar-baz"), "fooBarBaz");
    assert.strictEqual(string.toCamelCase("girl-u-want"), "girlUWant");
    assert.strictEqual(string.toCamelCase("the-4th-dimension"), "the4thDimension");
    assert.strictEqual(string.toCamelCase("-o-tannenbaum"), "OTannenbaum");
    assert.strictEqual(string.toCamelCase("-moz-illa"), "MozIlla");
}

export function toKebabCaseTest() {
    assert.strictEqual(string.toKebabCase("fontSize"), "font-size");
    assert.strictEqual(string.toKebabCase("fooBar"), "foo-bar");
    assert.strictEqual(string.toKebabCase("fooBarBaz"), "foo-bar-baz");
    assert.strictEqual(string.toKebabCase("girlUWant"), "girl-u-want");
    assert.strictEqual(string.toKebabCase("OTannenbaum"), "-o-tannenbaum");
    assert.strictEqual(string.toKebabCase("MozIlla"), "-moz-illa");
}

export function wordsTest() {
    assert.deepEqual(string.words("fontSize"), ["font", "Size"]);
}

export function uniqueTest() {
    assert.strictEqual(string.unique("aabbdscc"), "abdsc");
}

export function leftTest() {
    assert.strictEqual(string.left("abcde", 3), "abc");
}

export function rightTest() {
    assert.strictEqual(string.right("abcde", 3), "cde");
}

export function matchTest() {
    assert.strictEqual(string.match("abc", /a(b)/, 1), "b");
}
