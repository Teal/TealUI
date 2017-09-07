---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# Base64 编码
提供 Base 64 编码和解码实现。

```html demo hide doc
<input type="text" id="input" placeholder="输入任意内容" />
<button onclick="input.value = encodeBase64(input.value)">Base64 编码</button>
<button onclick="input.value = decodeBase64(input.value)">Base64 解码</button>
<button onclick="input.value = btoa(input.value)">Base64 编码(仅支持英文)</button>
<button onclick="input.value = atob(input.value)">Base64 解码(仅支持英文)</button>
```

> ##### (i)提示
> 除了 IE6-8 其它浏览器已内置 btoa/atob，但其不支持中文。