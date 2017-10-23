---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# Safari 屏幕阅读器
Safari 5+ 会自动识别网页内容并在地址栏显示阅读器按钮，帮助用户快速浏览网页内容。

## 启用 Safari 屏幕阅读器
如果满足以下条件，Safari 会显示阅读器按钮：
- 仅针对 http(s) 协议下的网页有效。
- 将所有元素放在一个容器标签(`<body>`、`<p>` 除外）内，推荐使用 `<article>`。
- 容器内至少包含 5 个标签，建议至少包含一个 `<h*>` 标签。
- 容器内至少包含约 2000 个字符（具体要求根据标签数决定）。
- 完整条件可参考[源码](http://blog.manbolo.com/2013/03/18/safari-reader.js)。

> ##### 另参考
> - [How to enable Safari Reader on your site?](https://mathiasbynens.be/notes/safari-reader)

## 优化 Safari 屏幕阅读器
- 将不希望显示的链接放在单独的标签中。
- 将评论区的 `class` 命名为 `comment`。
- 将侧边栏的 `class` 命名为 `sidebar`。
- 将工具栏的 `class` 命名为 `toolbox`。
- 如果无法使用 `<h*>` 标签，将 `class` 命名为 `headline`。

## 禁用 Safari 屏幕阅读器
设置所有内容的 `display` 为 `none`，然后在 230ms 后恢复可以禁用 Safari 屏幕阅读器。
