---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 委托
允许动态增删要执行的函数。

## 基本用法
委托即函数数组。执行委托即执行数组中的每个函数。函数数组可以动态增删函数，以此增加程序的灵活性。
```js
import Delegate from "util/delegate";

document.onclick = new Delegate();              // 创建新的委托。
document.onclick.add(function() { alert(1) });   // 添加委托函数。
document.onclick.add(function() { alert(2) });   // 添加委托函数。
```
