---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 模板引擎
最简 EJS（ASP/JSP）风格模板引擎：仅 10 行代码！

```html demo hide doc
<textarea id="input" placeholder="输入模板">Hello <%= $.name %>!</textarea> 
<input type="text" id="data" placeholder="输入数据" value='{name: "World"}' />
<button onclick="output.value = tpl(input.value, eval('(' + data.value + ')'))">渲染模板</button>
<textarea id="output" placeholder="渲染结果"></textarea>
```

## Hello World
直接使用 [`tpl`](#api/tpl) 传入模板内容和数据返回渲染后的结果。
```js
import tpl from "util/tpl";

var r = tpl("Hello <%= $.name %>!", {name: "World"}); // => "Hello world!"
```

## 缓存模板
模板引擎的原理是先将模板编译为 JavaScript 函数然后调用并渲染。
如果同一份模板需要反复使用，建议缓存编译后的函数以提升渲染性能。
```js
// 编译为函数并缓存。
var func = tpl("Hello <%= $.name %>!");

// 执行模板。
var result1 = func({name: "World1"}); // => "Hello world1!"
var result2 = func({name: "world2"}); // => "Hello world2!"
```

## 模板语法
在模板中，使用 `<% ... %>` 插入一个 JavaScript 代码段。
如 `<% console.log('hello'); %>`。

如果需要将代码段的执行结果添加到输出，则使用 `<%= ... %>`，如 `Hello <%= 1 + 1 %>` 最终生成 `Hello 2`。

> ##### 另参考
> - [EJS](http://www.embeddedjs.com/)
