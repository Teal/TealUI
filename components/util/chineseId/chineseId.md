---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 中国身份证号处理
中国身份证号处理

```html demo hide doc
<input type="text" id="input" placeholder="输入身份证号" value="152500198909267865" />
<button onclick="var idInfo = parseChineseId(input.value); output.innerHTML = '合法：' + idInfo.valid + '<br>性别：' + (idInfo.sex ? '男' : '女') + '<br>省份：' + (idInfo.province || '') + '<br>生日： ' + idInfo.birthday.toLocaleString();">校验中国身份证</button>
<div id="output"></div>
```