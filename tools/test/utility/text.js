
QUnit.module("crypto", function () {

    importModule("utility/text/crypto/simple");
    QUnit.test("simple", function (assert) {
        assert.strictEqual(decryptSimple(encryptSimple("value")), "value");
        assert.strictEqual(decryptSimple(encryptSimple("中文")), "中文");
    });

    importModule("utility/text/crypto/md5");
    QUnit.test("md5", function (assert) {
        assert.strictEqual(md5("value"), "2063c1608d6e0baf80249c42e2be5804");
        assert.strictEqual(md5("中文"), "a7bac2239fcdcb3a067903d8077c4a07");
        assert.strictEqual(md5(""), "d41d8cd98f00b204e9800998ecf8427e");
        assert.strictEqual(md5("a"), "0cc175b9c0f1b6a831c399e269772661");
        assert.strictEqual(md5("abc"), "900150983cd24fb0d6963f7d28e17f72");
        assert.strictEqual(md5("message digest"), "f96b697d7cb7938d525a2f31aaf161d0");
        assert.strictEqual(md5("abcdefghijklmnopqrstuvwxyz"), "c3fcd3d76192e4007dfb496cca67e13b");
        assert.strictEqual(md5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"), "d174ab98d277d9f5a5611c2c9f419d9f");
        assert.strictEqual(md5("hello"), "5d41402abc4b2a76b9719d911017c592");
        assert.strictEqual(md5(repeat("a", 53)), "e9e7e260dce84ffa6e0e7eb5fd9d37fc")
        assert.strictEqual(md5(repeat("a", 54)), "eced9e0b81ef2bba605cbc5e2e76a1d0")
        assert.strictEqual(md5(repeat("a", 55)), "ef1772b6dff9a122358552954ad0df65")
        assert.strictEqual(md5(repeat("a", 56)), "3b0c8ac703f828b04c6c197006d17218")
        assert.strictEqual(md5(repeat("a", 57)), "652b906d60af96844ebd21b674f35e93")
        assert.strictEqual(md5(repeat("a", 63)), "b06521f39153d618550606be297466d5")
        assert.strictEqual(md5(repeat("a", 64)), "014842d480b571495a4a0363793f7367")
        assert.strictEqual(md5(repeat("a", 65)), "c743a45e0d2e6a95cb859adae0248435")
        assert.strictEqual(md5(repeat("a", 255)), "46bc249a5a8fc5d622cf12c42c463ae0")
        assert.strictEqual(md5(repeat("a", 256)), "81109eec5aa1a284fb5327b10e9c16b9")

        function repeat(s, len) {
            return new Array(len + 1).join(s);
        }
    });

    importModule("utility/text/crypto/md5.ext");
    QUnit.test("md5.base64", function (assert) {
        assert.strictEqual(md5.base64("value", "key"), "IGPBYI1uC6+AJJxC4r5YBA");
        assert.strictEqual(md5.base64("中文"), "p7rCI5/NyzoGeQPYB3xKBw");
    });
    QUnit.test("md5.hmac", function (assert) {
        assert.strictEqual(md5.hmac("value", "key"), "01433efd5f16327ea4b31144572c67f6");
        assert.strictEqual(md5.hmac("中文", "中文"), "05fe3b294344f4e93c811e10f9825a38");
    });
    QUnit.test("md5.hmacBase64", function (assert) {
        assert.strictEqual(md5.hmacBase64("value"), "hma9GehtpZrNyf4kJBytUw");
        assert.strictEqual(md5.hmacBase64("中文", "中文"), "Bf47KUNE9Ok8gR4Q+YJaOA");
    });

    importModule("utility/text/crypto/des");
    QUnit.test("des", function (assert) {
        assert.strictEqual(btoa(des("value", "key")), "bBzVQ8LJULA4F5FoUzwp2A==");
        assert.strictEqual(btoa(des("中文", "中文")), "+aUhkUR47Ww=");

        assert.strictEqual(des(atob("bBzVQ8LJULA4F5FoUzwp2A=="), "key", true), "value");
        assert.strictEqual(des(atob("+aUhkUR47Ww="), "中文", true), "中文");
    });

    importModule("utility/text/crypto/sha1");
    QUnit.test("sha1", function (assert) {
        assert.strictEqual(sha1("message"), "6f9b9af3cd6e8b8a73c2cdced37fe9f59226e27d");
        assert.strictEqual(sha1("value"), "f32b67c7e26342af42efabc674d441dca0a281c5");
        assert.strictEqual(sha1("中文"), "ebb68d6dc40f01031f4fd1d6f7fd19cf941a129a");
    });

});

QUnit.module("chinese", function () {
    importModule("utility/text/chinese/pinyin");
    QUnit.test("getPinYin", function (assert) {
        assert.strictEqual(getPinYin("哈"), "Ha");
    });

    importModule("utility/text/chinese/tradional");
    QUnit.test("tradional", function (assert) {
        assert.strictEqual(toTradionalChinese("简体"), "簡體");
        assert.strictEqual(toSimpleChinese("簡體"), "简体");
    });
});

QUnit.module("encoding", function () {

    importModule("utility/text/encoding/base64-polyfill");
    QUnit.test("btoa", function (assert) {
        assert.strictEqual(btoa('a'), 'YQ==');
    });
    QUnit.test("atob", function (assert) {
        assert.strictEqual(atob('YQ=='), 'a');
    });

    importModule("utility/text/encoding/base64");
    QUnit.test("encodeBase64", function (assert) {
        assert.strictEqual(encodeBase64('✓ à la mode'), '4pyTIMOgIGxhIG1vZGU=');
        assert.strictEqual(encodeBase64('Ձאab'), '1YHXkGFi');
        assert.strictEqual(encodeBase64('你好我是菲利普'), '5L2g5aW95oiR5piv6I+y5Yip5pmu');
        assert.strictEqual(encodeBase64('✈🍯✈🌂✈🔥✈🐔✈'), '4pyI7aC87b2v4pyI7aC87byC4pyI7aC97bSl4pyI7aC97bCU4pyI');
        assert.strictEqual(encodeBase64('\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F'), 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn8=');
        assert.strictEqual(encodeBase64('a'), 'YQ==');
        assert.strictEqual(encodeBase64('aa'), 'YWE=');
        assert.strictEqual(encodeBase64('aaa'), 'YWFh');
        assert.strictEqual(encodeBase64('foo\0'), 'Zm9vAA==');
        assert.strictEqual(encodeBase64('foo\0\0'), 'Zm9vAAA=');
        assert.strictEqual(encodeBase64('\t\t\t\t\t'), 'CQkJCQk=');
        assert.strictEqual(encodeBase64('a\n\n\n\n\na'), 'YQoKCgoKYQ==');
        assert.strictEqual(encodeBase64('a\na'), 'YQph');
    });
    QUnit.test("decodeBase64", function (assert) {
        assert.strictEqual(decodeBase64('4pyTIMOgIGxhIG1vZGU='), '✓ à la mode');
        assert.strictEqual(decodeBase64('YQph'), 'a\na');
        assert.strictEqual(decodeBase64('AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn8='), '\0\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0B\f\r\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F');
        assert.strictEqual(decodeBase64('YQ'), 'a');
        assert.strictEqual(decodeBase64('YR'), 'a');
        assert.strictEqual(decodeBase64('Zm9vIGJhciBiYXo='), 'foo bar baz');
        assert.strictEqual(decodeBase64('Zm9vIGJhcg=='), 'foo bar');
        assert.strictEqual(decodeBase64('Zm9v'), 'foo');
        assert.strictEqual(decodeBase64('Zm9vAA='), 'foo\0');
        assert.strictEqual(decodeBase64('Zm9vAAA='), 'foo\0\0');
        assert.strictEqual(decodeBase64('CQkJCQk='), '\t\t\t\t\t');
        assert.strictEqual(decodeBase64('YQoKCgoKYQ=='), 'a\n\n\n\n\na');
        assert.strictEqual(decodeBase64('YQ0KDQoNCg0KDQph'), 'a\r\n\r\n\r\n\r\n\r\na');
        assert.strictEqual(decodeBase64('Cg=='), '\n');
        assert.strictEqual(decodeBase64('DQ=='), '\r');
    });

    importModule("utility/text/encoding/html");
    QUnit.test("encodeHTML", function (assert) {
        assert.strictEqual(encodeHTML("<a></a>"), '&lt;a&gt;&lt;/a&gt;');
    });
    QUnit.test("encodeHTMLAttribute", function (assert) {
        assert.strictEqual(encodeHTMLAttribute("<a></a>"), '<a></a>');
    });
    QUnit.test("decodeHTML", function (assert) {
        assert.strictEqual(decodeHTML("&lt;a&gt;&lt;/a&gt;"), '<a></a>');
    });
    QUnit.test("escapeHTMLAttribute", function (assert) {
        assert.strictEqual(escapeHTMLAttribute("abc"), 'abc');
        assert.strictEqual(escapeHTMLAttribute("abc\"\'"), '"abc&quot;\'"');
        assert.strictEqual(escapeHTMLAttribute("abc\"\'", '"'), '"abc&quot;\'"');
        assert.strictEqual(escapeHTMLAttribute("abc\"\'", '\''), '\'abc"&#39;\'');
    });
    QUnit.test("unescapeHTMLAttribute", function (assert) {
        assert.strictEqual(unescapeHTMLAttribute("'a'"), 'a');
    });

    importModule("utility/text/encoding/utf8");
    QUnit.test("encodeUTF8", function (assert) {
        assert.strictEqual(encodeUTF8("a"), '\\u0061');
        assert.strictEqual(encodeUTF8("你"), '\\u4f60');
    });
    QUnit.test("decodeUTF8", function (assert) {
        assert.strictEqual(decodeUTF8("a"), 'a');
        assert.strictEqual(decodeUTF8("\\u4f60"), '你');
    });

    importModule("utility/text/encoding/gb2312");
    QUnit.test("encodeGB2312", function (assert) {
        assert.strictEqual(encodeGB2312("a"), 'a');
        assert.strictEqual(encodeGB2312("你"), '%C4%E3');
    });
    QUnit.test("decodeGB2312", function (assert) {
        assert.strictEqual(decodeGB2312("a"), 'a');
        assert.strictEqual(decodeGB2312("%C4%E3"), '你');
    });
});

QUnit.module("check", function () {

    importModule("utility/text/check");
    QUnit.test("isLetter", function (assert) {
        assert.strictEqual(isLetter("abc"), true);
        assert.strictEqual(isLetter("ab0"), false);
    });
    QUnit.test("isDight", function (assert) {
        assert.strictEqual(isDight("1"), true);
        assert.strictEqual(isDight("a"), false);
    });
    QUnit.test("isLetterOrDight", function (assert) {
        assert.strictEqual(isLetterOrDight("x09"), true);
        assert.strictEqual(isLetterOrDight("1.2f"), false);
    });
    QUnit.test("isLetter", function (assert) {
        assert.strictEqual(isInt("-45"), true);
        assert.strictEqual(isInt("-45.0"), false);
    });
    QUnit.test("isNumber", function (assert) {
        assert.strictEqual(isNumber("-45.35"), true);
        assert.strictEqual(isNumber("0x00"), false);
    });
    QUnit.test("isEmail", function (assert) {
        assert.strictEqual(isEmail("bug@tealui.com"), true);
        assert.strictEqual(isEmail("bug@@tealui.com"), false);
    });
    QUnit.test("isLetter", function (assert) {
        assert.strictEqual(isDate("2014/1/1"), true);
        assert.strictEqual(isDate("hello"), false);
        assert.strictEqual(isDate("2014年1月1日"), false);
    });
    QUnit.test("isValidDate", function (assert) {
        assert.strictEqual(isValidDate(2016, 2, 29), true);
        assert.strictEqual(isValidDate(2015, 2, 29), false);
    });
    QUnit.test("isIP", function (assert) {
        assert.strictEqual(isIP("127.0.0.1"), true);
    });
    QUnit.test("isPhone", function (assert) {
        assert.strictEqual(isPhone("+8613211111111"), true);
    });
    QUnit.test("isTelephone", function (assert) {
        assert.strictEqual(isTelephone("010-86000000"), true);
    });
    QUnit.test("isUrl", function (assert) {
        assert.strictEqual(isUrl("http://tealui.com/"), true);
    });
    QUnit.test("checkPassword", function (assert) {
        assert.strictEqual(checkPassword("123456"), -1);
    });
    QUnit.test("isIndentifier", function (assert) {
        assert.strictEqual(isIndentifier("x09"), true);
    });
    QUnit.test("isEnglish", function (assert) {
        assert.strictEqual(isEnglish("Hello"), true);
    });
    QUnit.test("isPostCode", function (assert) {
        assert.strictEqual(isPostCode("310000"), true);
    });
    QUnit.test("isQQ", function (assert) {
        assert.strictEqual(isQQ("10000"), true);
    });
    QUnit.test("isChinese", function (assert) {
        assert.strictEqual(isChinese("你好"), true);
    });
    QUnit.test("isChineseId", function (assert) {
        assert.strictEqual(isChineseId("152500198909267865"), true);
    });
    QUnit.test("parseChineseId", function (assert) {
        assert.deepEqual(parseChineseId("152500198909267865"), {
            "birthday": new Date("Tue Sep 26 1989 00:00:00 GMT+0800"),
            "province": "内蒙古",
            "sex": false,
            "valid": true
        });
    });

});

QUnit.module("url", function () {

    importModule("utility/text/url/query");
    QUnit.test("parseQuery", function (assert) {
        assert.deepEqual(parseQuery("a=1&b=3"), { a: '1', b: '3' });
        assert.deepEqual(parseQuery("?a=1&a=r"), { a: ['1', 'r'] });
    });
    QUnit.test("stringifyQuery", function (assert) {
        assert.strictEqual(stringifyQuery({ a: "2", c: "4" }), "a=2&c=4");
        assert.strictEqual(stringifyQuery({ a: [2, 4] }), "a=2&a=4");
    });
    QUnit.test("getQuery", function (assert) {
        assert.strictEqual(getQuery("?a=b", "a"), "b");
        assert.strictEqual(getQuery("?a=b", "abc"), undefined);
    });
    QUnit.test("setQuery", function (assert) {
        assert.strictEqual(setQuery("a.html", "b", "c"), "a.html?b=c");
        assert.strictEqual(setQuery("a.html?b=d", "b", "c"), "a.html?b=c");
        assert.strictEqual(setQuery("a.html?b=d", "add", "val"), "a.html?b=d&add=val");
    });
});

QUnit.module("json", function () {

    importModule("utility/text/json/json");
    QUnit.test("JSON.parse", function (assert) {
        assert.deepEqual(JSON.parse("{\"test\":1}"), { "test": 1 });
        assert.deepEqual(JSON.parse("\n{\"test\":1}"), { "test": 1 });
    });
    QUnit.test("JSON.stringify", function (assert) {
        assert.deepEqual(JSON.stringify({ "test": 1 }), "{\"test\":1}");
    });

    importModule("utility/text/json/decode");
    QUnit.test("JSON.decode", function (assert) {
        assert.deepEqual(JSON.decode("{test:1}"), { "test": 1 });
        assert.deepEqual(JSON.decode("\n{test:1}"), { "test": 1 });
    });

});

QUnit.module("path", function () {

    importModule("utility/text/path");
    QUnit.test("Path.isAbsolute", function (assert) {
        assert.strictEqual(Path.isAbsolute('/home/foo'), true);
        assert.strictEqual(Path.isAbsolute('/home/foo/..'), true);
        assert.strictEqual(Path.isAbsolute('bar/'), false);
        assert.strictEqual(Path.isAbsolute('./baz'), false);
    });
    QUnit.test("Path.resolve", function (assert) {
        assert.strictEqual(Path.resolve('/var/lib', '../', 'file/'), '/var/file');
        assert.strictEqual(Path.resolve('/var/lib', '/../', 'file/'), '/file');
        assert.strictEqual(Path.resolve('/some/dir', '.', '/absolute/'), '/absolute');
        assert.strictEqual(Path.resolve('/foo/tmp.3/', '../tmp.3/cycles/root.js'), '/foo/tmp.3/cycles/root.js');
    });
    QUnit.test("Path.relative", function (assert) {
        assert.strictEqual(Path.relative('/var/lib', '/var'), '..');
        assert.strictEqual(Path.relative('/var/lib', '/bin'), '../../bin');
        assert.strictEqual(Path.relative('/var/lib', '/var/lib'), '');
        assert.strictEqual(Path.relative('/var/lib', '/var/apache'), '../apache');
        assert.strictEqual(Path.relative('/var/', '/var/lib'), 'lib');
        assert.strictEqual(Path.relative('/', '/var/lib'), 'var/lib');
        assert.strictEqual(Path.relative('/foo/test', '/foo/test/bar/package.json'), 'bar/package.json');
        assert.strictEqual(Path.relative('/Users/a/web/b/test/mails', '/Users/a/web/b'), '../..');
        assert.strictEqual(Path.relative('/foo/bar/baz-quux', '/foo/bar/baz'), '../baz');
        assert.strictEqual(Path.relative('/foo/bar/baz', '/foo/bar/baz-quux'), '../baz-quux');
        assert.strictEqual(Path.relative('/baz-quux', '/baz'), '../baz');
        assert.strictEqual(Path.relative('/baz', '/baz-quux'), '../baz-quux');
    });
    QUnit.test("Path.normalize", function (assert) {
        assert.strictEqual(Path.normalize('./fixtures///b/../b/c.js'), 'fixtures/b/c.js');
        assert.strictEqual(Path.normalize('/foo/../../../bar'), '/bar');
        assert.strictEqual(Path.normalize('a//b//../b'), 'a/b');
        assert.strictEqual(Path.normalize('a//b//./c'), 'a/b/c');
        assert.strictEqual(Path.normalize('a//b//.'), 'a/b');
        assert.strictEqual(Path.normalize('/a/b/c/../../../x/y/z'), '/x/y/z');
        assert.strictEqual(Path.normalize('///..//./foo/.//bar'), '/foo/bar');
    });
    QUnit.test("Path.join", function (assert) {
        assert.strictEqual(Path.join('.', 'x/b', '..', '/b/c.js'), 'x/b/c.js');
        assert.strictEqual(Path.join('/.', 'x/b', '..', '/b/c.js'), '/x/b/c.js');
        assert.strictEqual(Path.join('/foo', '../../../bar'), '/bar');
        assert.strictEqual(Path.join('foo', '../../../bar'), '../../bar');
        assert.strictEqual(Path.join('foo/', '../../../bar'), '../../bar');
        assert.strictEqual(Path.join('foo/x', '../../../bar'), '../bar');
        assert.strictEqual(Path.join('foo/x', './bar'), 'foo/x/bar');
        assert.strictEqual(Path.join('foo/x/', './bar'), 'foo/x/bar');
        assert.strictEqual(Path.join('foo/x/', '.', 'bar'), 'foo/x/bar');
        assert.strictEqual(Path.join('./'), './');
        assert.strictEqual(Path.join('.', './'), './');
        assert.strictEqual(Path.join('.', '.', '.'), '.');
        assert.strictEqual(Path.join('.', './', '.'), '.');
        assert.strictEqual(Path.join('.', '/./', '.'), '.');
        assert.strictEqual(Path.join('.', '/////./', '.'), '.');
        assert.strictEqual(Path.join('.'), '.');
        assert.strictEqual(Path.join('', '.'), '.');
        assert.strictEqual(Path.join('', 'foo'), 'foo');
        assert.strictEqual(Path.join('foo', '/bar'), 'foo/bar');
        assert.strictEqual(Path.join('', '/foo'), '/foo');
        assert.strictEqual(Path.join('', '', '/foo'), '/foo');
        assert.strictEqual(Path.join('', '', 'foo'), 'foo');
        assert.strictEqual(Path.join('foo', ''), 'foo');
        assert.strictEqual(Path.join('foo/', ''), 'foo/');
        assert.strictEqual(Path.join('foo', '', '/bar'), 'foo/bar');
        assert.strictEqual(Path.join('./', '..', '/foo'), '../foo');
        assert.strictEqual(Path.join('./', '..', '..', '/foo'), '../../foo');
        assert.strictEqual(Path.join('.', '..', '..', '/foo'), '../../foo');
        assert.strictEqual(Path.join('', '..', '..', '/foo'), '../../foo');
        assert.strictEqual(Path.join('/'), '/');
        assert.strictEqual(Path.join('/', '.'), '/');
        assert.strictEqual(Path.join('/', '..'), '/');
        assert.strictEqual(Path.join('/', '..', '..'), '/');
        assert.strictEqual(Path.join(''), '.');
        assert.strictEqual(Path.join('', ''), '.');
        assert.strictEqual(Path.join(' /foo'), ' /foo');
        assert.strictEqual(Path.join(' ', 'foo'), ' /foo');
        assert.strictEqual(Path.join(' ', '.'), ' ');
        assert.strictEqual(Path.join(' ', '/'), ' /');
        assert.strictEqual(Path.join(' ', ''), ' ');
        assert.strictEqual(Path.join('/', 'foo'), '/foo');
        assert.strictEqual(Path.join('/', '/foo'), '/foo');
        assert.strictEqual(Path.join('/', '//foo'), '/foo');
        assert.strictEqual(Path.join('/', '', '/foo'), '/foo');
        assert.strictEqual(Path.join('', '/', 'foo'), '/foo');
        assert.strictEqual(Path.join('', '/', '/foo'), '/foo');
    });
    QUnit.test("Path.dirname", function (assert) {
        assert.strictEqual(Path.dirname('/a/b/'), '/a');
        assert.strictEqual(Path.dirname('/a/b'), '/a');
        assert.strictEqual(Path.dirname('/a'), '/');
        assert.strictEqual(Path.dirname(''), '.');
        assert.strictEqual(Path.dirname('/'), '/');
        assert.strictEqual(Path.dirname('////'), '/');
        assert.strictEqual(Path.dirname('foo'), '.');
    });
    QUnit.test("Path.basename", function (assert) {
        assert.strictEqual(Path.basename('basename.ext'), 'basename.ext');
        assert.strictEqual(Path.basename('basename.ext', '.ext'), 'basename');
        assert.strictEqual(Path.basename(''), '');
        assert.strictEqual(Path.basename('/dir/basename.ext'), 'basename.ext');
        assert.strictEqual(Path.basename('/basename.ext'), 'basename.ext');
        assert.strictEqual(Path.basename('basename.ext'), 'basename.ext');
        assert.strictEqual(Path.basename('basename.ext/'), 'basename.ext');
        assert.strictEqual(Path.basename('basename.ext//'), 'basename.ext');
        assert.strictEqual(Path.basename('aaa/bbb', '/bbb'), 'bbb');
        assert.strictEqual(Path.basename('aaa/bbb', 'a/bbb'), 'bbb');
        assert.strictEqual(Path.basename('aaa/bbb', 'bbb'), 'bbb');
        assert.strictEqual(Path.basename('aaa/bbb//', 'bbb'), 'bbb');
        assert.strictEqual(Path.basename('/aaa/bbb', '/bbb'), 'bbb');
        assert.strictEqual(Path.basename('/aaa/bbb', 'a/bbb'), 'bbb');
        assert.strictEqual(Path.basename('/aaa/bbb', 'bbb'), 'bbb');
        assert.strictEqual(Path.basename('/aaa/bbb//', 'bbb'), 'bbb');
        assert.strictEqual(Path.basename('/aaa/bbb'), 'bbb');
        assert.strictEqual(Path.basename('/aaa/'), 'aaa');
        assert.strictEqual(Path.basename('/aaa/b'), 'b');
        assert.strictEqual(Path.basename('/a/b'), 'b');
        assert.strictEqual(Path.basename('//a'), 'a');
    });
    QUnit.test("Path.extname", function (assert) {
        assert.strictEqual(Path.extname(''), '');
        assert.strictEqual(Path.extname('/path/to/file'), '');
        assert.strictEqual(Path.extname('/path/to/file.ext'), '.ext');
        assert.strictEqual(Path.extname('/path.to/file.ext'), '.ext');
        assert.strictEqual(Path.extname('/path.to/file'), '');
        assert.strictEqual(Path.extname('/path.to/.file'), '');
        assert.strictEqual(Path.extname('/path.to/.file.ext'), '.ext');
        assert.strictEqual(Path.extname('/path/to/f.ext'), '.ext');
        assert.strictEqual(Path.extname('/path/to/..ext'), '.ext');
        assert.strictEqual(Path.extname('/path/to/..'), '');
        assert.strictEqual(Path.extname('file'), '');
        assert.strictEqual(Path.extname('file.ext'), '.ext');
        assert.strictEqual(Path.extname('.file'), '');
        assert.strictEqual(Path.extname('.file.ext'), '.ext');
        assert.strictEqual(Path.extname('/file'), '');
        assert.strictEqual(Path.extname('/file.ext'), '.ext');
        assert.strictEqual(Path.extname('/.file'), '');
        assert.strictEqual(Path.extname('/.file.ext'), '.ext');
        assert.strictEqual(Path.extname('.path/file.ext'), '.ext');
        assert.strictEqual(Path.extname('file.ext.ext'), '.ext');
        assert.strictEqual(Path.extname('file.'), '.');
        assert.strictEqual(Path.extname('.'), '');
        assert.strictEqual(Path.extname('./'), '');
        assert.strictEqual(Path.extname('.file.ext'), '.ext');
        assert.strictEqual(Path.extname('.file'), '');
        assert.strictEqual(Path.extname('.file.'), '.');
        assert.strictEqual(Path.extname('.file..'), '.');
        assert.strictEqual(Path.extname('..'), '');
        assert.strictEqual(Path.extname('../'), '');
        assert.strictEqual(Path.extname('..file.ext'), '.ext');
        assert.strictEqual(Path.extname('..file'), '.file');
        assert.strictEqual(Path.extname('..file.'), '.');
        assert.strictEqual(Path.extname('..file..'), '.');
        assert.strictEqual(Path.extname('...'), '.');
        assert.strictEqual(Path.extname('...ext'), '.ext');
        assert.strictEqual(Path.extname('....'), '.');
        assert.strictEqual(Path.extname('file.ext/'), '.ext');
        assert.strictEqual(Path.extname('file.ext//'), '.ext');
        assert.strictEqual(Path.extname('file/'), '');
        assert.strictEqual(Path.extname('file//'), '');
        assert.strictEqual(Path.extname('file./'), '.');
        assert.strictEqual(Path.extname('file.//'), '.');
    });
});