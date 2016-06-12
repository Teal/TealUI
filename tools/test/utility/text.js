
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

QUnit.module("tpl", function () {

    importModule("utility/text/tpl/asp");
    QUnit.test("AspTpl.parse", function (assert) {
        assert.strictEqual(AspTpl.parse("<%if(this.val === 1) { %>OK<% } %>", { val: 1 }), "OK");
        assert.strictEqual(AspTpl.parse("a<%= 'b' %>", 1), "ab");
    });

    importModule("utility/text/tpl/curly");
    QUnit.test("CurlyTpl.parse", function (assert) {
        assert.strictEqual(CurlyTpl.parse("{if(this.val === 1) }OK{/if}", { val: 1 }), "OK");
        assert.strictEqual(CurlyTpl.parse("a{'b'}", 1), "ab");
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
        assert.strictEqual(getQuery("", "a"), undefined);
        assert.strictEqual(getQuery("?a=b", "a"), "b");
        assert.strictEqual(getQuery("?a=b", "abc"), undefined);
        assert.strictEqual(getQuery("#?a=b", "a"), "b");
        assert.strictEqual(getQuery("?a=b#?a=c", "a"), "b");
    });
    QUnit.test("setQuery", function (assert) {
        assert.strictEqual(setQuery("a.html", "b", "c"), "a.html?b=c");
        assert.strictEqual(setQuery("a.html?b=d", "b", "c"), "a.html?b=c");
        assert.strictEqual(setQuery("a.html?b=d", "add", "val"), "a.html?b=d&add=val");
    });
    importModule("utility/text/url/url-full");
    QUnit.test("Url.parse", function (assert) {

        assert.deepEqual(urlParse('//some_path'), {
            href: '//some_path',
            pathname: '//some_path',
            path: '//some_path'
        });

        assert.deepEqual(urlParse('http:\\\\evil-phisher\\foo.html#h\\a\\s\\h'), {
            protocol: 'http:',
            slashes: true,
            host: 'evil-phisher',
            hostname: 'evil-phisher',
            pathname: '/foo.html',
            path: '/foo.html',
            hash: '#h%5Ca%5Cs%5Ch',
            href: 'http://evil-phisher/foo.html#h%5Ca%5Cs%5Ch'
        });

        assert.deepEqual(urlParse('http:\\\\evil-phisher\\foo.html?json="\\"foo\\""#h\\a\\s\\h'), {
            protocol: 'http:',
            slashes: true,
            host: 'evil-phisher',
            hostname: 'evil-phisher',
            pathname: '/foo.html',
            search: '?json=%22%5C%22foo%5C%22%22',
            query: 'json=%22%5C%22foo%5C%22%22',
            path: '/foo.html?json=%22%5C%22foo%5C%22%22',
            hash: '#h%5Ca%5Cs%5Ch',
            href: 'http://evil-phisher/foo.html?json=%22%5C%22foo%5C%22%22#h%5Ca%5Cs%5Ch'
        });

        assert.deepEqual(urlParse('http:\\\\evil-phisher\\foo.html#h\\a\\s\\h?blarg'), {
            protocol: 'http:',
            slashes: true,
            host: 'evil-phisher',
            hostname: 'evil-phisher',
            pathname: '/foo.html',
            path: '/foo.html',
            hash: '#h%5Ca%5Cs%5Ch?blarg',
            href: 'http://evil-phisher/foo.html#h%5Ca%5Cs%5Ch?blarg'
        });

        assert.deepEqual(urlParse('http:\\\\evil-phisher\\foo.html'), {
            protocol: 'http:',
            slashes: true,
            host: 'evil-phisher',
            hostname: 'evil-phisher',
            pathname: '/foo.html',
            path: '/foo.html',
            href: 'http://evil-phisher/foo.html'
        });

        assert.deepEqual(urlParse('HTTP://www.example.com/'), {
            href: 'http://www.example.com/',
            protocol: 'http:',
            slashes: true,
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('HTTP://www.example.com'), {
            href: 'http://www.example.com/',
            protocol: 'http:',
            slashes: true,
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://www.ExAmPlE.com/'), {
            href: 'http://www.example.com/',
            protocol: 'http:',
            slashes: true,
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://user:pw@www.ExAmPlE.com/'), {
            href: 'http://user:pw@www.example.com/',
            protocol: 'http:',
            slashes: true,
            auth: 'user:pw',
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://USER:PW@www.ExAmPlE.com/'), {
            href: 'http://USER:PW@www.example.com/',
            protocol: 'http:',
            slashes: true,
            auth: 'USER:PW',
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://user@www.example.com/'), {
            href: 'http://user@www.example.com/',
            protocol: 'http:',
            slashes: true,
            auth: 'user',
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://user%3Apw@www.example.com/'), {
            href: 'http://user:pw@www.example.com/',
            protocol: 'http:',
            slashes: true,
            auth: 'user:pw',
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://x.com/path?that\'s#all, folks'), {
            href: 'http://x.com/path?that%27s#all,%20folks',
            protocol: 'http:',
            slashes: true,
            host: 'x.com',
            hostname: 'x.com',
            search: '?that%27s',
            query: 'that%27s',
            pathname: '/path',
            hash: '#all,%20folks',
            path: '/path?that%27s'
        });

        assert.deepEqual(urlParse('HTTP://X.COM/Y'), {
            href: 'http://x.com/Y',
            protocol: 'http:',
            slashes: true,
            host: 'x.com',
            hostname: 'x.com',
            pathname: '/Y',
            path: '/Y'
        });

        // + not an invalid host character
        // per https://url.spec.whatwg.org/#host-parsing
        assert.deepEqual(urlParse('http://x.y.com+a/b/c'), {
            href: 'http://x.y.com+a/b/c',
            protocol: 'http:',
            slashes: true,
            host: 'x.y.com+a',
            hostname: 'x.y.com+a',
            pathname: '/b/c',
            path: '/b/c'
        });

        // an unexpected invalid char in the hostname.
        assert.deepEqual(urlParse('HtTp://x.y.cOm;a/b/c?d=e#f g<h>i'), {
            href: 'http://x.y.com/;a/b/c?d=e#f%20g%3Ch%3Ei',
            protocol: 'http:',
            slashes: true,
            host: 'x.y.com',
            hostname: 'x.y.com',
            pathname: ';a/b/c',
            search: '?d=e',
            query: 'd=e',
            hash: '#f%20g%3Ch%3Ei',
            path: ';a/b/c?d=e'
        });

        // make sure that we don't accidentally lcast the path parts.
        assert.deepEqual(urlParse('HtTp://x.y.cOm;A/b/c?d=e#f g<h>i'), {
            href: 'http://x.y.com/;A/b/c?d=e#f%20g%3Ch%3Ei',
            protocol: 'http:',
            slashes: true,
            host: 'x.y.com',
            hostname: 'x.y.com',
            pathname: ';A/b/c',
            search: '?d=e',
            query: 'd=e',
            hash: '#f%20g%3Ch%3Ei',
            path: ';A/b/c?d=e'
        });

        assert.deepEqual(urlParse('http://x...y...#p'), {
            href: 'http://x...y.../#p',
            protocol: 'http:',
            slashes: true,
            host: 'x...y...',
            hostname: 'x...y...',
            hash: '#p',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://x/p/"quoted"'), {
            href: 'http://x/p/%22quoted%22',
            protocol: 'http:',
            slashes: true,
            host: 'x',
            hostname: 'x',
            pathname: '/p/%22quoted%22',
            path: '/p/%22quoted%22'
        });

        assert.deepEqual(urlParse('<http://goo.corn/bread> Is a URL!'), {
            href: '%3Chttp://goo.corn/bread%3E%20Is%20a%20URL!',
            pathname: '%3Chttp://goo.corn/bread%3E%20Is%20a%20URL!',
            path: '%3Chttp://goo.corn/bread%3E%20Is%20a%20URL!'
        });

        assert.deepEqual(urlParse('http://www.narwhaljs.org/blog/categories?id=news'), {
            href: 'http://www.narwhaljs.org/blog/categories?id=news',
            protocol: 'http:',
            slashes: true,
            host: 'www.narwhaljs.org',
            hostname: 'www.narwhaljs.org',
            search: '?id=news',
            query: 'id=news',
            pathname: '/blog/categories',
            path: '/blog/categories?id=news'
        });

        assert.deepEqual(urlParse('http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s='), {
            href: 'http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=',
            protocol: 'http:',
            slashes: true,
            host: 'mt0.google.com',
            hostname: 'mt0.google.com',
            pathname: '/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=',
            path: '/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s='
        });

        assert.deepEqual(urlParse('http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s='), {
            href: 'http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api' +
                  '&x=2&y=2&z=3&s=',
            protocol: 'http:',
            slashes: true,
            host: 'mt0.google.com',
            hostname: 'mt0.google.com',
            search: '???&hl=en&src=api&x=2&y=2&z=3&s=',
            query: '??&hl=en&src=api&x=2&y=2&z=3&s=',
            pathname: '/vt/lyrs=m@114',
            path: '/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s='
        });

        assert.deepEqual(urlParse('http://user:pass@mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s='), {
            href: 'http://user:pass@mt0.google.com/vt/lyrs=m@114???' +
                  '&hl=en&src=api&x=2&y=2&z=3&s=',
            protocol: 'http:',
            slashes: true,
            host: 'mt0.google.com',
            auth: 'user:pass',
            hostname: 'mt0.google.com',
            search: '???&hl=en&src=api&x=2&y=2&z=3&s=',
            query: '??&hl=en&src=api&x=2&y=2&z=3&s=',
            pathname: '/vt/lyrs=m@114',
            path: '/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s='
        });

        assert.deepEqual(urlParse('file:///etc/passwd'), {
            href: 'file:///etc/passwd',
            slashes: true,
            protocol: 'file:',
            pathname: '/etc/passwd',
            hostname: '',
            host: '',
            path: '/etc/passwd'
        });

        assert.deepEqual(urlParse('file://localhost/etc/passwd'), {
            href: 'file://localhost/etc/passwd',
            protocol: 'file:',
            slashes: true,
            pathname: '/etc/passwd',
            hostname: 'localhost',
            host: 'localhost',
            path: '/etc/passwd'
        });

        assert.deepEqual(urlParse('file://foo/etc/passwd'), {
            href: 'file://foo/etc/passwd',
            protocol: 'file:',
            slashes: true,
            pathname: '/etc/passwd',
            hostname: 'foo',
            host: 'foo',
            path: '/etc/passwd'
        });

        assert.deepEqual(urlParse('file:///etc/node/'), {
            href: 'file:///etc/node/',
            slashes: true,
            protocol: 'file:',
            pathname: '/etc/node/',
            hostname: '',
            host: '',
            path: '/etc/node/'
        });

        assert.deepEqual(urlParse('file://localhost/etc/node/'), {
            href: 'file://localhost/etc/node/',
            protocol: 'file:',
            slashes: true,
            pathname: '/etc/node/',
            hostname: 'localhost',
            host: 'localhost',
            path: '/etc/node/'
        });

        assert.deepEqual(urlParse('file://foo/etc/node/'), {
            href: 'file://foo/etc/node/',
            protocol: 'file:',
            slashes: true,
            pathname: '/etc/node/',
            hostname: 'foo',
            host: 'foo',
            path: '/etc/node/'
        });

        assert.deepEqual(urlParse('http:/baz/../foo/bar'), {
            href: 'http:/baz/../foo/bar',
            protocol: 'http:',
            pathname: '/baz/../foo/bar',
            path: '/baz/../foo/bar'
        });

        assert.deepEqual(urlParse('http://user:pass@example.com:8000/foo/bar?baz=quux#frag'), {
            href: 'http://user:pass@example.com:8000/foo/bar?baz=quux#frag',
            protocol: 'http:',
            slashes: true,
            host: 'example.com:8000',
            auth: 'user:pass',
            port: '8000',
            hostname: 'example.com',
            hash: '#frag',
            search: '?baz=quux',
            query: 'baz=quux',
            pathname: '/foo/bar',
            path: '/foo/bar?baz=quux'
        });

        assert.deepEqual(urlParse('//user:pass@example.com:8000/foo/bar?baz=quux#frag'), {
            href: '//user:pass@example.com:8000/foo/bar?baz=quux#frag',
            slashes: true,
            host: 'example.com:8000',
            auth: 'user:pass',
            port: '8000',
            hostname: 'example.com',
            hash: '#frag',
            search: '?baz=quux',
            query: 'baz=quux',
            pathname: '/foo/bar',
            path: '/foo/bar?baz=quux'
        });

        assert.deepEqual(urlParse('/foo/bar?baz=quux#frag'), {
            href: '/foo/bar?baz=quux#frag',
            hash: '#frag',
            search: '?baz=quux',
            query: 'baz=quux',
            pathname: '/foo/bar',
            path: '/foo/bar?baz=quux'
        });

        assert.deepEqual(urlParse('http:/foo/bar?baz=quux#frag'), {
            href: 'http:/foo/bar?baz=quux#frag',
            protocol: 'http:',
            hash: '#frag',
            search: '?baz=quux',
            query: 'baz=quux',
            pathname: '/foo/bar',
            path: '/foo/bar?baz=quux'
        });

        assert.deepEqual(urlParse('mailto:foo@bar.com?subject=hello'), {
            href: 'mailto:foo@bar.com?subject=hello',
            protocol: 'mailto:',
            host: 'bar.com',
            auth: 'foo',
            hostname: 'bar.com',
            search: '?subject=hello',
            query: 'subject=hello',
            path: '?subject=hello'
        });

        assert.deepEqual(urlParse('javascript:alert(\'hello\');'), {
            href: 'javascript:alert(\'hello\');',
            protocol: 'javascript:',
            pathname: 'alert(\'hello\');',
            path: 'alert(\'hello\');'
        });

        assert.deepEqual(urlParse('xmpp:isaacschlueter@jabber.org'), {
            href: 'xmpp:isaacschlueter@jabber.org',
            protocol: 'xmpp:',
            host: 'jabber.org',
            auth: 'isaacschlueter',
            hostname: 'jabber.org'
        });

        assert.deepEqual(urlParse('http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar'), {
            href: 'http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar',
            protocol: 'http:',
            slashes: true,
            host: '127.0.0.1:8080',
            auth: 'atpass:foo@bar',
            hostname: '127.0.0.1',
            port: '8080',
            pathname: '/path',
            search: '?search=foo',
            query: 'search=foo',
            hash: '#bar',
            path: '/path?search=foo'
        });

        assert.deepEqual(urlParse('svn+ssh://foo/bar'), {
            href: 'svn+ssh://foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'svn+ssh:',
            pathname: '/bar',
            path: '/bar',
            slashes: true
        });

        assert.deepEqual(urlParse('dash-test://foo/bar'), {
            href: 'dash-test://foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dash-test:',
            pathname: '/bar',
            path: '/bar',
            slashes: true
        });

        assert.deepEqual(urlParse('dash-test:foo/bar'), {
            href: 'dash-test:foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dash-test:',
            pathname: '/bar',
            path: '/bar'
        });

        assert.deepEqual(urlParse('dot.test://foo/bar'), {
            href: 'dot.test://foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dot.test:',
            pathname: '/bar',
            path: '/bar',
            slashes: true
        });

        assert.deepEqual(urlParse('dot.test:foo/bar'), {
            href: 'dot.test:foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dot.test:',
            pathname: '/bar',
            path: '/bar'
        });

        //// IDNA tests
        //assert.deepEqual(urlParse('http://www.日本語.com/'), {
        //    href: 'http://www.xn--wgv71a119e.com/',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'www.xn--wgv71a119e.com',
        //    hostname: 'www.xn--wgv71a119e.com',
        //    pathname: '/',
        //    path: '/'
        //});

        //assert.deepEqual(urlParse('http://example.Bücher.com/'), {
        //    href: 'http://example.xn--bcher-kva.com/',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'example.xn--bcher-kva.com',
        //    hostname: 'example.xn--bcher-kva.com',
        //    pathname: '/',
        //    path: '/'
        //});

        //assert.deepEqual(urlParse('http://www.Äffchen.com/'), {
        //    href: 'http://www.xn--ffchen-9ta.com/',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'www.xn--ffchen-9ta.com',
        //    hostname: 'www.xn--ffchen-9ta.com',
        //    pathname: '/',
        //    path: '/'
        //});

        //assert.deepEqual(urlParse('http://www.Äffchen.cOm;A/b/c?d=e#f g<h>i'), {
        //    href: 'http://www.xn--ffchen-9ta.com/;A/b/c?d=e#f%20g%3Ch%3Ei',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'www.xn--ffchen-9ta.com',
        //    hostname: 'www.xn--ffchen-9ta.com',
        //    pathname: ';A/b/c',
        //    search: '?d=e',
        //    query: 'd=e',
        //    hash: '#f%20g%3Ch%3Ei',
        //    path: ';A/b/c?d=e'
        //});

        //assert.deepEqual(urlParse('http://SÉLIER.COM/'), {
        //    href: 'http://xn--slier-bsa.com/',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'xn--slier-bsa.com',
        //    hostname: 'xn--slier-bsa.com',
        //    pathname: '/',
        //    path: '/'
        //});

        //assert.deepEqual(urlParse('http://ليهمابتكلموشعربي؟.ي؟/'), {
        //    href: 'http://xn--egbpdaj6bu4bxfgehfvwxn.xn--egb9f/',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'xn--egbpdaj6bu4bxfgehfvwxn.xn--egb9f',
        //    hostname: 'xn--egbpdaj6bu4bxfgehfvwxn.xn--egb9f',
        //    pathname: '/',
        //    path: '/'
        //});

        //assert.deepEqual(urlParse('http://➡.ws/➡'), {
        //    href: 'http://xn--hgi.ws/➡',
        //    protocol: 'http:',
        //    slashes: true,
        //    host: 'xn--hgi.ws',
        //    hostname: 'xn--hgi.ws',
        //    pathname: '/➡',
        //    path: '/➡'
        //});

        assert.deepEqual(urlParse('http://bucket_name.s3.amazonaws.com/image.jpg'), {
            protocol: 'http:',
            slashes: true,
            host: 'bucket_name.s3.amazonaws.com',
            hostname: 'bucket_name.s3.amazonaws.com',
            pathname: '/image.jpg',
            href: 'http://bucket_name.s3.amazonaws.com/image.jpg',
            path: '/image.jpg'
        });

        assert.deepEqual(urlParse('git+http://github.com/joyent/node.git'), {
            protocol: 'git+http:',
            slashes: true,
            host: 'github.com',
            hostname: 'github.com',
            pathname: '/joyent/node.git',
            path: '/joyent/node.git',
            href: 'git+http://github.com/joyent/node.git'
        });

        //if local1@domain1 is uses as a relative URL it may
        //be parse into auth@hostname, but here there is no
        //way to make it work in url.parse, I add the test to be explicit
        assert.deepEqual(urlParse('local1@domain1'), {
            pathname: 'local1@domain1',
            path: 'local1@domain1',
            href: 'local1@domain1'
        });

        //While this may seem counter-intuitive, a browser will parse
        //<a href='www.google.com'> as a path.
        assert.deepEqual(urlParse('www.example.com'), {
            href: 'www.example.com',
            pathname: 'www.example.com',
            path: 'www.example.com'
        });

        // ipv6 support
        assert.deepEqual(urlParse('[fe80::1]'), {
            href: '[fe80::1]',
            pathname: '[fe80::1]',
            path: '[fe80::1]'
        });

        assert.deepEqual(urlParse('coap://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]'), {
            protocol: 'coap:',
            slashes: true,
            host: '[fedc:ba98:7654:3210:fedc:ba98:7654:3210]',
            hostname: 'fedc:ba98:7654:3210:fedc:ba98:7654:3210',
            href: 'coap://[fedc:ba98:7654:3210:fedc:ba98:7654:3210]/',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('coap://[1080:0:0:0:8:800:200C:417A]:61616/'), {
            protocol: 'coap:',
            slashes: true,
            host: '[1080:0:0:0:8:800:200c:417a]:61616',
            port: '61616',
            hostname: '1080:0:0:0:8:800:200c:417a',
            href: 'coap://[1080:0:0:0:8:800:200c:417a]:61616/',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://user:password@[3ffe:2a00:100:7031::1]:8080'), {
            protocol: 'http:',
            slashes: true,
            auth: 'user:password',
            host: '[3ffe:2a00:100:7031::1]:8080',
            port: '8080',
            hostname: '3ffe:2a00:100:7031::1',
            href: 'http://user:password@[3ffe:2a00:100:7031::1]:8080/',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('coap://u:p@[::192.9.5.5]:61616/.well-known/r?n=Temperature'), {
            protocol: 'coap:',
            slashes: true,
            auth: 'u:p',
            host: '[::192.9.5.5]:61616',
            port: '61616',
            hostname: '::192.9.5.5',
            href: 'coap://u:p@[::192.9.5.5]:61616/.well-known/r?n=Temperature',
            search: '?n=Temperature',
            query: 'n=Temperature',
            pathname: '/.well-known/r',
            path: '/.well-known/r?n=Temperature'
        });

        // empty port
        assert.deepEqual(urlParse('http://example.com:'), {
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            href: 'http://example.com/',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://example.com:/a/b.html'), {
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            href: 'http://example.com/a/b.html',
            pathname: '/a/b.html',
            path: '/a/b.html'
        });

        assert.deepEqual(urlParse('http://example.com:?a=b'), {
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            href: 'http://example.com/?a=b',
            search: '?a=b',
            query: 'a=b',
            pathname: '/',
            path: '/?a=b'
        });

        assert.deepEqual(urlParse('http://example.com:#abc'), {
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            href: 'http://example.com/#abc',
            hash: '#abc',
            pathname: '/',
            path: '/'
        });

        assert.deepEqual(urlParse('http://[fe80::1]:/a/b?a=b#abc'), {
            protocol: 'http:',
            slashes: true,
            host: '[fe80::1]',
            hostname: 'fe80::1',
            href: 'http://[fe80::1]/a/b?a=b#abc',
            search: '?a=b',
            query: 'a=b',
            hash: '#abc',
            pathname: '/a/b',
            path: '/a/b?a=b'
        });

        assert.deepEqual(urlParse('http://-lovemonsterz.tumblr.com/rss'), {
            protocol: 'http:',
            slashes: true,
            host: '-lovemonsterz.tumblr.com',
            hostname: '-lovemonsterz.tumblr.com',
            href: 'http://-lovemonsterz.tumblr.com/rss',
            pathname: '/rss',
            path: '/rss',
        });

        assert.deepEqual(urlParse('http://-lovemonsterz.tumblr.com:80/rss'), {
            protocol: 'http:',
            slashes: true,
            port: '80',
            host: '-lovemonsterz.tumblr.com:80',
            hostname: '-lovemonsterz.tumblr.com',
            href: 'http://-lovemonsterz.tumblr.com:80/rss',
            pathname: '/rss',
            path: '/rss',
        });

        assert.deepEqual(urlParse('http://user:pass@-lovemonsterz.tumblr.com/rss'), {
            protocol: 'http:',
            slashes: true,
            auth: 'user:pass',
            host: '-lovemonsterz.tumblr.com',
            hostname: '-lovemonsterz.tumblr.com',
            href: 'http://user:pass@-lovemonsterz.tumblr.com/rss',
            pathname: '/rss',
            path: '/rss',
        });

        assert.deepEqual(urlParse('http://user:pass@-lovemonsterz.tumblr.com:80/rss'), {
            protocol: 'http:',
            slashes: true,
            auth: 'user:pass',
            port: '80',
            host: '-lovemonsterz.tumblr.com:80',
            hostname: '-lovemonsterz.tumblr.com',
            href: 'http://user:pass@-lovemonsterz.tumblr.com:80/rss',
            pathname: '/rss',
            path: '/rss',
        });

        assert.deepEqual(urlParse('http://_jabber._tcp.google.com/test'), {
            protocol: 'http:',
            slashes: true,
            host: '_jabber._tcp.google.com',
            hostname: '_jabber._tcp.google.com',
            href: 'http://_jabber._tcp.google.com/test',
            pathname: '/test',
            path: '/test',
        });

        assert.deepEqual(urlParse('http://user:pass@_jabber._tcp.google.com/test'), {
            protocol: 'http:',
            slashes: true,
            auth: 'user:pass',
            host: '_jabber._tcp.google.com',
            hostname: '_jabber._tcp.google.com',
            href: 'http://user:pass@_jabber._tcp.google.com/test',
            pathname: '/test',
            path: '/test',
        });

        assert.deepEqual(urlParse('http://_jabber._tcp.google.com:80/test'), {
            protocol: 'http:',
            slashes: true,
            port: '80',
            host: '_jabber._tcp.google.com:80',
            hostname: '_jabber._tcp.google.com',
            href: 'http://_jabber._tcp.google.com:80/test',
            pathname: '/test',
            path: '/test',
        });

        assert.deepEqual(urlParse('http://user:pass@_jabber._tcp.google.com:80/test'), {
            protocol: 'http:',
            slashes: true,
            auth: 'user:pass',
            port: '80',
            host: '_jabber._tcp.google.com:80',
            hostname: '_jabber._tcp.google.com',
            href: 'http://user:pass@_jabber._tcp.google.com:80/test',
            pathname: '/test',
            path: '/test',
        });

        assert.deepEqual(urlParse('http://x:1/\' <>"`/{}|\\^~`/'), {
            protocol: 'http:',
            slashes: true,
            host: 'x:1',
            port: '1',
            hostname: 'x',
            pathname: '/%27%20%3C%3E%22%60/%7B%7D%7C/%5E~%60/',
            path: '/%27%20%3C%3E%22%60/%7B%7D%7C/%5E~%60/',
            href: 'http://x:1/%27%20%3C%3E%22%60/%7B%7D%7C/%5E~%60/'
        });

        assert.deepEqual(urlParse('http://a@b@c/'), {
            protocol: 'http:',
            slashes: true,
            auth: 'a@b',
            host: 'c',
            hostname: 'c',
            href: 'http://a%40b@c/',
            path: '/',
            pathname: '/'
        });

        assert.deepEqual(urlParse('http://a@b?@c'), {
            protocol: 'http:',
            slashes: true,
            auth: 'a',
            host: 'b',
            hostname: 'b',
            href: 'http://a@b/?@c',
            path: '/?@c',
            pathname: '/',
            search: '?@c',
            query: '@c'
        });

        assert.deepEqual(urlParse('http://a\r" \t\n<\'b:b@c\r\nd/e?f'), {
            protocol: 'http:',
            slashes: true,
            auth: 'a\r" \t\n<\'b:b',
            host: 'c',
            hostname: 'c',
            search: '?f',
            query: 'f',
            pathname: '%0D%0Ad/e',
            path: '%0D%0Ad/e?f',
            href: 'http://a%0D%22%20%09%0A%3C\'b:b@c/%0D%0Ad/e?f'
        });

        // git urls used by npm
        assert.deepEqual(urlParse('git+ssh://git@github.com:npm/npm'), {
            protocol: 'git+ssh:',
            slashes: true,
            auth: 'git',
            host: 'github.com',
            hostname: 'github.com',
            pathname: '/:npm/npm',
            path: '/:npm/npm',
            href: 'git+ssh://git@github.com/:npm/npm'
        });

        assert.deepEqual(urlParse('https://*'), {
            protocol: 'https:',
            slashes: true,
            host: '',
            hostname: '',
            pathname: '/*',
            path: '/*',
            href: 'https:///*'
        });

        window.query_1 = { parseQuery: parseQuery, stringifyQuery: stringifyQuery };

        assert.deepEqual(urlParse('/foo/bar?baz=quux#frag', true), {
            href: '/foo/bar?baz=quux#frag',
            hash: '#frag',
            search: '?baz=quux',
            query: { 'baz': 'quux' },
            pathname: '/foo/bar',
            path: '/foo/bar?baz=quux'
        });
        assert.deepEqual(urlParse('http://example.com', true), {
            href: 'http://example.com/',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            query: {},
            search: '',
            pathname: '/',
            path: '/'
        });
        assert.deepEqual(urlParse('/example', true), {
            search: '',
            query: {},
            pathname: '/example',
            path: '/example',
            href: '/example'
        });
        assert.deepEqual(urlParse('/example?query=value', true), {
            search: '?query=value',
            query: { query: "value" },
            pathname: '/example',
            path: '/example?query=value',
            href: '/example?query=value'
        });


        assert.deepEqual(urlParse('http://example.com?', true), {
            href: 'http://example.com/?',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            search: '?',
            query: {},
            path: "/?",
            pathname: '/'
        });
        assert.deepEqual(urlParse('http://example.com?foo=bar#frag'), {
            href: 'http://example.com/?foo=bar#frag',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            hash: '#frag',
            search: '?foo=bar',
            query: 'foo=bar',
            path: "/?foo=bar",
            pathname: '/'
        });
        assert.deepEqual(urlParse('http://example.com?foo=@bar#frag'), {
            href: 'http://example.com/?foo=@bar#frag',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            hash: '#frag',
            search: '?foo=@bar',
            query: 'foo=@bar',
            path: "/?foo=@bar",
            pathname: '/'
        });
        assert.deepEqual(urlParse('http://example.com?foo=/bar/#frag'), {
            href: 'http://example.com/?foo=/bar/#frag',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            hash: '#frag',
            search: '?foo=/bar/',
            query: 'foo=/bar/',
            path: "/?foo=/bar/",
            pathname: '/'
        });
        assert.deepEqual(urlParse('http://example.com?foo=?bar/#frag'), {
            href: 'http://example.com/?foo=?bar/#frag',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            hash: '#frag',
            search: '?foo=?bar/',
            query: 'foo=?bar/',
            path: "/?foo=?bar/",
            pathname: '/'
        });
        assert.deepEqual(urlParse('http://example.com#frag=?bar/#frag'), {
            href: 'http://example.com/#frag=?bar/#frag',
            protocol: 'http:',
            slashes: true,
            host: 'example.com',
            hostname: 'example.com',
            hash: '#frag=?bar/#frag',
            path: "/",
            pathname: '/'
        });
        assert.deepEqual(urlParse('http://google.com" onload="alert(42)/'), {
            href: 'http://google.com/%22%20onload=%22alert(42)/',
            protocol: 'http:',
            slashes: true,
            host: 'google.com',
            hostname: 'google.com',
            path: "%22%20onload=%22alert(42)/",
            pathname: '%22%20onload=%22alert(42)/'
        });
        assert.deepEqual(urlParse('xmpp:isaacschlueter@jabber.org'), {
            href: 'xmpp:isaacschlueter@jabber.org',
            protocol: 'xmpp:',
            host: 'jabber.org',
            auth: 'isaacschlueter',
            hostname: 'jabber.org'
        });
        assert.deepEqual(urlParse('http://atslash%2F%40:%2F%40@foo/'), {
            href: 'http://atslash%2F%40:%2F%40@foo/',
            auth: 'atslash/@:/@',
            hostname: 'foo',
            host: 'foo',
            protocol: 'http:',
            path: '/',
            pathname: '/',
            slashes: true
        });
        assert.deepEqual(urlParse('svn+ssh://foo/bar'), {
            href: 'svn+ssh://foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'svn+ssh:',
            path: '/bar',
            pathname: '/bar',
            slashes: true
        });
        assert.deepEqual(urlParse('dash-test://foo/bar'), {
            href: 'dash-test://foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dash-test:',
            path: '/bar',
            pathname: '/bar',
            slashes: true
        });
        assert.deepEqual(urlParse('dash-test:foo/bar'), {
            href: 'dash-test:foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dash-test:',
            path: '/bar',
            pathname: '/bar'
        });
        assert.deepEqual(urlParse('dot.test://foo/bar'), {
            href: 'dot.test://foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dot.test:',
            path: '/bar',
            pathname: '/bar',
            slashes: true
        });
        assert.deepEqual(urlParse('dot.test:foo/bar'), {
            href: 'dot.test:foo/bar',
            host: 'foo',
            hostname: 'foo',
            protocol: 'dot.test:',
            path: '/bar',
            pathname: '/bar'
        });
        // ipv6 support
        assert.deepEqual(urlParse('coap:u:p@[::1]:61616/.well-known/r?n=Temperature'), {
            href: 'coap:u:p@[::1]:61616/.well-known/r?n=Temperature',
            protocol: 'coap:',
            auth: 'u:p',
            host: '[::1]:61616',
            hostname: '::1',
            port: '61616',
            path: '/.well-known/r?n=Temperature',
            pathname: '/.well-known/r',
            search: '?n=Temperature',
            query: 'n=Temperature'
        });
        assert.deepEqual(urlParse('coap:[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:61616/s/stopButton'), {
            href: 'coap:[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:61616/s/stopButton',
            protocol: 'coap:',
            host: '[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:61616',
            hostname: 'fedc:ba98:7654:3210:fedc:ba98:7654:3210',
            path: '/s/stopButton',
            port: "61616",
            pathname: '/s/stopButton'
        });

        // encode context-specific delimiters in path and query, but do not touch
        // other non-delimiter chars like `%`.
        // <https://github.com/joyent/node/issues/4082>

        // `#`,`?` in path
        assert.deepEqual(urlParse('/path/to/%%23%3F+=&.txt?foo=theA1#bar', true), {
            href: '/path/to/%%23%3F+=&.txt?foo=theA1#bar',
            path: '/path/to/%%23%3F+=&.txt?foo=theA1',
            pathname: '/path/to/%%23%3F+=&.txt',
            search: '?foo=theA1',
            query: {
                foo: 'theA1'
            },
            hash: '#bar'
        });

        // `#`,`?` in path + `#` in query
        assert.deepEqual(urlParse('/path/to/%%23%3F+=&.txt?foo=the%231#bar', true), {
            href: '/path/to/%%23%3F+=&.txt?foo=the%231#bar',
            path: '/path/to/%%23%3F+=&.txt?foo=the%231',
            pathname: '/path/to/%%23%3F+=&.txt',
            search: '?foo=the%231',
            query: {
                foo: 'the#1'
            },
            hash: '#bar'
        });

        // `?` and `#` in path and search
        assert.deepEqual(urlParse('http://ex.com/foo%3F100%m%23r?abc=the%231?&foo=bar#frag'), {
            href: 'http://ex.com/foo%3F100%m%23r?abc=the%231?&foo=bar#frag',
            protocol: 'http:',
            host: 'ex.com',
            hostname: 'ex.com',
            hash: '#frag',
            search: '?abc=the%231?&foo=bar',
            query: 'abc=the%231?&foo=bar',
            path: '/foo%3F100%m%23r?abc=the%231?&foo=bar',
            pathname: '/foo%3F100%m%23r',
            slashes: true
        });

        // `?` and `#` in search only
        assert.deepEqual(urlParse('http://ex.com/fooA100%mBr?abc=the%231?&foo=bar#frag'), {
            href: 'http://ex.com/fooA100%mBr?abc=the%231?&foo=bar#frag',
            protocol: 'http:',
            host: 'ex.com',
            hostname: 'ex.com',
            hash: '#frag',
            search: '?abc=the%231?&foo=bar',
            query: 'abc=the%231?&foo=bar',
            path: '/fooA100%mBr?abc=the%231?&foo=bar',
            pathname: '/fooA100%mBr',
            slashes: true
        });

        function urlParse(href, parseQuery) {
            return JSON.parse(JSON.stringify(Url.parse(href, parseQuery)));
        }

    });
    QUnit.test("Url.resolve", function (assert) {
        assert.strictEqual(Url.resolve('/foo/bar/baz', 'quux'), '/foo/bar/quux');
        assert.strictEqual(Url.resolve('/foo/bar/baz', 'quux/asdf'), '/foo/bar/quux/asdf');
        assert.strictEqual(Url.resolve('/foo/bar/baz', 'quux/baz'), '/foo/bar/quux/baz');
        assert.strictEqual(Url.resolve('/foo/bar/baz', '../quux/baz'), '/foo/quux/baz');
        assert.strictEqual(Url.resolve('/foo/bar/baz', '/bar'), '/bar');
        assert.strictEqual(Url.resolve('/foo/bar/baz/', 'quux'), '/foo/bar/baz/quux');
        assert.strictEqual(Url.resolve('/foo/bar/baz/', 'quux/baz'), '/foo/bar/baz/quux/baz');
        assert.strictEqual(Url.resolve('/foo/bar/baz', '../../../../../../../../quux/baz'), '/quux/baz');
        assert.strictEqual(Url.resolve('/foo/bar/baz', '../../../../../../../quux/baz'), '/quux/baz');
        assert.strictEqual(Url.resolve('/foo', '.'), '/');
        assert.strictEqual(Url.resolve('/foo', '..'), '/');
        assert.strictEqual(Url.resolve('/foo/', '.'), '/foo/');
        assert.strictEqual(Url.resolve('/foo/', '..'), '/');
        assert.strictEqual(Url.resolve('/foo/bar', '.'), '/foo/');
        assert.strictEqual(Url.resolve('/foo/bar', '..'), '/');
        assert.strictEqual(Url.resolve('/foo/bar/', '.'), '/foo/bar/');
        assert.strictEqual(Url.resolve('/foo/bar/', '..'), '/foo/');
        assert.strictEqual(Url.resolve('foo/bar', '../../../baz'), '../../baz');
        assert.strictEqual(Url.resolve('foo/bar/', '../../../baz'), '../baz');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'https:#hash2'), 'https:///#hash2');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'https:/p/a/t/h?s#hash2'), 'https://p/a/t/h?s#hash2');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'https://u:p@h.com/p/a/t/h?s#hash2'), 'https://u:p@h.com/p/a/t/h?s#hash2');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'https:/a/b/c/d'), 'https://a/b/c/d');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'http:#hash2'), 'http://example.com/b//c//d;p?q#hash2');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'http:/p/a/t/h?s#hash2'), 'http://example.com/p/a/t/h?s#hash2');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'http://u:p@h.com/p/a/t/h?s#hash2'),
         'http://u:p@h.com/p/a/t/h?s#hash2');
        assert.strictEqual(Url.resolve('http://example.com/b//c//d;p?q#blarg', 'http:/a/b/c/d'), 'http://example.com/a/b/c/d');
        assert.strictEqual(Url.resolve('/foo/bar/baz', '/../etc/passwd'), '/etc/passwd');
        assert.strictEqual(Url.resolve('http://localhost', 'file:///Users/foo'), 'file:///Users/foo');
        assert.strictEqual(Url.resolve('http://localhost', 'file://foo/Users'), 'file://foo/Users');


        // http://lists.w3.org/Archives/Public/uri/2004Feb/0114.html
        assert.strictEqual(Url.resolve('foo:a/b', '../c'), 'foo:c');
        assert.strictEqual(Url.resolve('foo:a', 'foo:.'), 'foo:');
        assert.strictEqual(Url.resolve('zz:abc', '/foo/../../../bar'), 'zz:/bar');
        assert.strictEqual(Url.resolve('zz:abc', '/foo/../bar'), 'zz:/bar');
        // @isaacs Disagree. Not how web browsers resolve this.
        assert.strictEqual(Url.resolve('zz:abc', 'foo/../../../bar'), 'zz:bar');
        assert.strictEqual(Url.resolve('zz:abc', 'foo/../bar'), 'zz:bar');
        assert.strictEqual(Url.resolve('zz:abc', 'zz:.'), 'zz:');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '/.'), 'http://a/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '/.foo'), 'http://a/.foo');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '.foo'), 'http://a/b/c/.foo');

        // http://gbiv.com/protocols/uri/test/rel_examples1.html
        // examples from RFC 2396
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g:h'), 'g:h');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g'), 'http://a/b/c/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', './g'), 'http://a/b/c/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g/'), 'http://a/b/c/g/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '/g'), 'http://a/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '//g'), 'http://g/');
        // changed with RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '?y'), 'http://a/b/c/d;p?y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '?y'), 'http://a/b/c/d;p?y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g?y'), 'http://a/b/c/g?y');
        // changed with RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '#s'), 'http://a/b/c/d;p?q#s');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g#s'), 'http://a/b/c/g#s');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g?y#s'), 'http://a/b/c/g?y#s');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', ';x'), 'http://a/b/c/;x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g;x'), 'http://a/b/c/g;x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g;x?y#s'), 'http://a/b/c/g;x?y#s');
        // changed with RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', ''), 'http://a/b/c/d;p?q');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '.'), 'http://a/b/c/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', './'), 'http://a/b/c/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '..'), 'http://a/b/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../'), 'http://a/b/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../g'), 'http://a/b/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../..'), 'http://a/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../../'), 'http://a/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../../g'), 'http://a/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../../../g'), 'http://a/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '../../../../g'), 'http://a/g');
        // changed with RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '/./g'), 'http://a/g');
        // changed with RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '/../g'), 'http://a/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g.'), 'http://a/b/c/g.');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '.g'), 'http://a/b/c/.g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g..'), 'http://a/b/c/g..');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '..g'), 'http://a/b/c/..g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', './../g'), 'http://a/b/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', './g/.'), 'http://a/b/c/g/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g/./h'), 'http://a/b/c/g/h');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g/../h'), 'http://a/b/c/h');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g;x=1/./y'), 'http://a/b/c/g;x=1/y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g;x=1/../y'), 'http://a/b/c/y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g?y/./x'), 'http://a/b/c/g?y/./x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g?y/../x'), 'http://a/b/c/g?y/../x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g#s/./x'), 'http://a/b/c/g#s/./x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'g#s/../x'), 'http://a/b/c/g#s/../x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'http:g'), 'http://a/b/c/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', 'http:'), 'http://a/b/c/d;p?q');
        // not sure where this one originated
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q', '/a/b/c/./../../g'), 'http://a/a/g');

        // http://gbiv.com/protocols/uri/test/rel_examples2.html
        // slashes in base URI's query args
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g'), 'http://a/b/c/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', './g'), 'http://a/b/c/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g/'), 'http://a/b/c/g/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '/g'), 'http://a/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '//g'), 'http://g/');
        // changed in RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '?y'), 'http://a/b/c/d;p?y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g?y'), 'http://a/b/c/g?y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g?y/./x'), 'http://a/b/c/g?y/./x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g?y/../x'), 'http://a/b/c/g?y/../x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g#s'), 'http://a/b/c/g#s');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g#s/./x'), 'http://a/b/c/g#s/./x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', 'g#s/../x'), 'http://a/b/c/g#s/../x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', './'), 'http://a/b/c/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '../'), 'http://a/b/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '../g'), 'http://a/b/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '../../'), 'http://a/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p?q=1/2', '../../g'), 'http://a/g');

        // http://gbiv.com/protocols/uri/test/rel_examples3.html
        // slashes in path params
        // all of these changed in RFC 2396bis
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', 'g'), 'http://a/b/c/d;p=1/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', './g'), 'http://a/b/c/d;p=1/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', 'g/'), 'http://a/b/c/d;p=1/g/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', 'g?y'), 'http://a/b/c/d;p=1/g?y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', ';x'), 'http://a/b/c/d;p=1/;x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', 'g;x'), 'http://a/b/c/d;p=1/g;x');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', 'g;x=1/./y'), 'http://a/b/c/d;p=1/g;x=1/y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', 'g;x=1/../y'), 'http://a/b/c/d;p=1/y');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', './'), 'http://a/b/c/d;p=1/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', '../'), 'http://a/b/c/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', '../g'), 'http://a/b/c/g');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', '../../'), 'http://a/b/');
        assert.strictEqual(Url.resolve('http://a/b/c/d;p=1/2?q', '../../g'), 'http://a/b/g');

        // http://gbiv.com/protocols/uri/test/rel_examples4.html
        // double and triple slash, unknown scheme
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', 'g:h'), 'g:h');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', 'g'), 'fred:///s//a/b/g');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', './g'), 'fred:///s//a/b/g');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', 'g/'), 'fred:///s//a/b/g/');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '/g'), 'fred:///g');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '//g'), 'fred://g');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '//g/x'), 'fred://g/x');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '///g'), 'fred:///g');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', './'), 'fred:///s//a/b/');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '../'), 'fred:///s//a/');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '../g'), 'fred:///s//a/g');

        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '../../'), 'fred:///s//');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '../../g'), 'fred:///s//g');
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '../../../g'), 'fred:///s/g');
        // may change to fred:///s//a/../../../g
        assert.strictEqual(Url.resolve('fred:///s//a/b/c', '../../../../g'), 'fred:///g');

        // http://gbiv.com/protocols/uri/test/rel_examples5.html
        // double and triple slash, well-known scheme
        assert.strictEqual(Url.resolve('http:///s//a/b/c', 'g:h'), 'g:h');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', 'g'), 'http:///s//a/b/g');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', './g'), 'http:///s//a/b/g');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', 'g/'), 'http:///s//a/b/g/');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '/g'), 'http:///g');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '//g'), 'http://g/');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '//g/x'), 'http://g/x');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '///g'), 'http:///g');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', './'), 'http:///s//a/b/');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '../'), 'http:///s//a/');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '../g'), 'http:///s//a/g');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '../../'), 'http:///s//');
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '../../g'), 'http:///s//g');
        // may change to http:///s//a/../../g
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '../../../g'), 'http:///s/g');
        // may change to http:///s//a/../../../g
        assert.strictEqual(Url.resolve('http:///s//a/b/c', '../../../../g'), 'http:///g');

        // from Dan Connelly's tests in http://www.w3.org/2000/10/swap/uripath.py
        assert.strictEqual(Url.resolve('foo:xyz', 'bar:abc'), 'bar:abc');
        assert.strictEqual(Url.resolve('http://example/x/y/z', '../abc'), 'http://example/x/abc');
        assert.strictEqual(Url.resolve('http://example2/x/y/z', 'http://example/x/abc'), 'http://example/x/abc');
        assert.strictEqual(Url.resolve('http://ex/x/y/z', '../r'), 'http://ex/x/r');
        assert.strictEqual(Url.resolve('http://ex/x/y', 'q/r'), 'http://ex/x/q/r');
        assert.strictEqual(Url.resolve('http://ex/x/y', 'q/r#s'), 'http://ex/x/q/r#s');
        assert.strictEqual(Url.resolve('http://ex/x/y', 'q/r#s/t'), 'http://ex/x/q/r#s/t');
        assert.strictEqual(Url.resolve('http://ex/x/y', 'ftp://ex/x/q/r'), 'ftp://ex/x/q/r');
        assert.strictEqual(Url.resolve('http://ex/x/y', ''), 'http://ex/x/y');
        assert.strictEqual(Url.resolve('http://ex/x/y/', ''), 'http://ex/x/y/');
        assert.strictEqual(Url.resolve('http://ex/x/y/pdq', ''), 'http://ex/x/y/pdq');
        assert.strictEqual(Url.resolve('http://ex/x/y/', 'z/'), 'http://ex/x/y/z/');
        assert.strictEqual(Url.resolve('file:/swap/test/animal.rdf', '#Animal'), 'file:/swap/test/animal.rdf#Animal');
        assert.strictEqual(Url.resolve('file:/e/x/y/z', '../abc'), 'file:/e/x/abc');
        assert.strictEqual(Url.resolve('file:/example2/x/y/z', '/example/x/abc'), 'file:/example/x/abc');
        assert.strictEqual(Url.resolve('file:/ex/x/y/z', '../r'), 'file:/ex/x/r');
        assert.strictEqual(Url.resolve('file:/ex/x/y/z', '/r'), 'file:/r');
        assert.strictEqual(Url.resolve('file:/ex/x/y', 'q/r'), 'file:/ex/x/q/r');
        assert.strictEqual(Url.resolve('file:/ex/x/y', 'q/r#s'), 'file:/ex/x/q/r#s');
        assert.strictEqual(Url.resolve('file:/ex/x/y', 'q/r#'), 'file:/ex/x/q/r#');
        assert.strictEqual(Url.resolve('file:/ex/x/y', 'q/r#s/t'), 'file:/ex/x/q/r#s/t');
        assert.strictEqual(Url.resolve('file:/ex/x/y', 'ftp://ex/x/q/r'), 'ftp://ex/x/q/r');
        assert.strictEqual(Url.resolve('file:/ex/x/y', ''), 'file:/ex/x/y');
        assert.strictEqual(Url.resolve('file:/ex/x/y/', ''), 'file:/ex/x/y/');
        assert.strictEqual(Url.resolve('file:/ex/x/y/pdq', ''), 'file:/ex/x/y/pdq');
        assert.strictEqual(Url.resolve('file:/ex/x/y/', 'z/'), 'file:/ex/x/y/z/');
        assert.strictEqual(Url.resolve('file:/devel/WWW/2000/10/swap/test/reluri-1.n3', 'file://meetings.example.com/cal#m1'), 'file://meetings.example.com/cal#m1');
        assert.strictEqual(Url.resolve('file:/home/connolly/w3ccvs/WWW/2000/10/swap/test/reluri-1.n3', 'file://meetings.example.com/cal#m1'), 'file://meetings.example.com/cal#m1');
        assert.strictEqual(Url.resolve('file:/some/dir/foo', './#blort'), 'file:/some/dir/#blort');
        assert.strictEqual(Url.resolve('file:/some/dir/foo', './#'), 'file:/some/dir/#');
        // Ryan Lee
        assert.strictEqual(Url.resolve('http://example/x/abc.efg', './'), 'http://example/x/');


        // Graham Klyne's tests
        // http://www.ninebynine.org/Software/HaskellUtils/Network/UriTest.xls
        // 01-31 are from Connelly's cases

        // 32-49
        assert.strictEqual(Url.resolve('http://ex/x/y', './q:r'), 'http://ex/x/q:r');
        assert.strictEqual(Url.resolve('http://ex/x/y', './p=q:r'), 'http://ex/x/p=q:r');
        assert.strictEqual(Url.resolve('http://ex/x/y?pp/qq', '?pp/rr'), 'http://ex/x/y?pp/rr');
        assert.strictEqual(Url.resolve('http://ex/x/y?pp/qq', 'y/z'), 'http://ex/x/y/z');
        assert.strictEqual(Url.resolve('mailto:local', 'local/qual@domain.org#frag'), 'mailto:local/qual@domain.org#frag');
        assert.strictEqual(Url.resolve('mailto:local/qual1@domain1.org', 'more/qual2@domain2.org#frag'), 'mailto:local/more/qual2@domain2.org#frag');
        assert.strictEqual(Url.resolve('http://ex/x/y?q', 'y?q'), 'http://ex/x/y?q');
        assert.strictEqual(Url.resolve('http://ex?p', '/x/y?q'), 'http://ex/x/y?q');
        assert.strictEqual(Url.resolve('foo:a/b', 'c/d'), 'foo:a/c/d');
        assert.strictEqual(Url.resolve('foo:a/b', '/c/d'), 'foo:/c/d');
        assert.strictEqual(Url.resolve('foo:a/b?c#d', ''), 'foo:a/b?c');
        assert.strictEqual(Url.resolve('foo:a', 'b/c'), 'foo:b/c');
        assert.strictEqual(Url.resolve('foo:/a/y/z', '../b/c'), 'foo:/a/b/c');
        assert.strictEqual(Url.resolve('foo:a', './b/c'), 'foo:b/c');
        assert.strictEqual(Url.resolve('foo:a', '/./b/c'), 'foo:/b/c');
        assert.strictEqual(Url.resolve('foo://a//b/c', '../../d'), 'foo://a/d');
        assert.strictEqual(Url.resolve('foo:a', '.'), 'foo:');
        assert.strictEqual(Url.resolve('foo:a', '..'), 'foo:');

        // 50-57[cf. TimBL comments --
        //  http://lists.w3.org/Archives/Public/uri/2003Feb/0028.html,
        //  http://lists.w3.org/Archives/Public/uri/2003Jan/0008.html)
        assert.strictEqual(Url.resolve('http://example/x/y%2Fz', 'abc'), 'http://example/x/abc');
        assert.strictEqual(Url.resolve('http://example/a/x/y/z', '../../x%2Fabc'), 'http://example/a/x%2Fabc');
        assert.strictEqual(Url.resolve('http://example/a/x/y%2Fz', '../x%2Fabc'), 'http://example/a/x%2Fabc');
        assert.strictEqual(Url.resolve('http://example/x%2Fy/z', 'abc'), 'http://example/x%2Fy/abc');
        assert.strictEqual(Url.resolve('http://ex/x/y', 'q%3Ar'), 'http://ex/x/q%3Ar');
        assert.strictEqual(Url.resolve('http://example/x/y%2Fz', '/x%2Fabc'), 'http://example/x%2Fabc');
        assert.strictEqual(Url.resolve('http://example/x/y/z', '/x%2Fabc'), 'http://example/x%2Fabc');
        assert.strictEqual(Url.resolve('http://example/x/y%2Fz', '/x%2Fabc'), 'http://example/x%2Fabc');

        // 70-77
        assert.strictEqual(Url.resolve('mailto:local1@domain1?query1', 'local2@domain2'), 'mailto:local2@domain2');
        assert.strictEqual(Url.resolve('mailto:local1@domain1', 'local2@domain2?query2'), 'mailto:local2@domain2?query2');
        assert.strictEqual(Url.resolve('mailto:local1@domain1?query1', 'local2@domain2?query2'), 'mailto:local2@domain2?query2');
        assert.strictEqual(Url.resolve('mailto:local@domain?query1', '?query2'), 'mailto:local@domain?query2');
        assert.strictEqual(Url.resolve('mailto:?query1', 'local@domain?query2'), 'mailto:local@domain?query2');
        assert.strictEqual(Url.resolve('mailto:local@domain?query1', '?query2'), 'mailto:local@domain?query2');
        assert.strictEqual(Url.resolve('foo:bar', 'http://example/a/b?c/../d'), 'http://example/a/b?c/../d');
        assert.strictEqual(Url.resolve('foo:bar', 'http://example/a/b#c/../d'), 'http://example/a/b#c/../d');

        // 82-88
        // @isaacs Disagree. Not how browsers do it.
        assert.strictEqual(Url.resolve('http://example.org/base/uri', 'http:this'), 'http://example.org/base/this');
        assert.strictEqual(Url.resolve('http:base', 'http:this'), 'http:this');
        assert.strictEqual(Url.resolve('f:/a', './/g'), 'f://g');
        assert.strictEqual(Url.resolve('f://example.org/base/a', 'b/c//d/e'), 'f://example.org/base/b/c//d/e');
        assert.strictEqual(Url.resolve('mid:m@example.ord/c@example.org', 'm2@example.ord/c2@example.org'), 'mid:m@example.ord/m2@example.ord/c2@example.org');
        assert.strictEqual(Url.resolve('file:///C:/DEV/Haskell/lib/HXmlToolbox-3.01/examples/', 'mini1.xml'), 'file:///C:/DEV/Haskell/lib/HXmlToolbox-3.01/examples/mini1.xml');
        assert.strictEqual(Url.resolve('foo:a/y/z', '../b/c'), 'foo:a/b/c');

        //changeing auth
        assert.strictEqual(Url.resolve('http://asdf:qwer@www.example.com', 'http://diff:auth@www.example.com'), 'http://diff:auth@www.example.com/');

        // https://github.com/nodejs/node/issues/1435
        assert.strictEqual(Url.resolve('https://user:password@example.org/', 'https://another.host.com/'), 'https://another.host.com/');
        assert.strictEqual(Url.resolve('https://user:password@example.org/', '//another.host.com/'), 'https://another.host.com/');
        assert.strictEqual(Url.resolve('https://user:password@example.org/', 'http://another.host.com/'), 'http://another.host.com/');
        assert.strictEqual(Url.resolve('mailto:user@example.org', 'mailto:another.host.com'), 'mailto:user@another.host.com');
    });

    importModule("utility/text/url/url");
    QUnit.test("parseUrl", function (assert) {
        assert.deepEqual(parseUrl('http://tealui.com:8080/p/to.txt?q=1#f'), {
            href: "http://tealui.com:8080/p/to.txt?q=1#f",
            hash: "#f",
            host: "tealui.com:8080",
            hostname: "tealui.com",
            pathname: "/p/to.txt",
            port: "8080",
            protocol: "http:",
            search: "?q=1",
            query: "q=1"
        });

        assert.deepEqual(parseUrl('HTTP://www.example.com'), {
            hash: "",
            href: 'http://www.example.com/',
            protocol: 'http:',
            host: 'www.example.com',
            hostname: 'www.example.com',
            pathname: '/',
            port: "",
            query: "",
            search: ""
        });

    });
    QUnit.test("stringifyUrl", function (assert) {
        assert.strictEqual(stringifyUrl({
            href: "http://tealui.com:8080/p/to.txt?q=1#f",
            hash: "#f",
            host: "tealui.com:8080",
            hostname: "tealui.com",
            pathname: "/p/to.txt",
            port: "8080",
            protocol: "http:",
            search: "?q=1",
            query: "q=1"
        }), 'http://tealui.com:8080/p/to.txt?q=1#f');
    });
});

QUnit.module("xml", function() {
    
    importModule("utility/text/xml");
    QUnit.test("parseXML", function (assert) {
        assert.deepEqual(parseXML("<div/>").firstChild.nodeName, "div");
    });

});