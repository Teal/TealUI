---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 工具提示
工具提示类似 HTML 的 title 效果，可以在指针移上之后显示一些提示信息。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import ToolTip from "ui/toolTip";

render(
    __root__,
    <div>
        <button>按钮</button>
        <ToolTip>工具提示</ToolTip>
    </div>
);
```
> 更多选项见[[ui/popup#箭头]]。

## 样式
```html demo
<div class="x-tooltip" style="display: inline-block; position: relative;">我是提示文案</div>
---
<div class="x-tooltip" style="display: inline-block; position: relative;"><span class="x-arrow x-arrow-top"></span>我是提示文案</div>
---
<div class="x-tooltip" style="display: inline-block; position: relative;"><span class="x-arrow x-arrow-bottom"></span>我是提示文案</div>
---
<div class="x-tooltip" style="display: inline-block; position: relative;"><span class="x-arrow x-arrow-left"></span>我是提示文案</div>
---
<div class="x-tooltip" style="display: inline-block; position: relative;"><span class="x-arrow x-arrow-right"></span>我是提示文案</div>
```
