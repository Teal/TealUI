---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 密码复杂度
测试密码的复杂度。

```html demo hide doc
<input type="text" id="input" placeholder="输入密码" value="123456" />
<button onclick="var r = checkPassword(input.value.trim()); output.innerHTML = r + ' ' + (r < 0 ? '太简单' : r == 0 ? '简单' : r < 3 ? '复杂' : '很复杂')">测试</button>
<span id="output"></span>
```

## 原理
确定密码复杂度主要考查以下内容：
- 密码越长，复杂度越大。
- 将字符分为四类：数字、小写字母、大写字母、其它字符。字符种类数越多，复杂度越大。
- 重复、连续字符越多，复杂度越小。
- 出现“asd”、“qwe”、“a123456”等常用密码的次数越高，复杂度越小。