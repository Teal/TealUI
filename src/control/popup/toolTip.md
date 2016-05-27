## 快速用法

<aside class="doc-demo"><button x-title="我是工具提示">鼠标移到我上面，然后稍等</button></aside>

## 基本用法

书写 `[x-role="toolTip"]` 并设置 `[x-target="{目标选择器}"]`。

<aside class="doc-demo"><button id="target1">鼠标移到我上面，然后稍等</button> <span class="x-tooltip" x-role="toolTip" x-target="#target1">我是提示文案</span> <span class="x-tooltip" x-role="toolTip" x-target="#target1"><span class="x-arrow x-arrow-top"></span>我是提示文案</span> <span class="x-tooltip" x-role="toolTip" x-target="#target1"><span class="x-arrow x-arrow-left"></span>我是提示文案</span> <span class="x-tooltip" x-role="toolTip" x-target="#target1"><span class="x-arrow x-arrow-bottom"></span>我是提示文案</span> <span class="x-tooltip" x-role="toolTip" x-target="#target1"><span class="x-arrow x-arrow-right"></span>我是提示文案</span></aside>

## 常用 API

##### 手动显示工具提示

<pre>$('[x-role="toolTip"]').role().show();</pre>

##### 手动关闭工具提示

<pre>$('[x-role="toolTip"]').role().hide();</pre>

##### 工具提示显示后回调

<pre>$('[x-role="toolTip"]').role().on('show', function(){ this.dom.setText('浮层被显示了') });</pre>

## 纯 HTML 样式

<style>#htmlDemo .x-tooltip { display: inline-block; position: relative; }</style>

<aside class="doc-demo" id="htmlDemo"><span class="x-tooltip">我是提示文案</span> <span class="x-tooltip"><span class="x-arrow x-arrow-top"></span>我是提示文案</span> <span class="x-tooltip"><span class="x-arrow x-arrow-left"></span>我是提示文案</span> <span class="x-tooltip"><span class="x-arrow x-arrow-bottom"></span>我是提示文案</span> <span class="x-tooltip"><span class="x-arrow x-arrow-right"></span>我是提示文案</span></aside>