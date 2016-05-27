<link rel="stylesheet" type="text/css" href="../../typography/core/utility.css"> <link rel="stylesheet" type="text/css" href="../core/grid.css"> <link rel="stylesheet" type="text/css" href="../core/gridAverage.css">

## 基本用法

<aside class="doc-demo">

<section class="x-panel">

<header class="x-panel-header">我是面板标题</header>

<div class="x-panel-body">我是面板内容</div>

</section>

</aside>

## 自由组合

<aside class="doc-demo">

<section class="x-panel">

<header class="x-panel-header">[工具](###)

##### 我是面板标题

</header>

<div class="x-panel-body">我是面板内容</div>

<footer class="x-panel-footer">[底部链接](###)</footer>

</section>

</aside>

## 面板嵌套

<aside class="doc-demo">

<section class="x-panel">

<header class="x-panel-header">

#### 面板嵌套

</header>

<div class="x-panel-body">

<section class="x-panel">

<header class="x-panel-header">

##### 我是面板标题

</header>

<div class="x-panel-body">我是面板内容</div>

</section>

<section class="x-panel">

<header class="x-panel-header">

##### 我是面板标题

</header>

<div class="x-panel-body">我是面板内容</div>

</section>

</div>

</section>

</aside>

## 色系

<div class="doc-grid doc-grid-4">

<div class="doc doc-col">

<aside class="doc-demo">

<section class="x-panel x-panel-info">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</aside>

</div>

<div class="doc doc-col">

<aside class="doc-demo">

<section class="x-panel x-panel-success">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</aside>

</div>

<div class="doc doc-col">

<aside class="doc-demo">

<section class="x-panel x-panel-warning">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</aside>

</div>

<div class="doc doc-col">

<aside class="doc-demo">

<section class="x-panel x-panel-error">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</aside>

</div>

</div>

## 并排显示的面板

和布局组件一起可以实现并排展示的面板区域。另参考：[等分栅格布局(gridAverage)](../core/gridAverage.html)

<aside class="doc-demo">

<div class="x-row x-row-3">

<div class="x-col">

<section class="x-panel x-info">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</div>

<div class="x-col">

<section class="x-panel">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</div>

<div class="x-col">

<section class="x-panel x-error">

<header class="x-panel-header">[工具](###)

#### 顶部

</header>

<div class="x-panel-body">内容</div>

</section>

</div>

</div>

</aside>

## 折叠

为 `.x-panel` 添加 `[x-role="panel"]`，即可支持面板的折叠效果。

<aside class="doc-demo">

<section class="x-panel x-panel-collapsed" x-role="panel">

<header class="x-panel-header">

##### 我是被折叠起来的面板

</header>

<div class="x-panel-body">我是面板内容</div>

</section>

</aside>

##### 手动切换折叠

<pre>        $('[x-role=panel]').role().toggleCollapse();
    </pre>