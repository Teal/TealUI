---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 插入
Flash
# Flash
提供和 Flash 的直接交互。

## 插入 Flash
```htm
<embed type="application/x-shockwave-flash" name="plugin" src="http://localhost:5373/assets/resources/test.swf" quality="high" wmode="transparent">
```
```htm
<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="300" height="120">
    <param name="movie" value="../../../assets/resources/test.swf">
    <param name="quality" value="high">
    <param name="bgcolor" value="#FFFFFF">
    <!--[if !IE]> <-->
    <object data="../../../assets/resources/test.swf" width="300" height="120" type="application/x-shockwave-flash">
        <param name="quality" value="high">
        <param name="bgcolor" value="#FFFFFF">
        <param name="pluginurl" value="http://www.adobe.com/go/getflashplayer">
        您的浏览器未安装 Flash。请 <a href="http://www.adobe.com/go/getflashplayer" target="_blank">点此安装</a>
    </object>
    <!--> <![endif]-->
</object>
```


## SWFObject (源码: [utility/browser/swfObject.js](../../utility/browser/swfObject.js))
```htm
<div id="flashcontent">[...]</div>
<script>
    var so = new SWFObject("movie.swf", "mymovie", "200", "100", "6.0.65", "#336699");
</script>
```


另参考：[SWFObject 官方博客](http://blog.deconcept.com/swfobject/)
