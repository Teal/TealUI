---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 状态
快速读写状态 CSS 类名。

## 设计意图
项目中一般对输入框添加 `.input-success` 表示成功，添加 `.input-error` 表示失败。

因此在标记为失败时需要：
```js
removeClass(input, "input-success");
addClass(input, "input-error");
```

使用 `setStatus` 可以简化代码为：
```js
setStatus(input, "input-", "error");
```

通过 `setStatus` 可以快速切换输入框的状态。
