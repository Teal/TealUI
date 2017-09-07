---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 简单字符串加密
通过位移实现的字符串加密和解密实现。

```html demo hide doc
<input type="text" id="input" placeholder="要加密的内容">
<button onclick="input.value = encryptString(input.value)">加密</button>
<button onclick="input.value = dencryptString(input.value)">解密</button>
```