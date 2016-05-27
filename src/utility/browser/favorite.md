## 添加到收藏夹

<script x-doc="utility/browser/addFavorite.js">Doc.writeApi({ path: "utility/browser/addFavorite.js", apis: [{ name: "addFavorite", summary: "<p>打开添加收藏夹对话框。</p>", params: [{ type: "String", name: "title", optional: true, summary: "<p>收藏的标题。默认为当前网页标题。</p>" }, { type: "String", name: "url", optional: true, summary: "<p>收藏的地址。默认为当前网页地址。</p>" }], example: "<h5>添加当前网页到收藏夹</h5>\n\ \n\ <pre>addFavorite()</pre>\n\ \n\ <h5>添加指定网页到收藏夹</h5>\n\ \n\ <pre>addFavorite(\"TealUI\", \"http://teal.github.io/TealUI\")</pre>", remark: "<blockquote class=\"doc-note\">\n\ <h4>注意</h4>\n\ \n\ <p>最新浏览器由于安全限制，不允许使用此功能。这时，函数会提示用户手动操作。</p>\n\ </blockquote>", line: 6, col: 1 }] });</script>

## 设为主页

<script x-doc="utility/browser/setHomePage.js">Doc.writeApi({ path: "utility/browser/setHomePage.js", apis: [{ name: "setHomePage", summary: "<p>打开设为主页对话框。</p>", params: [{ type: "String", name: "url", optional: true, summary: "<p>设置的地址。</p>" }], example: "<h4>设置当前网页为主页</h4>\n\ \n\ <pre>setHomePage()</pre>\n\ \n\ <h4>设置指定网页为主页</h4>\n\ \n\ <pre>setHomePage(\"TealUI\", \"http://teal.github.io/TealUI\")</pre>", remark: "<blockquote class=\"doc-note\"><h4>注意</h4>最新浏览器由于安全限制，不允许使用此功能。这时，函数会提示用户手动操作。</blockquote>", line: 6, col: 1 }] });</script>

## 添加到主屏幕 <small>(源码: [utility/browser/addToScreen.less](../../utility/browser/addToScreen.less)、[utility/browser/addToScreen.js](../../utility/browser/addToScreen.js))</small>

### 在 <meta> 中添加如下代码

<script type="text/html" class="doc-demo"><!-- 设置主屏幕图标 --> <link rel="apple-touch-icon-precomposed" sizes="57x57" href="icon-57.png"> <link rel="apple-touch-icon-precomposed" sizes="72x72" href="icon-72.png"> <link rel="apple-touch-icon-precomposed" sizes="114x114" href="icon-114.png"> <link rel="apple-touch-icon-precomposed" sizes="144x144" href="icon-144.png"> <!-- 设置App启动图片 --> <link rel="apple-touch-startup-image" sizes="1024x748" href="icon-1024x748.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)"> <link rel="apple-touch-startup-image" sizes="768x1004" href="icon-768x1004.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)"> <link rel="apple-touch-startup-image" sizes="640x920" href="icon-640x920.png" media="screen and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)"> <link rel="apple-touch-startup-image" sizes="320x460" href="icon-320x460.png" media="screen and (max-device-width: 320)"> <!--其它配置项--> <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-status-bar-style" content="black"> <meta name="format-detection" content="telephone=no"> <meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1.0, maximum-scale=1, user-scalable=no"></script>

删除 `-precomposed` 可为图标添加高亮效果。另参考：[iOS中为网站添加图标到主屏幕以及增加启动画面](http://www.prower.cn/technic/2314)

在 IOS 或安卓 UC 上提示用户添加到主屏幕

<script x-doc="utility/browser/addToHomeScreen.js">Doc.writeApi({ path: "utility/browser/addToHomeScreen.js", apis: [{ name: "addToHomeScreen", summary: "<p>对于 IOS/Android 用户，弹出添加到主屏幕的浮层。</p>", params: [{ type: "Object", name: "options", optional: true, summary: "<p>可选的配置信息。</p>" }], remark: "<p>请确保必须在 DomReady 中调用本函数。</p>", line: 5, col: 1 }] });</script>

<div class="x-addtohomescreen" style=""><span class="x-addtohomescreen-close">×</span>  先点击
再“添加到主屏幕”</div>