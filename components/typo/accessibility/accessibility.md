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
> - [[../docs/issues/safari-screen-reader]]
> - [w3.org Introduction to Accessibility](http://www.w3.org/WAI/intro/accessibility.php)
> - [MDN accessibility documentation](https://developer.mozilla.org/zh-CN/docs/Accessibility)
> - ["HTML Codesniffer" bookmarklet for identifying accessibility issues](https://github.com/squizlabs/HTML_CodeSniffer)
> - [Chrome's Accessibility Developer Tools extension](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb?hl=en)
> - [Colour Contrast Analyser](http://www.paciellogroup.com/resources/contrastanalyser/)
> - [The A11Y Project](http://a11yproject.com)
> - [Accessibilty Certification and Training](http://webaim.org)

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
