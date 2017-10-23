---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# DOM 处理
提供统一的、高性能的 DOM 操作方法。

## 目的
- 统一接口，屏蔽各浏览器的兼容问题。
- 实现 pointer 事件，使得所有组件都能同时支持电脑和触屏使用，并解决 click 事件 300ms 延时问题。
- 内置定位计算和动画效果，方便组件开发。

## 为什么不用 jQuery/Zepto
dom 和 jQuery 提供的接口相似，功能相当。
组件开发时用到 jQuery 的功能不多，引入完整的 jQuery 浪费体积和性能。

dom 所有接口功能单一、更接近底层，因此体积小很多、性能更高。    
dom 主要为组件开发设计，可以大幅降低组件开发的代码量。

在项目中直接使用 dom 没有 jQuery 方便，但可以通过[[web/domList]]将 dom 封装成和 jQuery 相同的用法。

特性         | dom 4  | dom 2   | Zepto     | jQuery 2.x  | jQuery 1.x 
-------------|--------|---------|-----------|------------|-------------
体积（压缩后） | 16k    | 28k     | 29k       | 78k        | 160k
兼容性        | IE10+  | IE6+     | IE9+     | IE9+       | IE6+
动画底层      | CSS3   | JS       | CSS3     | JS          | JS
选择器        | 原生    | 扩展     | 原生     | 扩展        | 扩展
触屏事件      | ✔      |  ✖      | ✔        | ✖          | ✖
事件委托      | ✔      |  ✔      | ✔        | ✔          | ✔
事件名空间    | ✖      |  ✖      | ✔        | ✔          | ✔
CSS3前缀     | ✔      |  ✖       | ✖        | ✖          | ✖

## 内置特效
```html demo hide doc
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
<div style="height: 100px; ">
    <div id="box" style="position: absolute; display: inline-block;">
        <div class="doc-box"></div>
    </div>
</div>
```

## 已知问题
由于历史原因，浏览器提供的原生 DOM 接口在有些情况可能和作者的预期不符。
dom 组件修复了常见的问题，但为了确保底层精简，仍有很多问题未被修复：
1. 即使限定了根元素，但选择器仍然是针对全局的。如 `dom.find(<div><a></div>, 'div>a')` 可以找到 `<a>` 元素。
2. 如果表单内存在 `name="foo"` 的元素，则 `getAttr(form, "foo")` 会返回该元素，而不是表单本身的 `"foo"` 属性。
3. `<select>` 中只有一个 `<option>` 时，`getAttr(<option>, "selected")` 可能是 `false`。
4. IE6-8：`getAttr(<table>, "test:attrib")` 在属性名有冒号时报错。
5. `setAttr(<datalist>, "list", "...")` 在部分浏览器无效。
6. `setAttr(elem, "style", "...")` 在部分浏览器无法使用。
7. `setAttr(<input>, "type", "...") ` 在部分浏览器无法使用。
8. IE6-8：不支持 `input` 事件。