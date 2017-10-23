---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 复选框
复选框

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import CheckBox from "ui/checkBox";

render(
    __root__,
    <CheckBox value onChange={(e, s) => console.log("选中：" + s.value)}>同意</CheckBox>
);
```

## 三态
```jsx demo
import { VNode, render } from "ui/control";
import CheckBox from "ui/checkBox";

render(
    __root__,
    <CheckBox onChange={(e, s) => console.log("选中：" + s.value)} threeState></CheckBox>
);
```

## 样式

### 基本样式
```html demo
<label>
    <input type="checkbox" class="x-checkbox-button" name="input1">
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    默认
</label>

<label>
    <input type="checkbox" class="x-checkbox-button" name="input1">
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    默认
</label>

<label>
    <input type="checkbox" class="x-checkbox-button" disabled="disabled" name="input1">
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    禁用
</label>
```
