---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
---
# 填选器
扩展的文本框。用户可手动输入或选择输入。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";

render(
    __root__,
    <Picker placeholder="输入或选择..."></Picker>
);
```

## 样式

### 基本用法
```html demo
类型：
<span class="x-picker">
    <input type="text" class="x-textbox" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button">▾</button>
</span>
```

### 状态
```html demo
信息：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-info" autocomplete="off" />
    <button type="button" class="x-button">▾</button>
</span>
---
成功：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-success" autocomplete="off" />
    <button type="button" class="x-button">▾</button>
</span>
---
警告：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-warning" autocomplete="off" />
    <button type="button" class="x-button">▾</button>
</span>
---
失败：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-error" autocomplete="off" />
    <button type="button" class="x-button">▾</button>
</span>
```

```html demo
只读：
<span class="x-picker">
    <input type="text" class="x-textbox" autocomplete="off" readOnly />
    <button type="button" class="x-button">▾</button>
</span>
---
禁用：
<span class="x-picker">
    <input type="text" class="x-textbox" autocomplete="off" disabled />
    <button type="button" class="x-button" disabled>▾</button>
</span>
```
