---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
<style>.doc-demo { line-height: 40px; }</style>

## 基本用法

使用 `span.x-progressbar` 绘制 `inline-block` 进度条。使用`div.x-progressbar` 绘制 `block` 进度条。

<aside class="doc-demo">进度条：<span class="x-progressbar"><span class="x-progressbar-fore" style="width: 60%;"></span></span>

<div class="x-progressbar">

<div class="x-progressbar-fore" style="width: 60%;">60%</div>

</div>

</aside>

## 色系

<aside class="doc-demo">

<div class="x-progressbar x-progressbar-info">

<div class="x-progressbar-fore" style="width: 60%;">60%</div>

</div>

<div class="x-progressbar x-progressbar-success">

<div class="x-progressbar-fore" style="width: 60%;">60%</div>

</div>

<div class="x-progressbar x-progressbar-warning">

<div class="x-progressbar-fore" style="width: 60%;">60%</div>

</div>

<div class="x-progressbar x-progressbar-error">

<div class="x-progressbar-fore" style="width: 60%;">60%</div>

</div>

</aside>

## 间隔线

<aside class="doc-demo"></aside>

## 动画

<aside class="doc-demo"></aside>

## API

<aside class="doc-demo">

<div class="x-progressbar" x-role="progressBar" x-value="0.2">

<div class="x-progressbar-fore">-%</div>

</div>

</aside>

##### 获取进度值

<pre>$('[x-role=progressBar]').role().getValue()</pre>

##### 设置进度值

<pre>$('[x-role=progressBar]').role().setValue(0.5)</pre>

##### 慢慢变化

<script type="code/javascript" class="doc-demo">var i = 0; var timer = setInterval(function(){ $('[x-role=progressBar]').role().setValue( i += 0.01 ); if(i >= 1) { clearInterval(timer); } }, 300);</script>

##### 根据进度自动变化颜色

<script type="code/javascript" class="doc-demo">$('[x-role=progressBar]').role().on('change', function(){ this.elem.classList.remove('x-progressbar-error'); this.elem.classList.remove('x-progressbar-success'); if(this.getValue() <= 0.2){ this.elem.classList.add('x-progressbar-error'); } else if(this.getValue() >= 0.8){ this.elem.classList.add('x-progressbar-success'); } }).trigger('change');</script>