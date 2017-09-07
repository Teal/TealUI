---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 标签选择器

## 基本用法

```htm
<TagChooser />
```
@doc tagChooser.ts

@demo
@import ../input/textBox.css
<input type="text" class="x-textbox" id="tagchooser"/>
<span class="x-tagchooser" x-role="tagchooser">
    <a class="x-tagchooser-selected" href="javascript:;">选项1</a>
    <a href="javascript:;">选项2</a>
    <a href="javascript:;">选项3</a>
</span>
