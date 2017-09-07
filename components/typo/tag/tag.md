---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/close
    - typo/icon
---
# 标签
标签可用于显示附加关键字列表和一些强化文本。

## 基本用法
```html demo
文本：<span class="x-tag">默认</span>
<a href="###" class="x-tag">链接</a>
<a href="###" class="x-tag">•••</a>
```

## 颜色
```html demo
<a href="###" class="x-tag">默认</a>
---
<a href="###" class="x-tag x-tag-info">信息</a>
---
<a href="###" class="x-tag x-tag-success">成功</a>
---
<a href="###" class="x-tag x-tag-warning">警告</a>
---
<a href="###" class="x-tag x-tag-error">错误</a>
```

## 关闭按钮
结合[[typo/close]]显示可操作的标签。
```html demo
<span class="x-tag">技术宅<button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button></span>
<a href="###" class="x-tag">链接</a>
```
