---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 编码代码
编码代码（jjencode）

```html demo hide doc
<textarea id="input" placeholder="输入 JavaScript 代码"></textarea>
<input type="text" id="name" placeholder="编码变量名" value="$">
<button onclick="input.value = jjencode(input.value, name)">编码</button>
```