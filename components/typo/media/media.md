---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
keyword:
    - 左右
---
# 图文混排
图文左右混排布局效果。

## 基本用法
```html demo
<div class="x-media">
    <div class="x-media-header">
        <a href="###"><img width="45" height="45" alt="作者头像" src="../../../assets/resources/avatar.png"></a>
    </div>
    <div class="x-media-body">
        <p>
            右侧是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </p>
    </div>
</div>
---
<div class="x-media">
    <div class="x-media-header">
        <a href="###"><img width="45" height="45" alt="作者头像" src="../../../assets/resources/avatar.png"></a>
    </div>
    <div class="x-media-body">
        <h3>标题</h3>
        <p>
            右侧是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </p>
    </div>
</div>
```

## 右对齐
将头尾位置颠倒即可右对齐。
```html demo
<div class="x-media">
    <div class="x-media-body">
        右侧是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
    </div>
    <div class="x-media-header">
        <a href="###"><img width="45" height="45" alt="作者头像" src="../../../assets/resources/avatar.png"></a>
    </div>
</div>
---
<div class="x-media">
    <div class="x-media-body">
        <h3>标题</h3>
        <p>
            右侧是很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </p>
    </div>
    <div class="x-media-header">
        <a href="###"><img width="45" height="45" alt="作者头像" src="../../../assets/resources/avatar.png"></a>
    </div>
</div>
```