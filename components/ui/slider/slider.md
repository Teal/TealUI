---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 滑动条

## 基本用法

```htm
<Slider />
```
## 单个滑块

<aside class="doc-demo">

<div class="x-slider" x-role="slider" x-value="50">[](javascript://左右滑动)</div>

</aside>

## 区间滑块

<aside class="doc-demo">

<div id="slider1" class="x-slider" x-role="slider" x-start="24" x-end="60">[](javascript://左右滑动)[](javascript://左右滑动)</div>

</aside>

## 区间步长

<aside class="doc-demo">

<div id="slider1" class="x-slider" x-role="slider" x-step="20">[](javascript://左右滑动)</div>

</aside>

## API

##### 获取当前滑块的值

<pre>$('[x-role="slider"]').role().getValue();</pre>

##### 设置当前滑块的值

<pre>$('[x-role="slider"]').role().setValue(30);</pre>

##### 设置滑块值改变的回调

<pre>$('[x-role="slider"]').role().on('change', function(){ console.log('值改变了: ' + this.getValue()) });</pre>

## 纯 HTML 样式

<aside class="doc-demo">

<div id="slider1" class="x-slider" x-role="slider1">

<div class="x-slider-fore" style="left: 24%; width: 52%;">52%</div>

[](###)[](###)</div>

</aside>

<script>Doc.renderCodes();</script>