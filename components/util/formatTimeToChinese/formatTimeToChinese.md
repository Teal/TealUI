---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 格式化时间
格式化时间为“N 秒前”格式。

```html demo hide doc
<input type="text" id="input" placeholder="输入日期" value="2010/1/1 10:00:00" />
<button onclick="output.innerHTML = formatTimeToChinese(new Date(input.value))" />转为“N 秒前”格式</button>
<span id="output"></span>
```
