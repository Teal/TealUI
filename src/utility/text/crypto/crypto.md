加密算法
========================================================

字符串简单可逆加密
--------------------------------------------------------
@doc encryption/encryptString.ts
@doc encryption/dencryptString.ts

<input type="text" id="stringEncryption_value">
<input type="button" value="加密" onclick="document.getElementById('stringEncryption_value').value = encryptString(document.getElementById('stringEncryption_value').value)">
<input type="button" value="解密" onclick="document.getElementById('stringEncryption_value').value = dencryptString(document.getElementById('stringEncryption_value').value)">

MD5 加密
--------------------------------------------------------
@doc encryption/md5.ts
@doc encryption/md5Ex.ts

<input type="text" id="md5_value" style="width: 300px;" />
<input type="button" value="MD5 加密" onclick="document.getElementById('md5_value').value = md5(document.getElementById('md5_value').value)" />
<input type="button" value="HMAC MD5 加密" onclick="document.getElementById('md5_value').value = md5.hmacMd5(document.getElementById('md5_value').value, 'key')" />
<input type="button" value="base64 Md5 加密" onclick="document.getElementById('md5_value').value = md5.base64Md5(document.getElementById('md5_value').value)" />
<input type="button" value="hmacMd5 & HMAC Md5 加密" onclick="document.getElementById('md5_value').value = md5.base64HmacMd5(document.getElementById('md5_value').value, 'key')" />

SHA-1 加密
--------------------------------------------------------
@doc encryption/sha1.ts

<input type="text" id="sha1_value">
<input type="button" value="SHA-1 加密" onclick="document.getElementById('sha1_value').value = sha1(document.getElementById('sha1_value').value)">

> 更完整的 SHA 加密算法请参考：[jsSHA](http://caligatio.github.io/jsSHA/)。

DES 加密
--------------------------------------------------------
@doc encryption/des.ts

<input type="text" id="des_value" placeholder="输入文本..."> 
<input type="text" id="des_key" placeholder="输入密钥..."> 
<input type="button" value="DES 加密" onclick="document.getElementById('des_value').value = des(document.getElementById('des_value').value, document.getElementById('des_key').value)">
