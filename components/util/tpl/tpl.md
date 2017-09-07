---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 模板引擎
最简 EJS 风格模板引擎。仅 10 行代码！

```html demo hide doc
<textarea id="input" placholder="输入模板">Hello <%= $.name %>!</textarea> 
<input type="text" id="data" placholder="输入数据" value="{name: 'world'}" />
<button onclick="output.value = tpl(input.value, eval('(' + data.value + ')'))">执行模板</button>
<textarea id="output"></textarea>
```

## 语法说明
在模板中，使用 `<% ... %>` 插入一个 JavaScript 代码段。
如 `<% console.log('hello'); %>`。

如果需要将代码段的执行结果添加到结果，则使用 `<%= ... %>`，如 `Hello <%= 1 + 1 %>` 最终生成 `Hello 2`。

## 缓存模板
模板的原理是先编译为 JavaScript 函数，同一份模板编译后的函数相同。
如果一份目标需要多次使用，建议缓存编译后的函数。
```js
// 编译为函数并缓存。
var func = tpl("Hello <%= $.name %>!");

// 执行模板。
var result = func({name: "world"});
```