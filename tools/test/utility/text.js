
QUnit.module("crypto", function () {

    importModule("utility/text/crypto/simple");
    QUnit.test("simple", function (assert) {
        assert.strictEqual(decryptSimple(encryptSimple('value')), 'value');
        assert.strictEqual(decryptSimple(encryptSimple('中文')), '中文');
    });

    importModule("utility/text/crypto/md5");
    QUnit.test("md5", function (assert) {
        assert.strictEqual(md5('value'), '2063c1608d6e0baf80249c42e2be5804');
        assert.strictEqual(md5('中文'), 'a7bac2239fcdcb3a067903d8077c4a07');
        assert.strictEqual(md5(''), 'd41d8cd98f00b204e9800998ecf8427e');
        assert.strictEqual(md5('a'), '0cc175b9c0f1b6a831c399e269772661');
        assert.strictEqual(md5('abc'), '900150983cd24fb0d6963f7d28e17f72');
        assert.strictEqual(md5("message digest"), "f96b697d7cb7938d525a2f31aaf161d0");
        assert.strictEqual(md5("abcdefghijklmnopqrstuvwxyz"), "c3fcd3d76192e4007dfb496cca67e13b");
        assert.strictEqual(md5("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"), "d174ab98d277d9f5a5611c2c9f419d9f");
        assert.strictEqual(md5('hello'), '5d41402abc4b2a76b9719d911017c592');
        assert.strictEqual(md5(repeat('a', 53)), "e9e7e260dce84ffa6e0e7eb5fd9d37fc")
        assert.strictEqual(md5(repeat('a', 54)), "eced9e0b81ef2bba605cbc5e2e76a1d0")
        assert.strictEqual(md5(repeat('a', 55)), "ef1772b6dff9a122358552954ad0df65")
        assert.strictEqual(md5(repeat('a', 56)), "3b0c8ac703f828b04c6c197006d17218")
        assert.strictEqual(md5(repeat('a', 57)), "652b906d60af96844ebd21b674f35e93")
        assert.strictEqual(md5(repeat('a', 63)), "b06521f39153d618550606be297466d5")
        assert.strictEqual(md5(repeat('a', 64)), "014842d480b571495a4a0363793f7367")
        assert.strictEqual(md5(repeat('a', 65)), "c743a45e0d2e6a95cb859adae0248435")
        assert.strictEqual(md5(repeat('a', 255)), "46bc249a5a8fc5d622cf12c42c463ae0")
        assert.strictEqual(md5(repeat('a', 256)), "81109eec5aa1a284fb5327b10e9c16b9")

        function repeat(s, len) {
            return new Array(len + 1).join(s);
        }
    });

    importModule("utility/text/crypto/md5.ext");
    QUnit.test("md5.base64", function (assert) {
        assert.strictEqual(md5.base64('value', 'key'), 'IGPBYI1uC6+AJJxC4r5YBA');
        assert.strictEqual(md5.base64('中文'), 'p7rCI5/NyzoGeQPYB3xKBw');
    });
    QUnit.test("md5.hmac", function (assert) {
        assert.strictEqual(md5.hmac('value', 'key'), '01433efd5f16327ea4b31144572c67f6');
        assert.strictEqual(md5.hmac('中文', '中文'), '05fe3b294344f4e93c811e10f9825a38');
    });
    QUnit.test("md5.hmacBase64", function (assert) {
        assert.strictEqual(md5.hmacBase64('value'), 'hma9GehtpZrNyf4kJBytUw');
        assert.strictEqual(md5.hmacBase64('中文', '中文'), 'Bf47KUNE9Ok8gR4Q+YJaOA');
    });

    importModule("utility/text/crypto/des");
    QUnit.test("des", function (assert) {
        assert.strictEqual(btoa(des('value', 'key')), 'bBzVQ8LJULA4F5FoUzwp2A==');
        assert.strictEqual(btoa(des('中文', '中文')), '+aUhkUR47Ww=');

        assert.strictEqual(des(atob('bBzVQ8LJULA4F5FoUzwp2A=='), 'key', true), 'value');
        assert.strictEqual(des(atob('+aUhkUR47Ww='), '中文', true), '中文');
    });

    importModule("utility/text/crypto/sha1");
    QUnit.test("sha1", function (assert) {
        assert.strictEqual(sha1('message'), '6f9b9af3cd6e8b8a73c2cdced37fe9f59226e27d');
        assert.strictEqual(sha1('value'), 'f32b67c7e26342af42efabc674d441dca0a281c5');
        assert.strictEqual(sha1('中文'), 'ebb68d6dc40f01031f4fd1d6f7fd19cf941a129a');
    });

});
