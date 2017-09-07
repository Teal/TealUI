---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# UTF-8 编码
提供 \u#### 格式的 Unicode 字符编码和解码实现。

```html demo hide doc
<input type="text" id="input" placeholder="输入中文" value="中文" />
<button onclick="input.value = encodeUTF8(input.value)">UTF8 编码</button>
<button onclick="input.value = decodeUTF8(input.value)">UTF8 解码</button>
```