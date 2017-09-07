## 基本用法

<aside class="doc-demo">

<nav class="x-pager">[<span class="x-icon">«</span>](###) [1](###) [2](###) ... [99](###) [100](###) [<span class="x-icon">»</span>](###)</nav>

</aside>

## 浮动

<link rel="stylesheet" type="text/css" href="../../typography/core/utility.css">

<aside class="doc-demo">

<nav class="x-pager x-left">[<span class="x-icon">«</span>](###) [1](###) [2](###) ... [99](###) [100](###) [<span class="x-icon">»</span>](###)</nav>

</aside>

<aside class="doc-demo">

<nav class="x-pager x-right">[<span class="x-icon">«</span>](###) [1](###) [2](###) ... [99](###) [100](###) [<span class="x-icon">»</span>](###)</nav>

</aside>

## 尺寸

<aside class="doc-demo">

<nav class="x-pager x-pager-small">[<span class="x-icon">«</span>](###) [1](###) [2](###) ... [99](###) [100](###) [<span class="x-icon">»</span>](###)</nav>

</aside>

## 翻页按钮

<aside class="doc-demo">

<nav class="x-pager x-pager-round">[<span class="x-icon">«</span> 上一页](###) [<span class="x-icon">»</span> 下一页](###)</nav>

<nav class="x-pager x-pager-round">[<span class="x-icon">«</span> 上一页](###) [<span class="x-icon">»</span> 下一页](###)</nav>

</aside>

## JavaScript 假分页

<aside class="doc-demo">

<nav class="x-pager" id="pager1"></nav>

<script>// 本函数仅用于文档展示。 Doc.renderCodes(); initPager(document.getElementById('pager1'), 136, 20, 5, 0, function(page, start, end) { document.getElementById('content1').innerHTML = '显示第 ' + start + ' 到 ' + end + ' 的数据'; });</script></aside>