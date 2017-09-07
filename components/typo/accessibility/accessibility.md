---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 可访问性
让通过辅助设备（AT，Assistive Technology）上网的人群更容易阅读。

## 屏幕阅读器和键盘导航

### 语义化标签
为了让屏幕阅读器和键盘导航更好理解网页内容，应为 HTML 标签添加 `role` 和 `aria-*` 属性，以增强网页的语义化。

### 标题嵌套
网页中应该按顺序嵌套 `<h1>` - `<h6>` 标签，让阅读器可以更容易理解网页层次，生成网页结构列表。

> ##### 另参考
> - [HTML CodeSniffer](http://squizlabs.github.io/HTML_CodeSniffer/Standards/Section508/)
> - [Penn State's AccessAbility](http://accessibility.psu.edu/headings)

### 色彩对比度
如果需要，可以修改默认配色方案，提高色彩对比度以帮助视力低下或色盲用户更好使用产品。

### 表单验证
表单验证的结果不应该只通过颜色区分，还应使用图标，且图标添加 `aria-describedby="描述"` 来说明，同时不正确的字段还应设置 `aria-invalid="true"`。

### 键盘导航
所有可点击区域应该可以通过 `Tab` 定位，为元素设置 `tabindex` 属性可为不可点击元素添加 `Tab` 停靠。 `tabindex` 的值应该使用 10, 20, 30... 的顺序递增，以防止需求变动需要临时插入项。在菜单中，应该支持键盘方向键切换焦点。同时，使用 `accesskey` 为常量功能设置快捷键。

> ##### 另参考
> - [w3.org Introduction to Accessibility](http://www.w3.org/WAI/intro/accessibility.php)
> - [MDN accessibility documentation](https://developer.mozilla.org/zh-CN/docs/Accessibility)
> - ["HTML Codesniffer" bookmarklet for identifying accessibility issues](https://github.com/squizlabs/HTML_CodeSniffer)
> - [Chrome's Accessibility Developer Tools extension](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb?hl=en)
> - [Colour Contrast Analyser](http://www.paciellogroup.com/resources/contrastanalyser/)
> - [The A11Y Project](http://a11yproject.com)
> - [Accessibilty Certification and Training](http://webaim.org)

## Safari 屏幕阅读器
Safari 5+ 会自动识别网页内容并在地址栏显示阅读器按钮，帮助用户快速浏览网页内容。

### 启用 Safari 屏幕阅读器
如果满足以下条件，Safari 会显示阅读器按钮：
- 仅针对 http(s) 协议下的网页有效。
- 将所有元素放在一个容器标签(`<body>`、`<p>` 除外）内，推荐使用 `<article>`。
- 容器内至少包含 5 个标签，建议至少包含一个 `<h*>` 标签。
- 容器内至少包含约 2000 个字符（具体要求根据标签数决定）。
- 完整条件可参考[源码](http://blog.manbolo.com/2013/03/18/safari-reader.js)。

> ##### 另参考
> - [How to enable Safari Reader on your site?](https://mathiasbynens.be/notes/safari-reader)

### 优化 Safari 屏幕阅读器
- 将不希望显示的链接放在单独的标签中。
- 将评论区的 `class` 命名为 `comment`。
- 将侧边栏的 `class` 命名为 `sidebar`。
- 将工具栏的 `class` 命名为 `toolbox`。
- 如果无法使用 `<h*>` 标签，将 `class` 命名为 `headline`。

### 禁用 Safari 屏幕阅读器
设置所有内容的 `display` 为 `none`，然后在 230ms 后恢复可以禁用 Safari 屏幕阅读器。

## 辅助样式：对屏幕阅读器显示和隐藏
```html demo
<div aria-hidden="true">现在正在使用屏幕显示。</div>
<div class="x-show-reader">现在正在使用屏幕阅读器。</div>
```

## 跳至主内容
按 `Tab` 可以显示跳到内容的快捷方式。

```html demo
<a href="#content" class="x-show-reader x-show-reader-focusable">直接跳到内容</a>
...
<div class="container" id="content" tabindex="-1">
    我是主要内容
</div>
```

> ##### 另参考
> - [添加跳至内容链接](http://www.w3.org/TR/2013/NOTE-WCAG20-TECHS-20130905/G1)
