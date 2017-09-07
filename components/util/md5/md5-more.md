---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# MD5 加密扩展
MD5 加密算法扩展。

```html demo doc hide
<input type="text" id="input" style="width: 20em;" />
<button onclick="input.value = hmacMd5(input.value, 'key')">HMAC MD5 加密</button>
<button onclick="input.value = base64Md5(input.value)">base64 Md5 加密</button>
<button onclick="input.value = base64HmacMd5(input.value, 'key')">hmacMd5 &amp; HMAC Md5 加密</button>
```