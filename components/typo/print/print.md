---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 打印样式
定义打印网页时的附加样式，增加打印后的易读性。

> ##### (!)本页示例仅在打印时生效
> 按 Ctrl/Command+P (或点击浏览器菜单 文件/打印/打印预览)可以预览效果。

## 全局打印样式优化
1. 将文字改为纯黑色以提升打印速度。
2. 删除背景和阴影。
3. 防止图表等被分页。

> ##### 另参考
> - [The woes of css color in print typography](http://www.sanbeiji.com/archives/953)

## 显示链接和描述
链接在打印时将显示下划线，并在链接文字后追加链接地址。

```html demo
<a href="http://github.com/Teal/TealUI/">我是链接</a>
<abbr title="我是 ABBR 描述">ABBR</abbr>
```

## 辅助样式：打印时显示和隐藏
使用 `.x-hide-print` 在打印时隐藏；使用 `.x-show-print` 只在打印时显示。

```html demo
<div class="x-show-print">现在正在打印。</div>
<div class="x-hide-print">现在正在使用屏幕显示。</div>
```

> ##### 另参考
> - [Delay loading your print CSS](http://www.phpied.com/delay-loading-your-print-css/)
