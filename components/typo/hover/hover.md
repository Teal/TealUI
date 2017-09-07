---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 悬浮隐藏
隐藏一些元素并在鼠标移上后显示。

## 基本用法
将需要隐藏的元素放在 `.x-hover-show` 中，当鼠标移到 `.x-hover` 时会自动显示。
```html demo doc
<button class="x-hover">
    文字 <span class="x-hover-show">我只在鼠标移上后显示</span>
</button>
```
