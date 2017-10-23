---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/badge
    - typo/util
---
# 列表
有序列表和无序列表。

## 基本用法
```html demo
<ul class="x-list">
    <li>列表 list</li>
    <li>
        列表 list
        <ul>
            <li>
                子列表 list
                <ul>
                    <li>子列表 list</li>
                    <li>子列表 list</li>
                </ul>
            </li>
            <li>
                子列表 list
                <ol>
                    <li>子列表 list</li>
                    <li>子列表 list</li>
                </ol>
            </li>
        </ul>
    </li>
    <li>列表 list</li>
</ul>
```

## 间隔线
添加 `.x-list-baseline` 设置分割线。
添加 `.x-list-bordered` 设置边框。
添加 `.x-list-striped` 设置间隔色。
```html demo
<ul class="x-list x-list-baseline x-list-bordered x-list-striped">
    <li><a href="###">1. TealLang</a></li>
    <li><a href="###">2. TealUI</a></li>
    <li><a href="###">3. TealEditor</a></li>
</ul>
```

## 文本
添加 `.x-list-ellipsis` 可以让列表项超限后显示省略号。
```html demo
<ul class="x-list x-list-ellipsis">
    <li><a href="###">1. TealLang</a></li>
    <li><a href="###">2. TealUI</a></li>
    <li><a href="###">3. TealEditor</a></li>
</ul>
```

## 水平列表
水平列表主要用于网页布局时经典的 `<li>` 横向布局效果。
添加 `.x-list-h` 即可生成浮动水平列表。
添加 `.x-list-space` 为项之间添加间隙。
```html demo
<ul class="x-list x-list-h x-list-space">
    <li><a href="###">A</a></li>
    <li><a href="###">B</a></li>
    <li><a href="###">C</a></li>
</ul>
```

## 菜单列表
添加 `.x-list-menu` 实现链接组成的列表，可以作为导航使用。
```html demo
<ul class="x-list x-list-baseline x-list-bordered x-list-menu">
    <li><a href="###">A. 10</a></li>
    <li><a href="###">B. 20</a></li>
    <li class="x-list-selected"><a href="###">C. 30<span class="x-badge">44</span></a></li>
    <li><a href="###">D. 40<span class="x-badge">34</span></a></li>
</ul>
```

```html demo
<ul class="x-list x-list-baseline x-list-bordered x-list-menu">
    <li>
        <a href="###">
            <small class="x-right">10 分钟前</small>
            <h4>列表头</h4>
            <p>我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容</p>
            <small>作者</small>
        </a>
    </li>
    <li>
        <a href="###">
            <small class="x-right">10 分钟前</small>
            <h4>列表头</h4>
            <p>我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容</p>
            <small>作者</small>
        </a>
    </li>
    <li>
        <a href="###">
            <small class="x-right">10 分钟前</small>
            <h4>列表头</h4>
            <p>我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容</p>
            <small>作者</small>
        </a>
    </li>
</ul>
```
