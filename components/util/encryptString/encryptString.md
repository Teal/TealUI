---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 简单字符串加密
通过位移加密和解密字符串。

```html demo hide doc
<input type="text" id="input" placeholder="要加密的内容，至少两位">
<button onclick="input.value = encryptString(input.value)">加密</button>
<button onclick="input.value = dencryptString(input.value)">解密</button>
```