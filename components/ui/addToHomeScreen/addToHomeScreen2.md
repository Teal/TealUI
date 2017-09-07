# 添加到主屏幕

## 基本用法

```htm
<AddToHomeScreen />
```
<link rel="stylesheet" href="../../utility/browser/addToHomeScreen.scss" />
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="icon-57.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="icon-72.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="icon-114.png">
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="icon-144.png">
<link rel="apple-touch-startup-image" sizes="1024x748" href="icon-1024x748.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)">
<link rel="apple-touch-startup-image" sizes="768x1004" href="icon-768x1004.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)">
<link rel="apple-touch-startup-image" sizes="640x920" href="icon-640x920.png" media="screen and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" sizes="320x460" href="icon-320x460.png" media="screen and (max-device-width: 320)">

## 添加到主屏幕 (源码: [utility/browser/addToScreen.less](../../utility/browser/addToScreen.less)、[utility/browser/addToScreen.js](../../utility/browser/addToScreen.js))

### 在 &lt;meta&gt; 中添加如下代码

删除 `-precomposed` 可为图标添加高亮效果。另参考：[iOS中为网站添加图标到主屏幕以及增加启动画面](http://www.prower.cn/technic/2314)

在 IOS 或安卓 UC 上提示用户添加到主屏幕

    Doc.writeApi({
			path: "utility/browser/addToHomeScreen.js",
			apis: [{
				name: "addToHomeScreen",
				summary: "

对于 IOS/Android 用户，弹出添加到主屏幕的浮层。
",
				params: [{
					type: "Object",
					name: "options",
					optional: true,
					summary: "

可选的配置信息。
"
				}],
				remark: "

请确保必须在 DomReady 中调用本函数。
",
				line: 5,
				col: 1
			}]
});

        ×

        先点击 再“添加到主屏幕”
