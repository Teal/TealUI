---
jsdoc: false
---
# TypeScript 编译
TypeScript 编译到 JavaScript。

```html demo hide doc
<textarea id="input" placeholder="输入 TypeScript 代码"></textarea>
<button onclick="output.value = ts.transpileModule(input.value, {}).outputText">编译</button>
<textarea id="output" placeholder="生成的 JavaScript 代码"></textarea>
```

> ##### 另参考
> - http://www.typescriptlang.org/