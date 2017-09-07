<article class="demo"><script>Demo.writeExamples({ '高亮文本': { 'document.highlightKeyword("文字1", "文字2")': '-', 'document.highlightKeyword({"文字1": "#FF0000", "文字2": "#00FF00")': '-', 'document.highlightKeyword({"文字1": "hightlighted", "文字2": "hightlighted2")': '-' // 添加一个 css 类 } });</script>

<div id="demoPanel">

HighlightKey v1.0

[http://www.cftea.com/products/HighlightKey/](http://www.cftea.com/products/HighlightKey/)

嗨，大家好！这里是千一网络给大家带来的问候。

本示例演示的是千一网络的产品——HighlightKey，我们将看到关键词高亮的效果。

本示例中“千一”、“cftea”会被不同的背景色、前景色高亮，当然您也可以只使用背景色或前景色。

<textarea cols="30" rows="3">这里的“千一”和“cftea”会保持原样。</textarea>

*   它不会破坏文本框中的内容，也不会破坏属性值（比如 alt、title 中的值）。比如：[千一网络](http://www.cftea.com "千一网络 - 让您的 Web 开发更轻松！")。
*   它不会破坏原有的样式、链接。比如：**粗体千一网络**。
*   它不会破坏大小写，虽然查找时是忽略大小写的，但高亮后，仍保持原有大小写。比如：Cftea，C 是大写的。

</div>

<script type="text/javascript"><!-- //千一网络 www.cftea.com highlightKey("demoPanel", ["千一", "cftea"], ["#FF0000", "#00FF00"], ["#00FF00", "#0000FF"]); //highlightKey("demoPanel", ["千一", "cftea"], null, ["#00FF00", "#0000FF"]); //highlightKey("demoPanel", ["千一", "cftea"], ["#FF0000", "#00FF00"], null); //--></script></article>