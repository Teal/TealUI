---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 鼠标移入事件
模拟 CSS :hover 伪类。

```html demo doc
<div id="box" class="doc-box"></div>
<script>
import hover from "ux/hover";

hover(box, e => {
    box.className += " doc-box-blue";
}, e => {
    box.className = "doc-box";
})
</script>
```
