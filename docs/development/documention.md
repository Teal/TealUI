文档系统
========================================================
@description 文档系统就像 TealUI 的后勤，它负责管理所有组件。本篇文章介绍了文档系统的所有功能，帮助需要对 TealUI 进行二次开发的用户提升组件开发效率。

## 新建组件

### 新建文件

假设需要新建一个名为 `myButton` 的组件，则需要在 `src` 文件夹下选择一个分类新建源码文件，如：

<pre class="doc-code-text">        TealUI/
          └── src/
               └── control/
                     └── form/
                           ├── myButton.css
                           ├── myButton.js
                           └── myButton.html

    </pre>

### 载入文档系统

添加如下脚本引用即可加载文档系统。它包含了演示页所需的常用样式。

<pre><script type="text/javascript" src="../../../assets/doc/doc.js"></script></pre>

### 添加组件描述

在 `<title>` 中添加组件名，在 `<meta name="author" content="">` 中添加组件作者，在`<meta name="description" content="">` 中添加组件描述。

### 组件演示页模板

<script class="doc-demo" type="text/html"><!DOCTYPE html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /> <title>我的按钮</title> <meta name="module-info" content=""> <meta name="author" content="xuld@vip.qq.com"> <meta name="description" content="我是按钮的功能说明。"> <!-- 以下是本组件的全部源码 --> <link rel="stylesheet" type="text/css" href="myButton.css" /> &lt;script type="text/javascript" src="myButton.js">&lt;/script> </head> <body> <!-- 以下代码仅用于文档演示 --> &lt;script type="text/javascript" src="../../../assets/doc/doc.js">&lt;/script> <!-- 在这里写内容 --> </body> </html></script>

## 组件演示（DEMO）页

文档系统提供了一些组件演示的常用功能，方便用户为组件书写测试页和文档。

### 框架模式

框架模式是指文档额外显示的内容（如导航条），可以通过 URL `?frame=default` 或 HTML `<html data-frame="default">` 来设置当前文档的框架模式。

1.  `default`: 默认框架，显示组件导航条和文档样式。
2.  `fullscreen`: 全屏模式，只加载文档样式。
3.  `page`: 页面模式，不额外加载样式和元素。
4.  `none`: 空白模式，不额外加载任何内容以方便组件调试。

### 文档样式

为避免干扰组件本身，我们只为`.doc-section, .doc > *, body > *` 应用文档样式。这些样式在 `assets/doc.css` 可以找到。

### 插入组件示例（DEMO）

添加 `aside.doc-demo`，系统会自动提取并显示内部源码，方便用户复制。

<script type="text/html" class="doc-demo"><aside class="doc-demo"> <!-- 这里写组件的 DEMO --> </aside></script>

> 个别组件会动态生成 HTML，导致提取到的代码是生成过的，可在生成之前调用 `Doc.renderCodes()` 先提取源码。

### 插入代码块

#### `pre`

使用 `<pre>` 标签插入代码是最方便的。系统将自动推断内部语言并高亮，也可通过 `<pre class="doc-code-js">` 手动指定语言。

#### `script`

使用 `<script type="text/html" class="doc-demo">` 标签也可插入代码，内部 HTML 代码无需转义。

> 在 `<script>` 标签内，应使用 `&lt;/script` 代替 `</script>` 防止解析出错。

### 插入盒子

在演示时经常需要一个 `<div>` 来测试，这时可使用盒子。

<aside class="doc-demo doc-section">

<div class="doc-box">doc-box</div>

<div class="doc-box-large">doc-box-large</div>

<div class="doc-box-small">doc-box-small</div>

<div class="doc-box doc-red">doc-red</div>

<div class="doc-box doc-yellow">doc-yellow</div>

<div class="doc-box doc-blue">doc-blue</div>

<div class="doc-box doc-green">doc-green</div>

</aside>

### 插入引用

添加引用提升文档的易读性。

<aside class="doc-demo doc">

> 我是说明

> #### 我是说明
> 
> 我是说明的具体内容

> 我是注意

> #### 我是注意
> 
> 我是注意的具体内容

</aside>

### 插入列

通过 `.doc-row.doc-row-*`(其中 * 是 1-6 的数字)可插入均分的列。在手机上，列将自动垂直布局。

<aside class="doc-demo">

<div class="doc-row doc-row-3">

<div class="doc-col">左</div>

<div class="doc-col">中</div>

<div class="doc-col">右</div>

</div>

</aside>

### 其他工具样式

<dl>

<dd>`doc-left`: 左浮动</dd>

<dd>`doc-right`: 右浮动</dd>

<dd>`doc-clear`: 清除浮动</dd>

</dl>