<style>.doc-box { position: relative; border: 1px solid #FF9800; background-color: #fff; overflow: visible; }</style>

## 基本用法

<link rel="stylesheet" type="text/css" href="../../typography/partial/arrow.css" data-doc="">

为容器添加 `span.x-arrow` 即可添加箭头，箭头可使用 `.x-arrow-*`(其中 `*` 可以是：`top`、`bottom`、`left` 或 `right`)指示方向。

<aside class="doc-demo">

<div class="doc-box"><span class="x-arrow x-arrow-top"></span></div>

<div class="doc-box"><span class="x-arrow x-arrow-bottom"></span></div>

<div class="doc-box"><span class="x-arrow x-arrow-left"></span></div>

<div class="doc-box"><span class="x-arrow x-arrow-right"></span></div>

</aside>

## 自定义箭头

箭头的实现原理是基于边框实现。

### 空心箭头

在实心箭头上叠加一个白色背景的箭头可以实现空心箭头效果。

<aside class="doc-demo">

<div id="customForeColor" class="doc-box"><span class="x-arrow x-arrow-top"><span class="x-arrow x-arrow-top"></span></span></div>

<style>.x-arrow-top .x-arrow-top { top: -6px; left: 0.5px; border-bottom-color: white; /* 空心箭头的背景色 */ }</style></aside>

### 自定义位置

箭头的默认位置为居中（`left: 50%`）。

<aside class="doc-demo">

<div id="customPosition" class="doc-box"><span class="x-arrow x-arrow-top"></span></div>

<style>#customPosition .x-arrow { left: 20px; /*箭头位置*/ }</style></aside>

### 自定义颜色

箭头的默认边框色为容器的边框色，默认背景色为全局背景色。

<aside class="doc-demo">

<div id="customColor" class="doc-box"><span class="x-arrow x-arrow-top"></span></div>

<style>#customColor .x-arrow { border-bottom-color: #00BCD4; /*边框色*/ }</style></aside>

## 经典箭头 <small>(兼容IE6)</small>

<link rel="stylesheet" type="text/css" href="../../typography/partial/arrow-text.css">

除了基于边框实现箭头，还可以基于文字实现箭头

<style>.x-arrow-text { position: relative; }</style>

<aside class="doc-demo"><span class="x-arrow-text x-arrow-text-top"><span class="x-arrow-text-fore">◆</span> <span class="x-arrow-text-back">◆</span></span></aside>

<aside class="doc-demo"><span class="x-arrow-text x-arrow-text-bottom"><span class="x-arrow-text-fore">◆</span> <span class="x-arrow-text-back">◆</span></span></aside>

<aside class="doc-demo"><span class="x-arrow-text x-arrow-text-left"><span class="x-arrow-text-fore">◆</span> <span class="x-arrow-text-back">◆</span></span></aside>

<aside class="doc-demo"><span class="x-arrow-text x-arrow-text-right"><span class="x-arrow-text-fore">◆</span> <span class="x-arrow-text-back">◆</span></span></aside>