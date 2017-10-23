---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/util
    - typo/grid
    - typo/icon
    - ui/button
---
# 面板
面板可以用于展示一块信息。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Panel from "ui/panel";

render(
    __root__,
    <Panel title="标题" collapsable>
        内容
    </Panel>
);
```

## 样式

### 基本样式
```html demo
<section class="x-panel">
    <header class="x-panel-header">
        我是面板标题
    </header>
    <div class="x-panel-body">
        我是面板内容
    </div>
</section>
```

### 自定义表头
```html demo
<section class="x-panel">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h5>我是面板标题</h5>
    </header>
    <div class="x-panel-body">
        我是面板内容
    </div>
    <footer class="x-panel-footer">
        <a href="###">底部链接</a>
    </footer>
</section>
---
<section class="x-panel">
    <header class="x-panel-header">
        <a href="###" class="x-button x-button-small x-right">按钮</a>
        <h5>顶部</h5>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>
```

### 内联块级
```html demo
<section class="x-panel x-inline-block">
    <img src="../../../assets/resources/200x200.png" />
    <div class="x-panel-body">
        <h3>标题</h3>
        <p>我是面板内容</p>
    </div>
</section>
```

### 面板嵌套
```html demo
<section class="x-panel">
    <header class="x-panel-header">
        <h5>面板嵌套</h5>
    </header>
    <div class="x-panel-body">
        <section class="x-panel">
            <header class="x-panel-header">
                <h5>我是面板标题</h5>
            </header>
            <div class="x-panel-body">
                我是面板内容
            </div>
        </section>
        <section class="x-panel">
            <header class="x-panel-header">
                <h5>我是面板标题</h5>
            </header>
            <div class="x-panel-body">
                我是面板内容
            </div>
        </section>
    </div>
</section>
```

### 状态
```html demo
<section class="x-panel x-panel-info">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h5>顶部</h5>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>
---
<section class="x-panel x-panel-success">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h5>顶部</h5>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>
---
<section class="x-panel x-panel-warning">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h5>顶部</h5>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>
---
<section class="x-panel x-panel-error">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h5>顶部</h5>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>
```

### 并排显示
使用[[typo/grid]]实现并排展示。
```html demo
<div class="x-row x-row-3">
    <div class="x-col">
        <section class="x-panel x-panel-info">
            <header class="x-panel-header">
                <a href="###" class="x-right">工具</a>
                <h5>顶部</h5>
            </header>
            <div class="x-panel-body">
                内容
            </div>
        </section>
    </div>
    <div class="x-col">
        <section class="x-panel">
            <header class="x-panel-header">
                <a href="###" class="x-right">工具</a>
                <h5>顶部</h5>
            </header>
            <div class="x-panel-body">
                内容
            </div>
        </section>
    </div>
    <div class="x-col">
        <section class="x-panel x-panel-error">
            <header class="x-panel-header">
                <a href="###" class="x-right">工具</a>
                <h5>顶部</h5>
            </header>
            <div class="x-panel-body">
                内容
            </div>
        </section>
    </div>
</div>
```
