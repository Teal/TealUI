# 数字扩展

description: 扩展 Number 相关的 API。
author: xuld@vip.qq.com
keywords: 大数, 货币

## 常用 API

@utility/lang/number.js

## 其它 API

@utility/lang/numberEx.js

## 大整数加减

@utility/lang/bigInt.js

<input type="text" id="biginteger_x" value="1" />
<input type="text" id="biginteger_y" value="2" />
<input type="button" value="求和" onclick="document.getElementById('biginteger_result').innerHTML = BigInt.add(document.getElementById('biginteger_x').value, document.getElementById('biginteger_y').value)" />
<input type="button" value="求积" onclick="document.getElementById('biginteger_result').innerHTML = BigInt.mul(document.getElementById('biginteger_x').value, document.getElementById('biginteger_y').value)" />
<input type="button" value="求幂" onclick="document.getElementById('biginteger_result').innerHTML = BigInt.pow(document.getElementById('biginteger_x').value, document.getElementById('biginteger_y').value)" />
<span id="biginteger_result"></span>