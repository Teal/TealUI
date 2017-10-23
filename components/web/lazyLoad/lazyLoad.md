---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 图片懒加载
仅当滚到图片时才加载，减少请求数。

```html demo {5} doc
<img id="img" src="../../../assets/resources/100x100.png" data-src="../../../assets/resources/200x200.png">
<script>
import lazyLoad from "web/lazyLoad";

lazyLoad(img, img.getAttribute("data-src"));
</script>
```
