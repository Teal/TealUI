---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 按住事件
模拟 CSS :active 伪类。

```html demo doc
<div id="box" class="doc-box"></div>
<script>
import active from "web/active";

var c = 0;
active(box, e => {
    box.innerHTML = c++;
})
</script>
```
