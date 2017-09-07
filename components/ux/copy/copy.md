---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 复制
复制内容到剪贴板。

```html demo hide doc
<input type="text" id="input" placholder="输入内容" value="Hello" />
<button onclick="copy(input.value) || prompt('您的浏览器版本太低，请按 Ctrl+C 手动复制。', input.value)">复制</button>
```