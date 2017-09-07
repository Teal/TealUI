---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/grid
keyword:
    - 图片
    - image
---
# 缩略图
显示缩略图。

## 基本用法
```html demo
<a href="###">
    <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png">
</a>
```

## 图文
```html demo
<figure class="x-center">
    <a href="###">
        <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png">
    </a>
    <figcaption><a href="###">我是标题</a></figcaption>
</figure>
```

## 图文+说明
```html demo
<figure>
    <a href="###">
        <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png">
    </a>
    <figcaption><a href="###">我是标题</a></figcaption>
    <p>我是很长很长的说明</p>
</figure>
```

## 多张图片
结合[[typo/grid]]轻松实现图片列表效果。
```html demo
<div class="x-row x-row-4">
    <figure class="x-col">
        <a href="###">
            <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png" width="100%">
        </a>
        <figcaption><a href="###">我是标题</a></figcaption>
        <p>我是很长很长的说明</p>
    </figure>
    <figure class="x-col">
        <a href="###">
            <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png" width="100%">
        </a>
        <figcaption><a href="###">我是标题</a></figcaption>
        <p>我是很长很长的说明</p>
    </figure>
    <figure class="x-col">
        <a href="###">
            <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png" width="100%">
        </a>
        <figcaption><a href="###">我是标题</a></figcaption>
        <p>我是很长很长的说明</p>
    </figure>
    <figure class="x-col">
        <a href="###">
            <img class="x-thumbnail" alt="" src="../../../assets/resources/100x100.png" width="100%">
        </a>
        <figcaption><a href="###">我是标题</a></figcaption>
        <p>我是很长很长的说明</p>
    </figure>
</div>
```
