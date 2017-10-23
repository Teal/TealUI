---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# MD5 算法变种
提供更多 MD5 算法变种。

```html demo doc hide
<input type="text" id="input" style="width: 20em;" />
<button onclick="input.value = md5Base64(input.value)">Md5-Base64 加密</button>
<button onclick="input.value = hmacMD5(input.value, 'key')">HMAC-MD5 加密</button>
<button onclick="input.value = hmacMD5Base64(input.value, 'key')">HMAC-MD5-Base64 加密</button>
```