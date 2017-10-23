---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 格式化时间
格式化时间为中文可读格式（如“3 分钟前”）。

```html demo hide doc
<input type="datetime" id="input" placeholder="输入日期" value="2010/1/1 10:00:00" />
<button onclick="output.innerHTML = formatDateToChinese(new Date(input.value))" />转为可读格式</button>
<span id="output"></span>
```
