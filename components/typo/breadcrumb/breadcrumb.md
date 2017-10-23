---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
---
# 面包屑导航
指示当前内容层级并帮助用户快速切换。

## 基本用法
```html demo
<nav class="x-breadcrumb">
    当前位置：
    <a href="###"><span class="x-icon">🏠</span>TealUI</a>
    <span class="x-breadcrumb-divider">»</span>
    <a href="###">导航</a>
    <span class="x-breadcrumb-divider">»</span>
    <span>面包屑</span>
</nav>
```
> 如果需要更换图标请参考[[typo/icon]]组件。

## 其它风格

```html demo
<nav class="x-breadcrumb">
    当前位置：
    <a href="###"><span class="x-icon">🏠</span>TealUI</a>
    <span class="x-breadcrumb-divider x-icon">⏵</span>
    <a href="###">导航</a>
    <span class="x-breadcrumb-divider x-icon">⏵</span>
    <span>面包屑</span>
</nav>
```

```html demo
<nav class="x-breadcrumb">
    当前位置：
    <a href="###"><span class="x-icon">🏠</span>TealUI</a>
    <span class="x-breadcrumb-divider">/</span>
    <a href="###">导航</a>
    <span class="x-breadcrumb-divider">/</span>
    <span>面包屑</span>
</nav>
```
