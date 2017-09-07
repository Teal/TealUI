---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# DOM 处理
提供统一的、快速的 DOM 操作方法。

## 设计意图
- 统一接口，彻底解决各浏览器在 DOM 层的兼容问题。
- 提供定位等样式计算，简化组件实现。
- 实现 pointer 事件，使得所有组件都能同时支持电脑和触屏使用。
- 解决 click 事件 300ms 延时问题。
- 内置动画效果，方便组件快速添加动画。

## 为什么不使用 jQuery（或 Zepto）
dom 和 jQuery 提供的接口相似，功能相当。
组件开发时用到 jQuery 的功能不多，引入完整的 jQuery 浪费体积和性能。

dom 所有接口功能单一、更接近底层，因此体积小很多、性能更高。
dom 为了组件开发作了一些优化，使得组件本身的代码量降低不少。

在项目中直接使用 dom 没有 jQuery 方便，但可以通过[[ux/jqueryAdapter]]将 dom 封装成和 jQuery 相同的用法。

特性         | dom 4  | dom 2   | Zepto     | jQuery 2.x  | jQuery 1.x 
-------------|--------|---------|-----------|------------|-------------
体积（压缩后） | 16k    | 28k     | 29k       | 78k        | 160k
兼容性        | IE10+  | IE6+     | IE9+     | IE9+       | IE6+
动画底层      | CSS3   | CSS3     | CSS3     | JS          | JS
选择器        | 原生    | 扩展     | 原生     | 扩展        | 扩展
触屏事件      | ✔      |  ✔      | ✔        | ✖          | ✖
事件委托      | ✔      |  ✔      | ✔        | ✔          | ✔
事件名空间    | ✖      |  ✖      | ✔        | ✔          | ✔
CSS3前缀     | ✔      |  ✔       | ✖        | ✖          | ✖

## 内置特效
```html demo hide doc
<div style="height: 100px; ">
    <div id="box" style="position: absolute; display: inline-block;">
        <div class="doc-box"></div>
    </div>
</div>
<select id="select" onchange="toggle(box, this.value, undefined, 1000)">
    <option>opacity</option>
    <option>height</option>
    <option>width</option>
    <option>scale</option>
    <option>scaleX</option>
    <option>scaleY</option>
    <option>top</option>
    <option>bottom</option>
    <option>left</option>
    <option>right</option>
    <option>slideDown</option>
    <option>slideRight</option>
    <option>slideUp</option>
    <option>slideLeft</option>
    <option>zoomIn</option>
    <option>zoomOut</option>
    <option>rotate</option>
</select>
<button onclick="select.onchange();">执行</button>
```
