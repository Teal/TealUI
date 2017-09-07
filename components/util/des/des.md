---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# DES 加密
DES 加密和解密实现。

```html demo hide doc
<input type="text" id="input" placeholder="输入任意内容" /> 
<input type="text" id="key" placeholder="输入加解密的键" value="key" /> 
<button onclick="input.value = des(input.value, key.value)" />DES 加密</button>
<button onclick="input.value = des(input.value, key.value, true)">DES 解密</button>
```