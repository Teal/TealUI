---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 文章
本组件提供文章展示样式。为了方便使用 HTML 编辑器生成文章，组件内部所有标签都不需要追加额外 CSS 类。
<link rel="stylesheet" href="reset.scss"/>
<link rel="stylesheet" href="article.scss"/>

## 基本用法

```html demo
<article class="x-article">
    <header>
        <h2>我是标题</h2>
        <small><a href="###">作者</a> 发表于 2015/1/1</small>
    </header>
    <p>我是内容。很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长</p>
</article>
```

## 插图

### 居中

```html demo
<article class="x-article">
    <p>我是一段文字，请看插图：</p>
    <img src="../../../assets/resources/200x200.png" />
    <p>我是第二段文字。</p>
</article>
```

### 图文

```html demo
<article class="x-article">
    <p>我是一段文字，请看插图：</p>
    <figure>
        <img src="../../../assets/resources/200x200.png" />
        <figcaption>图1-1： 我是插图</figcaption>
    </figure>
    <p>我是第二段文字。</p>
</article>
```

### 左浮动
```html demo
<article class="x-article">
    <img align="left" src="../../../assets/resources/100x100.png">
    <p>
        图片左浮动。我显示在右边。很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长
    </p>
</article>
```

### 右浮动
```html demo
<article class="x-article">
    <img align="right" src="../../../assets/resources/100x100.png">
    <p>
        图片右浮动。我显示在左边。很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长
    </p>
</article>
```
