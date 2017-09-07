# 动态载入
动态载入各类资源。

## 加载 JavaScript 文件

    Doc.writeApi({
			path: "utility/dom/loadScript.js",
			apis: [{
				name: "loadScript",
				summary: "

动态载入一个 JavaScript 脚本。
",
				params: [{
					type: "String",
					name: "url",
					summary: "

加载 JavaScript 文件的路径。
"
				}, {
					type: "Function",
					name: "callback",
					optional: true,
					summary: "

载入成功的回调函数。函数参数为： \n\
* _example_ {String} url 加载的 JavaScript 文件路径。
"
				}],
				returns: {
					type: "Element",
					summary: "

返回用于载入脚本的 &lt;script&gt; 标签。
"
				},
				example: "```
loadScript(\"../../assets/resources/ajax/test.js\")
```
",
				line: 2,
				col: 1
			}]
});

## 加载 CSS 文件

    Doc.writeApi({
			path: "utility/dom/loadStyle.js",
			apis: [{
				name: "loadStyle",
				summary: "

动态载入一个 CSS 样式。
",
				params: [{
					type: "String",
					name: "url",
					summary: "

加载 CSS 文件的路径。
"
				}, {
					type: "Function",
					name: "callback",
					optional: true,
					summary: "

载入成功的回调函数。函数参数为： \n\
* _example_ {String} url 加载的 CSS 文件路径。
"
				}],
				returns: {
					type: "Element",
					summary: "

返回用于载入脚本的 &lt;link&gt; 标签。
"
				},
				example: "```
loadScript(\"../../assets/resources/ajax/test.css\")
```
",
				line: 2,
				col: 1
			}]
});

## 加载图片文件

    Doc.writeApi({
			path: "utility/dom/loadImage.js",
			apis: [{
				name: "loadImage",
				summary: "

动态载入一个图片。
",
				params: [{
					type: "String",
					name: "url",
					summary: "

加载图片的路径。
"
				}, {
					type: "Function",
					name: "callback",
					optional: true,
					summary: "

载入成功的回调函数。函数参数为： \n\
* _example_ {String} url 加载的图片文件路径。
"
				}],
				example: "```
loadImage(\"../../assets/resources/100x100.png\")
```
",
				line: 2,
				col: 1
			}, {
				name: "loadImages",
				summary: "

动态载入全部图片。
",
				params: [{
					type: "Array",
					name: "url",
					summary: "

加载图片的路径。
"
				}, {
					type: "Function",
					name: "callback",
					summary: "

载入成功的回调函数。函数参数为： \n\
* _example_ {Array} url 加载的图片文件路径。
"
				}],
				example: "```
loadImages([\"../../assets/resources/100x100.png\"])
```
",
				line: 22,
				col: 1
			}]
});

## 预加载

预加载一个图片，可防止 css 刷新时因为图片加载导致的空白闪动。

    Doc.writeApi({
			path: "utility/dom/preload.js",
			apis: [{
				name: "preload",
				summary: "

预加载一个地址的资源。
",
				params: [{
					type: "String",
					name: "src",
					optional: true,
					summary: "

图片地址。
"
				}],
				example: "```
preload(\"../../assets/resources/200x150.png\")
```
",
				line: 6,
				col: 1
			}]
});

## 图片懒加载

在图片较多时，为避免浪费流量，只在用于滚动图片所在区域时才加载图片。
```htm
<img data-src="../../../assets/resources/100x100.png" alt="加载中...">
<script>
    $('img[data-src]').lazyLoad();
</script>
```


    Doc.writeApi({
			path: "utility/dom/lazyload.js",
			apis: [{
				memberOf: "Dom.prototype",
				name: "lazyLoad",
				summary: "

懒加载图片。
",
				params: [{
					type: "Function",
					name: "callback",
					optional: true,
					summary: "

滚动到当前指定节点时的回调。函数参数为： \n\
 - **this**: `Element` 引发事件的节点。 \n\
 - e: `Event` 发生的事件对象。 \n\
 - proxy: `Image` 用于代理载入图片的节点。 \n\
 - 返回值: `String` 返回实际载入的图片路径。如果未指定则使用 `data-src` 属性指定的路径。
"
				}, {
					type: "Dom",
					name: "scrollParent",
					defaultValue: "document",
					optional: true,
					summary: "

滚动所在的容器。
"
				}],
				example: "```
$('img[data-src]').lazyLoad();
```
",
				line: 7,
				col: 1
			}]
});

## 加载 HTML 片段
```htm
<div id="loadHtml_elem1"></div>
<script>
    $('#loadHtml_elem1').loadHtml("../../../assets/resources/ajax/test.txt")
</script>
```


    Doc.writeApi({
			path: "utility/dom/loadHtml.js",
			apis: [{
				memberOf: "Dom.prototype",
				name: "loadHtml",
				summary: "

从一个地址载入 HTML 片段并设为当前节点的内容。
",
				params: [{
					type: "String",
					name: "url",
					summary: "

要载入的页面地址。
"
				}, {
					type: "Object",
					name: "data",
					optional: true,
					summary: "

发送给服务器的数据。
"
				}, {
					type: "Function",
					name: "callback",
					optional: true,
					summary: "

数据返回完成后的回调。
"
				}],
				returns: {
					summary: "

this
"
				},
				example: "```
$(\"#elem1\").loadHtml(\"../../../assets/resources/ajax/test.txt\")
```
",
				line: 8,
				col: 1
			}]
});
