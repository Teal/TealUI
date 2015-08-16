# 货币处理

## 货币运算

<input type="text" id="currency_input" value="0" />
<input type="button" value="保留两位小数" onclick="document.getElementById('currency_result').innerHTML = Currency.round(+document.getElementById('currency_input').value)" />
<input type="button" value="转数字金额" onclick="document.getElementById('currency_result').innerHTML = Currency.toString(+document.getElementById('currency_input').value)" />
<input type="button" value="转中文大写金额" onclick="document.getElementById('currency_result').innerHTML = Currency.toChinese(+document.getElementById('currency_input').value)" />
<span id="currency_result"></span>

@api utility/misc/currency.js

> #### !注意
> 货币组件支持计算的最大货币为：10,000,000,000,000.00，如需支持更大范围，请使用[大数](bigNumber.html)组件。

## 格式化货币

@api utility/misc/formatCurrencyToChinese.js
