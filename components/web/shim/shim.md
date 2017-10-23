---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - web/shim/ie8-shim
    - web/shim/ie9-shim
    - web/shim/ie10-shim
keyword:
    - polyfill
    - legacy
    - ie6
    - ie7
    - ie8
    - ie9
    - ie10
    - ie11
    - atob
    - btoa
    - base64
---
# DOM 兼容补丁
在低版本浏览器直接使用 HTML5 标准接口。

## IE 6-7
IE 6-7 已不被支持。另参考：[[web/killIE]]。

#### 如何解决：IE6 PNG 透明问题
```js
import pngFix from "web/shim/png-shim";

pngFix();
```

#### 如何解决：IE6 模拟 fixed
为节点添加 `.ie6-fixed-*`(其中，* 为 `top`, `right`, `bottom`, `left`) 即可设置四个方向的固定显示。
```html
<style>
    @import url("web/shim/ie6-fixed.css");
    .mystyle { position: fixed; right: 10px; bottom: 10px; }
</style>
<div class="mystyle ie6-fixed-right ie6-fixed-bottom">fixed on rightbottom</div>
```

## IE 8
IE 6-8 需导入：
```js
import "web/shim/ie8-shim";
```

补丁添加了 HTML5 标签支持，并包含了以下接口：
- `XMLHttpRequest`
- `window.addEventListener`
- `window.removeEventListener`
- `window.getComputedStyle`
- `Document`
- `Document.prototype.addEventListener`
- `Document.prototype.removeEventListener`
- `Document.prototype.getElementsByClassName`
- `Document.prototype.defaultView`
- `Element.prototype.addEventListener`
- `Element.prototype.removeEventListener`
- `Element.prototype.getElementsByClassName`
- `Element.prototype.ownerDocument`
- `Element.prototype.textContent`
- `Event.prototype.stopPropagation`
- `Event.prototype.preventDefault`
- `Event.prototype.target`
- `Event.prototype.relatedTarget`
- `Event.prototype.which`
- `Event.prototype.pageX`
- `Event.prototype.pageY`
- `TextRectangle.prototype.width`
- `TextRectangle.prototype.height`

## IE 9
IE 6-9 需导入：
```js
import "web/shim/ie9-shim";
```

补丁包含了以下接口：
- `setTimeout`¹
- `setInterval`¹
- `atob`²
- `btoa`²

¹：IE 6-9 支持 `setTimeout` 和 `setInterval`，但不支持传参。补丁扩展了这两个函数以支持传参。     
²：只有 IE 6-9 和 Opera 10.1 不支持 `atob` 和 `btoa`。`atob` & `btoa` 不支持中文，如需支持中文，改用[[util/base64]]组件。

## IE 10
IE 10 手机版需导入：
```js
import "web/shim/ie10-shim";
```
补丁修复了不识别 viewport 的问题。
