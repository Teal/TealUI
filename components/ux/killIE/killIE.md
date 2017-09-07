---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 干掉 IE
干掉 IE 是前端人的共同心愿。

## IE6-9 升级提示
```html demo
<!--[if lte IE 9]>
    <div style="border: 1px solid #F7941D; color: #F44336; padding: 10px 20px; background: #FEEFDA;text-align: center;">
        <strong style="float: right;cursor:pointer" onclick="this.parentNode.style.display='none'">&times;</strong>
        您使用的浏览器版本过低，将影响使用本网站的功能。请 <a href="http://windows.microsoft.com/zh-cn/windows/upgrade-your-browser" target="_blank">点此升级</a> 或下载更快更安全的 <a href="http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html" target="_blank">谷歌浏览器</a> 或者 <a href="http://www.firefox.com.cn/download/" target="_blank">火狐浏览器</a>。
    </div>
<![endif]-->
```

## IE6 的 5 种死法
只需少量代码，让 IE6 立即崩溃。

### 方案 1
```html
<style>
div {
    width: 100px;
}
div a:hover {
    position: absolute;
}
</style>
<div>
<a href="#">点我干掉IE6<img src="" /><span></span></a>
</div>
```

### 方案 2
```html
<ul>
    <li><a name='label1'/>a</li>
</ul>
<ul>
    <li><a name='label2'/>b<sub>c</sub></li>
</ul>
```

### 方案 3
```html
<style>*{position:relative}</style><table><input></table>
```

### 方案 4
```html
<script>
while(1)location.reload();
</script>
```

### 方案 5
```html
<script>for(x in document.write){document.write(x);}</script>
```

> ##### 另参考
> - [IE6 倒计时](http://www.ie6countdown.com/)
