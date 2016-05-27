## 外部 HTML

<script x-doc="utility/dom/outerHtml.js">Doc.writeApi({ path: "utility/dom/outerHtml.js", apis: [{ memberOf: "Element.prototype", name: "outerHTML", summary: "<p>获取或设置当前元素的外部 HTML。</p>", params: [{ type: "String", name: "value", summary: "<p>要设置的外部 HTML。</p>" }], returns: { type: "String", summary: "<p>返回外部 HTML。</p>" }, example: "<pre>document.body.outerHTML = \"a\";</pre>", memberType: "property", line: 8, col: 1 }] });</script>

## IE6 PNG 透明

<div class="doc-box doc-box-large">我是背景文字 ![](../../../assets/resources/200x150.png) <script>fixPng();</script></div>

<script x-doc="utility/dom/fixPng.js">Doc.writeApi({ path: "utility/dom/fixPng.js", apis: [{ name: "fixPng", summary: "<p>让 IE6 支持透明 PNG。</p>", params: [{ type: "Element", name: "image", optional: true, summary: "<p>修复的图片节点。如不指定则修复整个文档的图片。</p>" }], example: "<h5>修复当前页面的所有图片</h5>\n\ \n\ <pre>fixPng()</pre>\n\ \n\ <h5>修复指定图片</h5>\n\ \n\ <pre>fixPng(doument.getElementById(\"id\"))</pre>", line: 5, col: 1 }] });</script>

## IE6 模拟 Fixed

为节点添加 `.ie6-fixed-*`(其中，* 为 `top`, `right`, `bottom`, `left`) 即可设置四个方向的固定显示。

<aside class="doc-demo"><style>.mystyle { position: fixed; right: 10px; bottom: 10px; }</style>

<div class="mystyle ie6-fixed-right ie6-fixed-bottom" style="right:10px;bottom:10px;">fixed on rightbottom</div>

</aside>

<script>Doc.writeApi({ path: "utility/dom/fixed.css" });</script>