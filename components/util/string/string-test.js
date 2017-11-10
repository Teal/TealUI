define(["require", "exports", "assert", "./string"], function (require, exports, assert, string) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function formatTest() {
        assert.strictEqual(string.format("我是{0}，不是{1}", "小黑", "大白"), "我是小黑，不是大白");
        assert.strictEqual(string.format("我是{xiaohei}，不是{dabai}", { xiaohei: "小黑", dabai: "大白" }), "我是小黑，不是大白");
        assert.strictEqual(string.format("在字符串内使用两个{{和}}避免被转换"), "在字符串内使用两个{和}避免被转换");
        assert.strictEqual(string.format("{0} {1}  {2}", 1, 2, 3), "1 2  3", "格式化{序号}");
        assert.strictEqual(string.format("{a} {b}  {c}", { a: 1, b: 2, c: 3 }), "1 2  3", "格式化{字段}");
        assert.strictEqual(string.format("{2} {2}  {2}", 1, 2, 3), "3 3  3", "重复序号");
        assert.strictEqual(string.format("{2}"), "", "不存在的序号");
        assert.strictEqual(string.format("{{}} {0}", 1), "{} 1", "格式化的字符串内有 { 和  }");
    }
    exports.formatTest = formatTest;
    function isStringTest() {
        assert.strictEqual(string.isString(""), true);
    }
    exports.isStringTest = isStringTest;
    function truncTest() {
        assert.strictEqual(string.trunc("1234567", 6), "123...");
        assert.strictEqual(string.trunc("1234567", 9), "1234567");
    }
    exports.truncTest = truncTest;
    function truncByWordTest() {
        assert.strictEqual(string.truncByWord("abc def", 6), "abc...");
    }
    exports.truncByWordTest = truncByWordTest;
    function containsWordTest() {
        assert.strictEqual(string.containsWord("abc ab", "ab"), true);
    }
    exports.containsWordTest = containsWordTest;
    function removeLeadingWhiteSpacesTest() {
        assert.strictEqual(string.removeLeadingWhiteSpaces("  a"), "a");
    }
    exports.removeLeadingWhiteSpacesTest = removeLeadingWhiteSpacesTest;
    function replaceAllTest() {
        assert.strictEqual(string.replaceAll("1121", "1", "3"), "3323");
    }
    exports.replaceAllTest = replaceAllTest;
    function cleanTest() {
        assert.strictEqual(string.clean(" a b   "), "ab");
    }
    exports.cleanTest = cleanTest;
    function byteLengthTest() {
        assert.strictEqual(string.byteLength("a中文"), 5);
    }
    exports.byteLengthTest = byteLengthTest;
    function capitalizeTest() {
        assert.strictEqual(string.capitalize("qwert"), "Qwert");
    }
    exports.capitalizeTest = capitalizeTest;
    function uncapitalizeTest() {
        assert.strictEqual(string.uncapitalize("Qwert"), "qwert");
    }
    exports.uncapitalizeTest = uncapitalizeTest;
    function toCamelCaseTest() {
        assert.strictEqual(string.toCamelCase("font-size"), "fontSize");
        assert.strictEqual(string.toCamelCase("foo-bar"), "fooBar");
        assert.strictEqual(string.toCamelCase("foo-bar-baz"), "fooBarBaz");
        assert.strictEqual(string.toCamelCase("girl-u-want"), "girlUWant");
        assert.strictEqual(string.toCamelCase("the-4th-dimension"), "the4thDimension");
        assert.strictEqual(string.toCamelCase("-o-tannenbaum"), "OTannenbaum");
        assert.strictEqual(string.toCamelCase("-moz-illa"), "MozIlla");
    }
    exports.toCamelCaseTest = toCamelCaseTest;
    function toKebabCaseTest() {
        assert.strictEqual(string.toKebabCase("fontSize"), "font-size");
        assert.strictEqual(string.toKebabCase("fooBar"), "foo-bar");
        assert.strictEqual(string.toKebabCase("fooBarBaz"), "foo-bar-baz");
        assert.strictEqual(string.toKebabCase("girlUWant"), "girl-u-want");
        assert.strictEqual(string.toKebabCase("OTannenbaum"), "-o-tannenbaum");
        assert.strictEqual(string.toKebabCase("MozIlla"), "-moz-illa");
    }
    exports.toKebabCaseTest = toKebabCaseTest;
    function wordsTest() {
        assert.deepEqual(string.words("fontSize"), ["font", "Size"]);
    }
    exports.wordsTest = wordsTest;
    function uniqueTest() {
        assert.strictEqual(string.unique("aabbdscc"), "abdsc");
    }
    exports.uniqueTest = uniqueTest;
    function leftTest() {
        assert.strictEqual(string.left("abcde", 3), "abc");
    }
    exports.leftTest = leftTest;
    function rightTest() {
        assert.strictEqual(string.right("abcde", 3), "cde");
    }
    exports.rightTest = rightTest;
    function matchTest() {
        assert.strictEqual(string.match("abc", /a(b)/, 1), "b");
    }
    exports.matchTest = matchTest;
});
//# sourceMappingURL=string-test.js.map