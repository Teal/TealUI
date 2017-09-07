---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 瀑布流布局
瀑布流布局
<style>#waterfallLayout1 > div { background: #f7f7f7; }</style>

<div id="waterfallLayout1">

<div style="height:50px;">我是元素1</div>

<div style="height:70px;">我是元素2</div>

<div style="height:30px;">我是元素3</div>

<div style="height:80px;">我是元素4</div>

<div style="height:30px;">我是元素5</div>

<div style="height:50px;">我是元素1</div>

<div style="height:70px;">我是元素2</div>

<div style="height:30px;">我是元素3</div>

<div style="height:80px;">我是元素4</div>

<div style="height:30px;">我是元素5</div>

</div>

<script class="doc-demo">waterfallLayout(document.getElementById('waterfallLayout1'))</script>