---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 大数
提供大数精确运算的方法。

```html demo hide doc
<input type="text" id="inputX" placeholder="输入正整数" value="2" />
<input type="text" id="inputY" placeholder="输入正整数" value="3" />
<button onclick="output.innerHTML = new (require('util/bigNumber'))(inputX.value).add(inputY.value)">求和</button>
<button onclick="output.innerHTML = new (require('util/bigNumber'))(inputX.value).sub(inputY.value)">求差</button>
<button onclick="output.innerHTML = new (require('util/bigNumber'))(inputX.value).mul(inputY.value)">求积</button>
<button onclick="output.innerHTML = new (require('util/bigNumber'))(inputX.value).div(inputY.value)">求商</button>
<button onclick="output.innerHTML = new (require('util/bigNumber'))(inputX.value).pow(inputY.value)">求幂</button>
<span id="output"></span>
```

> 如果只需要大整数的加乘，可参考[[util/bigInteger]]。

> ##### 另参考
> - [BigNumber.Js 官网](http://mikemcl.github.io/bignumber.js/)
