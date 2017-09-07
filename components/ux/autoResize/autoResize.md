---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 自动调整文本域大小
让文本域根据内容自动放大缩小。

```html demo {5} hide doc
<textarea placeholder="请输入文本" id="input"></textarea>
<script>
    import autoResize from "ux/autoResize";

    autoResize(input);
</script>
```