---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 全局样式
定义全局的 CSS 样式。

## 样式重置
样式重置可以统一浏览器默认效果，避免一些兼容问题。

1. 统一常用标签样式。
2. IOS：修复部分表单元素无法更改样式的问题。
3. 触屏：隐藏触摸阴影；修复鼠标事件延时触发的问题。
4. IE：隐藏图片蓝色边框；修复设备宽度和滚动条问题。

> [!] 为了使核心保持小巧，不常用标签的样式重置被移到了：[[typo/reset/reset-more]]。

#### 问题：触屏下鼠标事件延时触发
在触屏设备上，当用户按下一个按钮时，会依次触发以下事件：
```
touchstart → touchmove → touchend → (等待约 300ms 后) → mousemove → mousedown → mouseup → click
```

click 等鼠标事件被延时触发了，主要原因是浏览器为了确认用户是想点击元素还是想快速触摸屏幕两次以缩放网页。

对于那些试图模拟原生 APP 的单页应用来说，延时触发会让用户觉得应用卡钝。

##### 解决方案一(推荐)：设置 CSS `touch-action` 属性
```css
a {
    touch-action: manipulation;
}
```
此方法只有[最新浏览器](http://caniuse.com/#search=-ms-touch-action)支持。
但由于不影响功能，可以不考虑低版本浏览器的兼容问题。

##### 解决方案二：禁用网页缩放
```html
<meta name="viewport" value="..., user-scalable=no">
```
[多数浏览器](https://patrickhlauke.github.io/touch/tests/results/#suppressing-300ms-delay)会在网页禁止缩放后自动禁用延时。

##### 解决方案三：使用触摸事件代替鼠标事件
可使用现成组件，如 [[ux/dom]]、[FastClick](https://github.com/ftlabs/fastclick) 组件。

> ##### 另参考
> - [Detecting touch: it's the 'why', not the 'how'](https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/)

#### 问题：IE 10(for WP 8)：不识别 `<meta name="viewport">`
可添加如下代码修复：
```js
if (/IEMobile\/10\.0/.test(navigator.userAgent)) {
    document.head.appendChild(document.createElement("style")).innerHTML = "@-ms-viewport{width:auto!important}";
}
```

> ##### 另参考
> - [Windows Phone 8 and Device-Width](https://timkadlec.com/2013/01/windows-phone-8-and-device-width/)

## 默认样式

### 字体
```html demo
<a>描点</a>
<a href="###" title="链接">链接</a>
```

> ##### 另参考
> - [native font stacks in this Smashing Magazine article](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)
> - [Never, ever use system-ui as the value of font-family](https://infinnie.github.io/blog/2017/systemui.html)

#### 如何：使字体平滑
OSX 中小字(12px)可使用 `-webkit-font-smoothing: antialiased` 显示更平滑。
但不建议对大字设置此属性。

> ##### 另参考
> - [-webkit-font-smoothing 测试页](http://files.christophzillgens.com/webkit-font-smoothing.html)

#### 问题：Chrome 无法显示小字
使用 `transform` 在 Chrome 显示小于 12px 的字体。
```html demo
<span style="display: inline-block; transform: scale(0.5); transform-origin: 0 0;">我和蚂蚁一样小</span>
```

### 标题
```html demo
<h1>标题1（Heading 1）<small>副标题（Subheading）</small></h1>
<h2>标题2（Heading 2）<small>副标题（Subheading）</small></h2>
<h3>标题3（Heading 3）<small>副标题（Subheading）</small></h3>
<h4>标题4（Heading 4）<small>副标题（Subheading）</small></h4>
<h5>标题5（Heading 5）<small>副标题（Subheading）</small></h5>
<h6>标题6（Heading 6）<small>副标题（Subheading）</small></h6>
```

### 段落
```html demo
<h2 style="text-align: center;">雪</h2>
<p style="text-indent: 2em;">美丽的雪花飞舞起来了。我已经有三年不曾见着它。</p>
<p style="text-indent: 2em;">去年在福建，仿佛比现在更迟一点，也曾见过雪。但那是远处山顶的积雪，可不是飞舞的雪花。在平原上，它只是偶然的随着雨点洒下来几颗，没有落到地面的时候。它的颜色是灰的，不是白色；它的重量像是雨点，并不会飞舞。一到地面，它立刻融成了水，没有痕迹，也未尝跳跃，也未尝发出唏嘘的声音，像江浙一带下雪时的模样。这样的雪，在四十年来第一次看见它的老年的福建人，诚然能感到特别的意味，谈得津津有味，但在我，却总觉得索然。"福建下过雪"，我可没有这样想过。</p>
<p style="text-indent: 2em;">我喜欢眼前飞舞着的上海的雪花。它才是"雪白"的白色，也才是花一样的美丽。它好像比空气还轻，并不从半空里落下来，而是被空气从地面卷起来的。然而它又像是活的生物，像夏天黄昏时候的成群的蚊蚋(ruì)，像春天酿蜜时期的蜜蜂，它的忙碌的飞翔，或上或下，或快或慢，或粘着人身，或拥入窗隙，仿佛自有它自己的意志和目的。它静默无声。但在它飞舞的时候，我们似乎听见了千百万人马的呼号和脚步声，大海汹涌的波涛声，森林的狂吼声，有时又似乎听见了儿女的窃窃私语声，礼拜堂的平静的晚祷声，花园里的欢乐的鸟歌声……它所带来的是阴沉与严寒。但在它的飞舞的姿态中，我们看见了慈善的母亲，活泼的孩子，微笑的花儿，和暖的太阳，静默的晚霞……它没有气息。但当它扑到我们面上的时候，我们似乎闻到了旷野间鲜洁的空气的气息，山谷中幽雅的兰花的气息，花园里浓郁的玫瑰的气息，清淡的茉莉花的气息……在白天，它做出千百种婀娜的姿态；夜间，它发出银色的光辉，照耀着我们行路的人，又在我们的玻璃窗上扎扎地绘就了各式各样的花卉和树木，斜的，直的，弯的，倒的。还有那河流，那天上的云…</p>
```

### 列表
```html demo
<ul>
    <li>列表1</li>
    <li>
        列表 2
        <ul>
            <li>列表 2.1</li>
            <li>列表 2.2</li>
        </ul>
    </li>
</ul>
<ol>
    <li>列表1</li>
    <li>列表 2</li>
</ol>
<dl>
    <dt>列表1</dt>
    <dd>列表 1-1</dd>
    <dd>列表 1-2</dd>
    <dt>列表2</dt>
    <dd>列表 2-1</dd>
    <dd>列表 2-2</dd>
    <dt>列表3</dt>
    <dd>列表 3-1</dd>
    <dd>列表 3-2</dd>
</dl>
```
> 更多列表样式请参考[[typo/list]]。

### 表格
```html demo
<table>
    <caption>表 1-1</caption>
    <tr>
        <th>表格 1-1</th>
        <th>表格 1-2</th>
    </tr>
    <tr>
        <td>表格 2-1</td>
        <td>表格 2-2</td>
    </tr>
    <tr>
        <td>表格 3-1</td>
        <td>表格 3-2</td>
    </tr>
</table>
```
> 更多表格样式请参考[[typo/table]]。

### 水平线
```html demo
<hr>
```
> 可使用[[typo/util/util-more]]提供的 `.x-dotted` 等更改线条样式。

### 图片
```html demo
<a href="###"><img src="../../../assets/resources/150x150.png" /></a>
<img src="../../../assets/resources/150x150.png" style="border-radius: 4px" />
<img src="../../../assets/resources/150x150.png" style="border-radius: 50%;" />
```
> 更多图片样式请参考[[typo/thumbnail]]、[[typo/videoPlaceholder]]、[[typo/avatar]]。

### 代码
```html demo
<p>
    我是文字
    <code>Code</code>
    <kbd>Ctrl+D</kbd>
    <var>x - y</var>
    <samp>Done</samp>
</p>
<pre><code>var x = 1;
var y = 2;
function fn(){
    return 4;
}
</code></pre>
```

### 表单
```html demo
<p>
    表单默认样式：
    <input type="radio" />
    <input type="checkbox" />
    <label>请输入：</label>
    <input type="text" placeholder="文本框" />
    <input type="file" />
    <select>
        <optgroup label="选择组">
            <option>选择框1</option>
            <option>选择框2</option>
        </optgroup>
        <option>选择框1</option>
        <option>选择框2</option>
    </select>
    <input type="button" value="input 按钮" />
    <button>button 按钮</button>
</p>
请输入：<textarea>文本域</textarea>
<fieldset>
    <legend>标签</legend>
    文字
</fieldset>
```
> 更多美化的表单样式请参考[[typo/form]]。

### HTML5 新标签
```html demo
<figure>
    图表
</figure>
<input type="search" />
<input type="number" />
<input type="range" />
<progress value="0.8"></progress>
<details>
    <summary>点我展开</summary>
    <p>我是被展开的内容</p>
</details>
<template>
    template 不应该被显示
</template>
<audio>audio</audio>
<audio controls="controls" src="../../../assets/resources/horse.ogg">audio</audio>
<video controls="controls" src="../../../assets/resources/horse.ogg" >video</video>
```

### 其它块级标签
```html demo
<figure>figure</figure>
<address>address</address>
<blockquote>blockquote</blockquote>
```
> 用于表示名言引入的块级引用请参考[[typo/blockquote]]。

### 其它内联标签
```html demo
文本：
<code>code</code>
<strong>strong</strong>
<em>em</em>
<big>big</big>
<small>small</small>
<sup>sup</sup>
<sub>sub</sub>
<del>del</del>
<cite>cite</cite>
<abbr title="我是说明">abbr</abbr>
<dfn>dfn</dfn>
<u>u</u>
<i>i</i>
<b>b</b>
<q>q</q>
<ins>ins</ins>
<mark>mark</mark>
```
