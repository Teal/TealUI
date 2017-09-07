---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/util
    - typo/close
    - typo/icon
---
# 选项卡菜单
选项卡效果。

## 基本用法
```html demo
<div class="x-tabcontrol">
    <ul class="x-tab">
        <li class="x-tab-active">
            <a href="###">选项卡1</a>
        </li>
        <li>
            <a href="###">选项卡2</a>
        </li>
        <li>
            <a href="###">选项卡3<button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button></a>
        </li>
        <div class="x-tab-bar"></div>
    </ul>
    <section class="x-tabbody">
        <div>
            AAAAA
        </div>
        <div style="display:none;">
            BBBBB<br />BBBB
        </div>
        <div style="display:none;">
            CCCCC
        </div>
    </section>
</div>
```

## 占满整行
添加[[typo/util]]提供的 `.x-block` 可占满整行
```html demo
<ul class="x-tab x-block">
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

## 其它方向
如果需要显示其它方向的选项卡，转到[[typo/tab/tab-more]]。