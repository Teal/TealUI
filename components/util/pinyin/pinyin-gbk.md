---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 汉字转拼音（繁体）
扩展更多字库

```html demo doc hide
<input type="text" id="input" placeholder="输入中文" value="中文" />
<button onclick="input.value = getPinYin(input.value).map(x=>x.join('|')).join(' ')">转为拼音</button>
```
