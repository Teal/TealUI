---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
keyword:
    - 显示
    - show
    - 隐藏
    - hide
    - 浮动
    - float
    - 对齐
    - align
---
# 工具样式
提供常用 CSS 工具样式。

## 浮动
- `x-left`: 左浮动
- `x-right`: 右浮动
- `x-clear`: 清除浮动
```html demo
<div class="x-clear">
    <div class="doc-box x-left">.x-left</div>
    <div class="doc-box x-right">.x-right</div>
</div>
```

## 隐藏
- `x-hide`: 隐藏元素（display:none)
- `x-show-small`: 只在小屏（手机）显示
- `x-hide-small`: 只在小屏（手机）隐藏
- `x-show-medium`: 只在大中屏（平板、电脑）显示
- `x-hide-medium`: 只在大中屏（平板、电脑）隐藏
- `x-hide-large`: 只在大屏（电脑）隐藏
- `x-show-large`: 只在大屏（电脑）显示
```html demo
<div class="x-hide">hide</div>
---
<div class="x-show-small">small</div>
<div class="x-hide-small"><del>small</del></div>
---
<div class="x-show-medium">medium/large</div>
<div class="x-hide-medium"><del>medium/large</del></div>
---
<div class="x-show-large">large</div>
<div class="x-hide-large"><del>large</del></div>
```

## 间距
- `x-blank`: 提供 1rem 的下边距
- `x-space`: 提供 0.375rem 的右边距
```html demo
上
<div class="x-blank"></div>
下
---
<span class="x-space">左</span>
右
```

## 居中
- `x-middle`: 垂直居中
- `x-center`: 水平居中
```html demo
<div class="x-middle x-center">居中</div>
```

## 滚动条
- `x-scrollable`: 超出内容后显示垂直滚动条
- `x-scrollable-horizontal`: 超出内容后显示水平滚动条
```html demo
<div class="x-scrollable" style="height: 30px;"><div style="height: 40px;">内容内容内容内容内容内容内容</div></div>
<div class="x-scrollable-horizontal"><div style="width: 200%;">我是内容</div></div>
```

## 文本
- `x-ellipsis`: 单行文本超出区域后显示 ...。
- `x-break-word`: 强制文本换行，避免长单词不换行。（仅适合中文排版使用）
```html demo
<div class="x-ellipsis">文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本</div>
<div class="x-break-word">break word break word break word break word break word break word break word break word break word break word break word break word break word break word break word break word</div>
```

#### 如何实现：多行文本超出区域后显示 ...
Webkit 可参考如下代码：
```html demo
<div style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本</div>
```

其它浏览器需要用到 js：
```html demo
<div id="container">文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本</div>
<script>
    function ellipsis(container, maxHeight) {
        if (container.offsetHeight > maxHeight) {
            var count = 3;
            do {
                container.innerHTML = container.innerHTML.slice(0, -count++) + "...";
            }  while (container.offsetHeight > maxHeight);
        }
    }
    ellipsis(document.getElementById("container"), 60);
</script>
```

#### 如何实现：单词换行后自动追加 "-"
目前浏览器实现的功能较弱，在语言为 `en` 的上下文中设置 `hyphens: manual`，然后插入 `&shy;`，如果需要浏览器会将之显示为 "-"。
```html demo
<div lang="en" style="width: 55px; -webkit-hyphens: manual; -moz-hyphens: manual; -ms-hyphens: manual; hyphens: manual;">
    An extreme&shy;ly long English word
</div>
```

> ##### 另参考
> - [`hyphens` 属性](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens)。
> - [[typo/util/util-more]]