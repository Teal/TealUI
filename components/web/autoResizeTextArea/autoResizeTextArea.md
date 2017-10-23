---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 自动调整文本域大小
让文本域随输入内容自动调整高度。

```html demo {5} hide doc
<textarea placeholder="请输入文本" id="input"></textarea>
<script>
    import autoResizeTextArea from "web/autoResizeTextArea";

    autoResizeTextArea(input);
</script>
```