---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 工具样式扩展
提供更多的工具样式

## 定位
- `x-relative`: 相对定位
- `x-absolute`: 绝对定位
```html demo
<div class="x-relative" style="height: 20px">
    <div class="x-absolute" style="left: 20px">
        绝对定位
    </div>
</div>
```

## 边框
- `x-dotted`: 点线边框
- `x-dashed`: 虚线边框
```html demo
<hr class="x-dotted">
<hr class="x-dashed">
```
