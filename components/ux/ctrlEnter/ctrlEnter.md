---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# Ctrl+回车事件
绑定Ctrl/Command+回车事件。

```html demo doc
<input type="text" id="input" placeholder="按 Ctrl+回车">
<script>
    import ctrlEnter from "ux/ctrlEnter";
    
    ctrlEnter(input, e => {
        alert("按了 CTRL+回车");
    });
</script>
```
