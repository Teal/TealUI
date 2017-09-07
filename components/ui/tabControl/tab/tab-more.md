---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/util
    - typo/tab
    - typo/close
    - typo/icon
---
# 选项卡菜单扩展
扩展各个方向的选项卡。

## 底部
```html demo
<section class="x-tabbody">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
<ul class="x-tab x-tab-bottom">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
```

## 顶部
```html demo
<ul class="x-tab x-tab-top">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tabbody">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
```

## 左边
```html demo
<ul class="x-tab x-tab-left">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tabbody">
    <div class="x-tabbody-body" style="display:inline-block">
        <div>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
            AAAAA<br>
        </div>
        <div style="display:none;">
            BBBBB<br />
        </div>
        <div style="display:none;">
            CCCCC
        </div>
    </div>
</section>
```

## 右边
```html demo
<ul class="x-tab x-tab-right" style="height: 300px;">
    <li class="x-tab-active">
        <a href="###">选项卡1</a>
    </li>
    <li>
        <a href="###">选项卡2</a>
    </li>
    <li>
        <a href="###">选项卡3</a>
    </li>
</ul>
<section class="x-tabbody">
    <div>
        AAAAA
    </div>
    <div style="display:none;">
        BBBBB<br />
    </div>
    <div style="display:none;">
        CCCCC
    </div>
</section>
```
