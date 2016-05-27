<header id="header">[返回](javascript:history.back();) header</header>

<section id="body">

<div class="x-page">

<menu>*   [页面 1: helle world](index.html)*   [页面 2: 使用 App.ready() 初始化页面](subpage-2.html)*   [页面 3: 使用 <script> 加载业务代码](subpage-3.html)*   [页面 4: 使用 startLoading() 异步加载页面](subpage-4.html)*   [页面 5: 使用 App.go() 在页面间传参](subpage-5.html)*   [页面 6: 使用 App.go() 在页面间跳转](subpage-6.html)*   [页面 7: 使用页面的 hide 和 show 事件](subpage-7.html)</menu>

<script type="text/template" id="tpl">{if $data > 0} AA {else} BB {end}</script>

<div id="ct" onclick="App.currentPage.onCtClick()">第 2 个页面</div>

<script run="server">App.ready(function(page) { page.render('tpl', 3); });</script> <script>App.ready(function (page) { page.onCtClick = function () { alert('第 2 个页面被点了'); } page.find('#ct').append('：已加载完毕 2'); });</script></div>

</section>

<footer id="footer">footer</footer>