---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 多行文本超出区域后显示 ...
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
