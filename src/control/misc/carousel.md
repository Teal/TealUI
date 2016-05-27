<aside class="doc-demo">

<div class="x-carousel" style="width:100%;">

*   [![](../../../assets/resources/200x150.png)

    <div class="x-carousel-title">

    ### 图片说明

    文字说明

    </div>

    ](###)
*   ![](../../../assets/resources/200x150.png)
*   ![](../../../assets/resources/200x150.png)

[<span class="x-icon">＜</span>](###) [<span class="x-icon">＞</span>](###)</div>

</aside>

<article><script type="text/html"><!-- 必须定义宽度和高度 --> < script> var carousel = new Carousel('#carousel'); < /script></script>

## 常用 API

<script>Demo.writeExamples({ '设置滚动效果的时间': function () { carousel.delay = 900; // 自动滚动的时间。 carousel.duration = 300; // 滚动效果使用的时间。 // 注意 carousel.delay 必须大于 carousel.duration }, '停止自动播放': 'carousel.stop()', '开始自动播放': 'carousel.start()', '强制移到下一张': 'carousel.next()', '强制移到上一张': 'carousel.prev()', '强制往右移动2张': 'carousel.moveBy(2)', '强制移到第1张': 'carousel.moveTo(0)' });</script></article>