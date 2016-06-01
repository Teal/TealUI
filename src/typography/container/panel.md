@doc panel.ts

基本用法
--------------------------------------------------------
@demo
<section class="x-panel">
    <header class="x-panel-header">
        我是面板标题
    </header>
    <div class="x-panel-body">
        我是面板内容
    </div>
</section>

自由组合
--------------------------------------------------------
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

面板嵌套
--------------------------------------------------------
<section class="x-panel">
    <header class="x-panel-header">
        <h4>面板嵌套</h4>
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

色系
--------------------------------------------------------

@col

@demo
<section class="x-panel x-panel-info">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h4>顶部</h4>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>

@col

@demo
<section class="x-panel x-panel-success">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h4>顶部</h4>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>

@col

@demo
<section class="x-panel x-panel-warning">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h4>顶部</h4>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>

@col

@demo
<section class="x-panel x-panel-error">
    <header class="x-panel-header">
        <a href="###" class="x-right">工具</a>
        <h4>顶部</h4>
    </header>
    <div class="x-panel-body">
        内容
    </div>
</section>

并排显示的面板
--------------------------------------------------------
和布局组件一起可以实现并排展示的面板区域。另参考：[等分栅格布局(gridAverage)](../core/gridAverage.html)

@demo

@import ../core/utility.less
@import ../core/grid.less
@import ../core/gridAverage.less

<div class="x-row x-row-3">
    <div class="x-col">
        <section class="x-panel x-info">
            <header class="x-panel-header">
                <a href="###" class="x-right">工具</a>
                <h4>顶部</h4>
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
                <h4>顶部</h4>
            </header>
            <div class="x-panel-body">
                内容
            </div>
        </section>
    </div>
    <div class="x-col">
        <section class="x-panel x-error">
            <header class="x-panel-header">
                <a href="###" class="x-right">工具</a>
                <h4>顶部</h4>
            </header>
            <div class="x-panel-body">
                内容
            </div>
        </section>
    </div>
</div>

折叠
--------------------------------------------------------
为 `.x-panel` 添加 `[x-role="panel"]`，即可支持面板的折叠效果。

@demo
<section class="x-panel x-panel-collapsed" x-role="panel">
    <header class="x-panel-header">
        <h5>我是被折叠起来的面板</h5>
    </header>
    <div class="x-panel-body">
        我是面板内容
    </div>
</section>

##### 手动切换折叠

```js
$('[x-role=panel]').role().toggleCollapse();
```