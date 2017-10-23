---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# JavaScript 压缩格式化
UglifyJS JavaScript 压缩格式化。

```html demo hide doc
<textarea id="input" placeholder="输入 JavaScript 代码"></textarea>
<button onclick="input.value = minify(input.value).code || (input.value && alert(minify(input.value).error), input.value)">压缩</button>
<button onclick="input.value = minify(input.value, {output: {beautify: true}}).code || (input.value && alert(minify(input.value, {output: {beautify: true}}).error), input.value)">格式化</button>
```

> ##### 另参考
> - https://github.com/mishoo/UglifyJS2