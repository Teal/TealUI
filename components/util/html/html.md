---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# HTML 编码
HTML 特殊字符编码

```html demo hide doc
<input type="text" id="input" placeholder="输入 HTML 片段" value="<tag>" />
<button onclick="input.value = encodeHTML(input.value || '')">HTML 编码</button>
<button onclick="input.value = encodeHTMLAttribute(input.value || '')">HTML 属性编码</button>
<button onclick="input.value = decodeHTML(input.value || '')">HTML 解码</button>
```