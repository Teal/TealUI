---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 禁止 Tab
禁止 Tab 切换焦点并改成输入。

```html demo {5} doc
<input type="text" id="input" placeholder="按 Tab">
<script>
    import disableTab from "web/disableTab";
    
    disableTab(input);
</script>
```
