---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
jsdoc: false
---
# Markdown 编译
编译 Markdown 为 HTML

```html demo hide doc
<textarea id="input" placholder="输入 Markdown"># Hello World</textarea> 
<button onclick="output.innerHTML = Markdown.toHTML(input.value)">编译</button>
<div id="output"></div>
```

## Hello World
直接使用 `Markdown.toHTML` 传入 Markdown 源码，返回编译后的结果。
```js
import Markdown from "util/markdown";

var r = Markdown.toHTML("# Hello World"); // => "<h1>Hello World</h1>"
```
