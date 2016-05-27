## 字符串简单可逆加密

<input type="text" id="stringEncryption_value"> <input type="button" value="加密" onclick="document.getElementById('stringEncryption_value').value = encryptString(document.getElementById('stringEncryption_value').value)"> <input type="button" value="解密" onclick="document.getElementById('stringEncryption_value').value = dencryptString(document.getElementById('stringEncryption_value').value)">

<script x-doc="utility/text/stringEncryption.js">Doc.writeApi({ path: "utility/text/stringEncryption.js", apis: [{ name: "encryptString", summary: "<p>加密指定的字符串。</p>", params: [{ type: "String", name: "str", summary: "<p>要加密的字符串。</p>" }, { type: "Number", name: "key", summary: "<p>加密的密钥。</p>" }], returns: { type: "String", summary: "<p>返回加密后的字符串。</p>" }, example: "<pre>encryptString(\"abc\", 123) // \"``e\"</pre>", line: 2, col: 1 }, { name: "dencryptString", summary: "<p>解密指定的字符串。</p>", params: [{ type: "String", name: "str", summary: "<p>要解密的字符串。</p>" }, { type: "key", name: "str", summary: "<p>解密的密钥。</p>" }], returns: { type: "String", summary: "<p>返回解密后的字符串。</p>" }, example: "<pre>dencryptString(\"abc\", 123) // \"cce\"</pre>", line: 24, col: 1 }] });</script>

## MD5 加密

<input type="text" id="md5_value" style="width: 300px;"> <input type="button" value="MD5 加密" onclick="document.getElementById('md5_value').value = md5(document.getElementById('md5_value').value)"> <input type="button" value="HMAC MD5 加密" onclick="document.getElementById('md5_value').value = md5.hmacMd5(document.getElementById('md5_value').value, 'key')"> <input type="button" value="base64 Md5 加密" onclick="document.getElementById('md5_value').value = md5.base64Md5(document.getElementById('md5_value').value)"> <input type="button" value="hmacMd5 &amp; HMAC Md5 加密" onclick="document.getElementById('md5_value').value = md5.base64HmacMd5(document.getElementById('md5_value').value, 'key')">

<script x-doc="utility/text/md5.js">Doc.writeApi({ path: "utility/text/md5.js", apis: [{ name: "md5", summary: "<p>计算一个字符串的 MD5 值。</p>", params: [{ type: "String", name: "str", summary: "<p>要计算的字符串。</p>" }], returns: { type: "String", summary: "<p>返回 <em>str</em> 加密后的字符串。其所有字符均为小写。</p>" }, example: "<pre>md5(\"a\") // \"0cc175b9c0f1b6a831c399e269772661\"</pre>", line: 5, col: 1 }] });</script>

## MD5 加密扩展

<script x-doc="utility/text/md5Ex.js">Doc.writeApi({ path: "utility/text/md5Ex.js", apis: [{ memberOf: "md5", name: "hmacMd5", summary: "<p>计算一个字符串的 HMAC-MD5 值。</p>", params: [{ type: "String", name: "str", summary: "<p>要计算的字符串。</p>" }, { type: "String", name: "key", summary: "<p>加密的密钥。</p>" }], returns: { type: "String", summary: "<p>返回 <em>str</em> 加密后的字符串。其所有字符均为大写。</p>" }, example: "<pre>md5.hmacMd5(\"abc\", \"key\") // \"d2fe98063f876b03193afb49b4979591\"</pre>", line: 7, col: 1 }, { memberOf: "md5", name: "base64Md5", summary: "<p>计算一个字符串的 Base64-MD5 值。</p>", params: [{ type: "String", name: "str", summary: "<p>要计算的字符串。</p>" }], returns: { type: "String", summary: "<p>返回 <em>str</em> 加密后的字符串。其所有字符均为大写。</p>" }, example: "<pre>md5.base64Md5(\"abc\") // \"kAFQmDzST7DWlj99KOF/cg\"</pre>", line: 41, col: 1 }, { memberOf: "md5", name: "base64HmacMd5", summary: "<p>计算一个字符串的 Base64-MD5 值。</p>", params: [{ type: "String", name: "str", summary: "<p>要计算的字符串。</p>" }, { type: "String", name: "key", summary: "<p>加密的密钥。</p>" }], returns: { type: "String", summary: "<p>返回 <em>str</em> 加密后的字符串。其所有字符均为大写。</p>" }, example: "<pre>md5.base64HmacMd5(\"abc\", \"key\") // \"0v6YBj+HawMZOvtJtJeVkQ\"</pre>", line: 73, col: 1 }] });</script>

## SHA-1 加密

<input type="text" id="sha1_value" style="width: 300px;"> <input type="button" value="SHA-1 加密" onclick="document.getElementById('sha1_value').value = sha1(document.getElementById('sha1_value').value)">

<script x-doc="utility/text/sha1.js">Doc.writeApi({ path: "utility/text/sha1.js", apis: [{ name: "sha1", summary: "<p>计算一个字符串的 SHA-1 值。</p>", params: [{ type: "String", name: "str", summary: "<p>要计算的字符串。</p>" }], returns: { type: "String", summary: "<p>返回 <em>str</em> 加密后的字符串。其所有字符均为小写。</p>" }, example: "<pre>sha1(\"abc\") // \"a9993e364706816aba3e25717850c26c9cd0d89d\"</pre>", line: 17, col: 1 }] });</script>

> 更完整的 SHA 加密算法请参考：[jsSHA](http://caligatio.github.io/jsSHA/)。

## DES 加密

<input type="text" id="des_value" style="width: 300px;"> 密钥：<input type="text" id="des_key"> <input type="button" value="DES 加密" onclick="document.getElementById('des_value').value = des(document.getElementById('des_value').value, document.getElementById('des_key').value)">

<script x-doc="utility/text/des.js">Doc.writeApi({ path: "utility/text/des.js", apis: [{ name: "des", summary: "<p>计算一个字符串的 DES 值。</p>", params: [{ type: "String", name: "str", summary: "<p>要计算的字符串。</p>" }, { type: "String", name: "key", summary: "<p>加密使用的密钥。</p>" }, { type: "Boolean", name: "mode", optional: true, summary: "<p>加密模式。</p>" }, { type: "String", name: "iv", optional: true, summary: "<p>初始向量。</p>" }, { type: "Number", name: "padding", optional: true, summary: "<p>对齐字符数。</p>" }], returns: { type: "String", summary: "<p>返回 <em>str</em> 加密后的字符串。</p>" }, example: "<pre>des(\"a\", \"1\") // \"UDtçø\"</pre>", line: 17, col: 1 }] });</script>