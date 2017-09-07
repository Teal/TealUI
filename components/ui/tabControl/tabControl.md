---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 选项卡控件

## 基本用法

```tsx demo
<TabControl />
```
# 选项卡
选项卡效果。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="tab.scss" />
<link rel="stylesheet" href="tab-more.scss" />
<link rel="stylesheet" href="utility.scss" />

## 基本用法
```tsx demo
<ul class="x-tab" x-role="tab">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tab-body">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />BBBB
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
```

## 占满一行
```tsx demo
<ul class="x-tab x-block" x-role="tab">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tab-body">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
```


## 扩展：各个方向的选项卡
```tsx demo
<ul class="x-tab x-tab-top">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tab-body">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
```
```tsx demo
<ul class="x-tab x-tab-bottom">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
```
```tsx demo
<ul class="x-tab x-tab-left" style="height: 300px;">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
```
```tsx demo
<ul class="x-tab x-tab-right" style="height: 300px;">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tab-body">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
```
