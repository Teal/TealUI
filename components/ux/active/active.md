---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 激活样式
快速切换当前选中的元素。

## 设计意图
项目中一般对输入框添加 `.active` 表示选中。

因此在标记为选中时需要：
```js
removeClass(oldActive, "active");
addClass(newActive, "active");
```

使用 `setActive` 可以简化代码为：
```js
setActive(items, "active", newActive);
```

通过 `setActive` 可以快速实现如选项卡之类的效果。
