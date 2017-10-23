---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 箭头
实现四个方向的箭头效果。

<style>
    .doc-box {
        position: relative;
        border: 1px solid #00a192;
        background-color: #fff;
        overflow: visible;
    }
</style>

## 基本用法
为容器添加 `<span class="x-arrow">` 即可添加箭头，箭头可使用 `.x-arrow-*`(其中 `*` 可以是：`top`、`bottom`、`left` 或 `right`)指示方向。
```html demo
<div class="doc-box"><span class="x-arrow x-arrow-top"></span></div>
---
<div class="doc-box"><span class="x-arrow x-arrow-bottom"></span></div>
---
<div class="doc-box"><span class="x-arrow x-arrow-left"></span></div>
---
<div class="doc-box"><span class="x-arrow x-arrow-right"></span></div>
```
箭头的实现原理是基于边框。

## 空心箭头
使用 `.x-arrow-bordered` 使箭头内部留白。
```html demo
<div class="doc-box"><span class="x-arrow x-arrow-bordered x-arrow-top"></span></div>
---
<div class="doc-box"><span class="x-arrow x-arrow-bordered x-arrow-bottom"></span></div>
---
<div class="doc-box"><span class="x-arrow x-arrow-bordered x-arrow-left"></span></div>
---
<div class="doc-box"><span class="x-arrow x-arrow-bordered x-arrow-right"></span></div>
```

## 自定义位置
箭头默认居中（`left: 50%`）。可以使用 `left` 等定位更改位置。
```html demo
<div class="doc-box">
    <span class="x-arrow x-arrow-top" style="left: auto; right: 20px;"></span>
</div>
```

## 自定义颜色
箭头的默认颜色为容器的边框颜色，默认背景色为全局背景色。
```html demo
<div class="doc-box">
    <span class="x-arrow x-arrow-top" style="border-bottom-color: red"></span>
</div>
```

## 自定义方向
通过 CSS 旋转改变箭头方向。
```html demo
<div id="customColor" class="doc-box">
    <span class="x-arrow x-arrow-top" style="-moz-transform: rotate(45deg); -webikit-transform: rotate(45deg); transform: rotate(45deg); left: auto; right: -7px; top: -7px"></span>
</div>
```
