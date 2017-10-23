---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
    - typo/util
---
# 分页
页码组件。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Pagination from "ui/pagination";

render(
    __root__,
    <Pagination total={100} />
);
```

## 样式

### 基本样式
```html demo
<nav class="x-pagination">
    <a class="x-pagination-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pagination-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```

### 浮动
```html demo
<nav class="x-pagination x-left">
    <a class="x-pagination-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pagination-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```
```html demo
<nav class="x-pagination x-right">
    <a class="x-pagination-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pagination-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```

### 尺寸
```html demo
<nav class="x-pagination x-pagination-small">
    <a class="x-pagination-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pagination-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```

### 翻页按钮
```html demo
<nav class="x-pagination x-pagination-round">
    <a href="###"><span class="x-icon">«</span> 上一页</a>
    <a href="###"><span class="x-icon">»</span> 下一页</a>
</nav>

<nav class="x-pagination x-pagination-round">
    <a href="###" class="x-left"><span class="x-icon">«</span> 上一页</a>
    <a href="###" class="x-right"><span class="x-icon">»</span> 下一页</a>
</nav>
```
