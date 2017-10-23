---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 触屏：鼠标事件延时触发

在触屏设备上，当用户触击一个按钮时，会依次触发以下事件：
```
touchstart → touchmove → touchend → (等待约 300ms 后) → mousemove → mousedown → mouseup → click
```

click 等鼠标事件被延时触发，主要原因是浏览器为了确认用户是想点击元素还是想快速触摸屏幕两次以缩放网页。
对于那些试图模拟原生 APP 的单页应用来说，延时触发会让用户觉得应用卡钝。

#### 解决方案一(推荐)：设置 CSS `touch-action` 属性
```css
a {
    touch-action: manipulation;
}
```
此方法只有[最新浏览器](http://caniuse.com/#search=-ms-touch-action)支持。
但由于不影响功能，可以忽略低版本浏览器的兼容问题。
[[../components/typo/reset]]组件已内置此样式。

#### 解决方案二：禁用网页缩放
```html
<meta name="viewport" value="..., user-scalable=no">
```
[多数浏览器](https://patrickhlauke.github.io/touch/tests/results/#suppressing-300ms-delay)会在网页禁止缩放后自动禁用延时。

#### 解决方案三：使用触摸事件代替鼠标事件
可使用现成组件，如 [[../components/web/dom]]、[FastClick](https://github.com/ftlabs/fastclick) 组件。

> ##### 另参考
> - [300 毫秒点击延迟的来龙去脉](https://thx.github.io/mobile/300ms-click-delay)
> - [Detecting touch: it's the 'why', not the 'how'](https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/)