---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 选中样式
快速切换当前选中的元素。

## 目的
项目中一般通过添加 `.active` CSS 类名表示选中。使用 `setSelected` 可以快速切换：
```js
setSelected([elem1, elem2, elem3], "active", elem2);

// 等效于以下代码：
// removeClass(elem1, "active");
// addClass(elem2, "active");
// removeClass(elem3, "active");
```
