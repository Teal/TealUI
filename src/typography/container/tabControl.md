## 基本用法

<aside class="doc-demo">

<div class="x-tabcontrol" x-tabcontrol="">

*   [第一个标签](javascript:;)
*   [第二个标签](javascript:;)
*   [第三个标签](javascript:;)

<div class="x-tabcontrol-body">

<div class="x-tabpage x-tabcontrol-selected">内容1</div>

<div class="x-tabpage">内容2</div>

<div class="x-tabpage">内容3</div>

</div>

</div>

</aside>

## 常用 API

### 手动切换当前展开的面板

<pre>        $('.x-tabcontrol').tabControl().selectedIndex(1);
    </pre>

### 动态插入一个面板

<pre>        $('.x-tabcontrol > .x-tabcontrol-header').append('*   [动态新增的标签](javascript:;)');
        $('.x-tabcontrol > .x-tabcontrol-body').append('

<div class="x-tabpage">\
            标签内容\
        </div>

');
    </pre>