<article class="demo">

<aside class="demo">

### 循环列表的滚动

<div id="a" class="ct">

*   <div class="demo-box">aa</div>

*   <div class="demo-boui-large demo-green">bb</div>

*   <div class="demo-boui-small demo-blue">cc</div>

*   <div class="demo-box demo-red">dd</div>

*   <div class="demo-box demo-orange">ee</div>

*   <div class="demo-box">ff</div>

</div>

<script class="demo">var a = new Marquee('#a').start();</script></aside>

<script>Demo.writeExamples({ 'start': 'a.start()', 'stop': 'a.stop()', 'prev': 'a.prev()', 'next': 'a.next()' });</script>

<aside class="demo">

### 不循环列表的滚动

<div id="b" class="ct">

*   <div class="demo-box">aa</div>

*   <div class="demo-boui-large demo-green">bb</div>

*   <div class="demo-boui-small demo-blue">cc</div>

*   <div class="demo-box demo-red">dd</div>

*   <div class="demo-box demo-orange">ee</div>

*   <div class="demo-box">ff</div>

</div>

<script class="demo">var b = new Marquee('#b', null, false).start();</script></aside>

<aside class="demo">

### 平滑滚动

<div id="b1" class="ct">

*   <div class="demo-box">aa</div>

*   <div class="demo-boui-large demo-green">bb</div>

*   <div class="demo-boui-small demo-blue">cc</div>

*   <div class="demo-box demo-red">dd</div>

*   <div class="demo-box demo-orange">ee</div>

*   <div class="demo-box">ff</div>

</div>

<script class="demo">var b1 = new Marquee('#b1', null); b1.duration = 10; b1.delay = 0; b1.start(1);</script></aside>

<aside class="demo">

### 右

<div id="c" class="ct">

*   <div class="demo-box">aa</div>

*   <div class="demo-boui-large demo-green">bb</div>

*   <div class="demo-boui-small demo-blue">cc</div>

*   <div class="demo-box demo-red">dd</div>

*   <div class="demo-box demo-orange">ee</div>

*   <div class="demo-box">ff</div>

</div>

<script class="demo">var c = new Marquee('#c', 'right').start();</script></aside>

<aside class="demo">

### 上

<div id="d" class="ct2">

*   <div class="demo-box">aa</div>

*   <div class="demo-boui-large demo-green">bb</div>

*   <div class="demo-boui-small demo-blue">cc</div>

*   <div class="demo-box demo-red">dd</div>

*   <div class="demo-box demo-orange">ee</div>

*   <div class="demo-box">ff</div>

</div>

<script class="demo">var d = new Marquee('#d', 'top').start();</script></aside>

<aside class="demo">

### 下

<div id="e" class="ct2">

*   <div class="demo-box">aa</div>

*   <div class="demo-boui-large demo-green">bb</div>

*   <div class="demo-boui-small demo-blue">cc</div>

*   <div class="demo-box demo-red">dd</div>

*   <div class="demo-box demo-orange">ee</div>

*   <div class="demo-box">ff</div>

</div>

<script class="demo">var e = new Marquee('#e', 'bottom').start();</script></aside>

</article>