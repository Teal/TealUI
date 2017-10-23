---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
jsdoc: false
exportDefault: BigNumber
---
# 大数
提供大数精确运算的方法。

```html demo hide doc
<input type="text" id="input1" placeholder="输入正整数" value="2" />
<input type="text" id="input2" placeholder="输入正整数" value="3" />
<button onclick="output.innerHTML = new BigNumber(input1.value).add(input2.value)">求和</button>
<button onclick="output.innerHTML = new BigNumber(input1.value).sub(input2.value)">求差</button>
<button onclick="output.innerHTML = new BigNumber(input1.value).mul(input2.value)">求积</button>
<button onclick="output.innerHTML = new BigNumber(input1.value).div(input2.value)">求商</button>
<button onclick="output.innerHTML = new BigNumber(input1.value).pow(input2.value)">求幂</button>
<span id="output"></span>
```

> ##### 另参考
> - [[util/bigInteger]]
> - [BigNumber.Js 官网](http://mikemcl.github.io/bignumber.js/)
