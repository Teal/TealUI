---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 简繁体转换
简繁体中文转换。

```html demo hide doc
<input type="text" id="input" placeholder="输入中文" value="简体" />
<button onclick="input.value = toTradionalChinese(input.value)">转繁体</button>
<button onclick="input.value = toSimpleChinese(input.value)">转简体</button>
```

> ##### (i)实现原理
> 在源码中有一个繁简字检索表，函数会检索此表得到对应繁体或简体。
