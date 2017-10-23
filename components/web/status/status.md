---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 状态
快速切换 CSS 类名。

## 目的
项目中一般对输入框添加 `.input-success` CSS 类名表示成功，添加 `.input-error` CSS 类名表示失败。
使用 `setStatus` 可以快速设置输入框的状态：
```js
setStatus(input, "input-", "error");

// 等效于以下代码：
// removeClass(input, "input-success");
// addClass(input, "input-error");
```
