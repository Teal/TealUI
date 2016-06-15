数字(Number)扩展
========================================================

常用 API
------------------------------------------
@api number/number.js

# 大数运算

@description 提供大数精确运算的方法。

数字计算技巧
------------------------------------------
### 获取数字的整数位数

```
Math.log(x)/Math.log(10) + 1
```

对于已支持 ES6 的浏览器，可以直接使用：

```
Math.log10(x) + 1
```


## 大整数加减

@utility/lang/bigInt.js

<input type="text" id="biginteger_x" value="1" />
<input type="text" id="biginteger_y" value="2" />
<input type="button" value="求和" onclick="document.getElementById('biginteger_result').innerHTML = BigInt.add(document.getElementById('biginteger_x').value, document.getElementById('biginteger_y').value)" />
<input type="button" value="求积" onclick="document.getElementById('biginteger_result').innerHTML = BigInt.mul(document.getElementById('biginteger_x').value, document.getElementById('biginteger_y').value)" />
<input type="button" value="求幂" onclick="document.getElementById('biginteger_result').innerHTML = BigInt.pow(document.getElementById('biginteger_x').value, document.getElementById('biginteger_y').value)" />
<span id="biginteger_result"></span>

## 大数计算

<input type="text" id="bignumber_x" value="1" />
<input type="text" id="bignumber_y" value="2" />
<input type="button" value="求和" onclick="document.getElementById('bignumber_result').innerHTML = new BigNumber(document.getElementById('bignumber_x').value).add(document.getElementById('bignumber_y').value)" />
<input type="button" value="求差" onclick="document.getElementById('bignumber_result').innerHTML = new BigNumber(document.getElementById('bignumber_x').value).sub(document.getElementById('bignumber_y').value)" />
<input type="button" value="求积" onclick="document.getElementById('bignumber_result').innerHTML = new BigNumber(document.getElementById('bignumber_x').value).mul(document.getElementById('bignumber_y').value)" />
<input type="button" value="求商" onclick="document.getElementById('bignumber_result').innerHTML = new BigNumber(document.getElementById('bignumber_x').value).div(document.getElementById('bignumber_y').value)" />
<input type="button" value="求幂" onclick="document.getElementById('bignumber_result').innerHTML = new BigNumber(document.getElementById('bignumber_x').value).pow(document.getElementById('bignumber_y').value)" />
<span id="bignumber_result"></span>

使用大数计算库可对任意大的数字进行无误差计算。

> 更多请参考：[BigNumber.Js 官网](https://github.com/MikeMcl/bignumber.js/)


