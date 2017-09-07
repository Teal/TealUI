# 分页
页码组件。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="../nav/pager.scss" />
<link rel="stylesheet" href="utility.scss" />

## 基本用法
```htm
<nav class="x-pager">
    <a class="x-pager-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pager-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```


## 浮动
```htm
<nav class="x-pager x-left">
    <a class="x-pager-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pager-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```
```htm
<nav class="x-pager x-right">
    <a class="x-pager-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pager-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```


## 尺寸
```htm
<nav class="x-pager x-pager-small">
    <a class="x-pager-disabled" href="###"><span class="x-icon">«</span></a>
    <a class="x-pager-active" href="###">1</a>
    <a href="###">2</a>
    ...
    <a href="###">99</a>
    <a href="###">100</a>
    <a href="###"><span class="x-icon">»</span></a>
</nav>
```


## 翻页按钮
```htm
<nav class="x-pager x-pager-round">
    <a href="###"><span class="x-icon">«</span> 上一页</a>
    <a href="###"><span class="x-icon">»</span> 下一页</a>
</nav>

<nav class="x-pager x-pager-round">
    <a href="###" class="x-left"><span class="x-icon">«</span> 上一页</a>
    <a href="###" class="x-right"><span class="x-icon">»</span> 下一页</a>
</nav>
```


## JavaScript 假分页
```htm
<div id="content1"></div>
<nav class="x-pager" id="pager1"></nav>
<script>
    // 本函数仅用于文档展示。
    Doc.renderCodes();

    initPager(document.getElementById('pager1'), 136, 20, 5, 0, function(page, start, end) {
        document.getElementById('content1').innerHTML = '显示第 ' + start + ' 到 ' + end + ' 的数据';
    });
</script>
```
