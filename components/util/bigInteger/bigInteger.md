---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 大整数
提供大正整数确加和乘的方法。

```html demo hide doc
<input type="text" id="inputX" placeholder="输入正整数" value="2" />
<input type="text" id="inputY" placeholder="输入正整数" value="3" />
<button onclick="output.innerHTML = add(inputX.value, inputY.value)">求和</button>
<button onclick="output.innerHTML = mul(inputX.value, inputY.value)">求积</button>
<span id="output"></span>
```

> 完整的大数计算见[[util/bigNumber]]。