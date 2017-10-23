---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 大正整数
提供大正整数精确加和乘的方法。

```html demo hide doc
<input type="text" id="input1" placeholder="输入正整数" value="2" />
<input type="text" id="input2" placeholder="输入正整数" value="3" />
<button onclick="output.innerHTML = add(input1.value, input2.value)">求和</button>
<button onclick="output.innerHTML = mul(input1.value, input2.value)">求积</button>
<span id="output"></span>
```

> 更多大数计算功能见[[util/bigNumber]]。