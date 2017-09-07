---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 分割条
实现拖动调整区块划分大小的效果。

```html demo
<div id="panel1" style="width: 20%; background: #eee; float: left;">左边</div>
<div id="panel2" style="float: left;">右边</div>
<script>
    import splitter from "ux/splitter";
    
    window.a = splitter(panel1, panel2);
</script>
```
