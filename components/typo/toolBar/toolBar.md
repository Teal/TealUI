---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
    - typo/hover
    - typo/util
---
# 工具条
网页工具条，显示常用链接。

## 基本用法
```html demo
<div class="x-toolbar">
    <a href="###"><i class="x-icon">🖒</i>对我有用(23)</a>
    <a href="###"><i class="x-icon">🖓</i>对我没用(23)</a>
    <a href="###"><i class="x-icon">✰</i>收藏(23)</a>
    <a href="###"><i class="x-icon">✍</i>编辑</a>
    <a href="###"><i class="x-icon">📞</i>举报</a>
</div>
```

## 默认隐藏部分按钮
使用[[typo/hover]]实现鼠标移上后显示。
```html demo
<div class="x-toolbar x-hover">
    <a href="###"><i class="x-icon">🖒</i>对我有用(23)</a>
    <a href="###"><i class="x-icon">🖓</i>对我没用(23)</a>
    <a href="###"><i class="x-icon">✰</i>收藏(23)</a>
    <a href="###" class="x-hover-show"><i class="x-icon">✍</i>编辑</a>
    <a href="###" class="x-hover-show"><i class="x-icon">📞</i>举报</a>
</div>
```

## 右浮动
```html demo
<div class="x-toolbar x-toolbar-right">
    <span>排序：</span>
    <a href="###" class="x-toolbar-active">关联度</a>
    <a href="###">人气值</a>
    <a href="###">更新时间</a>
</div>
```
