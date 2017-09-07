---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
keyword:
    - 叉
---
# 关闭按钮
关闭按钮。

## 基本用法
```html demo
<button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button>
请看右边 →_→
```

## 基于图标

您也可以不使用此组件，直接使用图标实现关闭按钮效果。
```html demo
<a href="javascript://关闭" class="x-icon" title="关闭" style="text-decoration:none;">✖</a>
```

> Safari Mobile 要求可点击链接必须有 href, 因此这里不能删除 href。具体参考 [click 事件文档](https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile)。
