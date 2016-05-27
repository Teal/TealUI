## 基本用法

<aside class="doc-demo">

<div class="x-accordion" x-role="accordion">

<div class="x-panel x-panel-collapsed">

<div class="x-panel-header">标题 1</div>

<div class="x-panel-body">正文 1</div>

</div>

<div class="x-panel x-panel-expanded">

<div class="x-panel-header">标题 2</div>

<div class="x-panel-body">正文 2</div>

</div>

<div class="x-panel x-panel-collapsed">

<div class="x-panel-header">标题 3</div>

<div class="x-panel-body">正文 3</div>

</div>

</div>

</aside>

## API

### 手动切换当前展开的面板

<pre>        $('[x-role=accordion]').role().panels[2].toggleCollapse(false);
    </pre>