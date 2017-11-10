---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 悬停事件
模拟 CSS :active 伪类。

```html demo {5-9} doc
<div id="box" class="doc-box"></div>
<script>
import hover from "web/hover";

hover(box, e => {
    box.className += " doc-box-blue";
}, e => {
    box.className = "doc-box";
})
</script>
```