数据检验
========================================================
@description 检验数据合法性。

常用 API
--------------------------------------------------------
@doc check

校验密码复杂度
--------------------------------------------------------
@doc check/checkPassword.ts

<input type="text" id="checkPassword_value" placeholder="输入密码..." />
<input type="button" value="计算复杂度" onclick="document.getElementById('checkPassword_result').innerHTML = checkPassword(document.getElementById('checkPassword_value').value || (document.getElementById('checkPassword_value').value = '123456'))" />
<span id="checkPassword_result"></span>

校验身份证
--------------------------------------------------------
@doc check/parseChineseId.ts
@doc check/isChineseId.ts

<input type="text" id="parseChineseId_value" placeholder="输入身份证号..." />
<input type="button" value="解析" onclick="var idInfo = parseChineseId(document.getElementById('parseChineseId_value').value || (document.getElementById('parseChineseId_value').value = '152500198909267865')); document.getElementById('parseChineseId_result').innerHTML = '<br>合法：' + idInfo.valid + '<br>性别：' + (idInfo.sex ? '男' : '女') + '<br>省份：' + (idInfo.province || '') + '<br>生日： ' + idInfo.birthday.toLocaleString();" />
<span id="parseChineseId_result"></span>
