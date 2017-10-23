---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 单选按钮
单选按钮

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import RadioButton from "ui/radioButton";

render(
    __root__,
    <div>
        <RadioButton name="sex" value={true}>GG</RadioButton>
        <RadioButton name="sex">MM</RadioButton>
    </div>
);
```

## 样式

### 基本样式
```html demo
<label>
    <input type="radio" class="x-checkbox-button" name="input1" />
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    选择1
</label>
<label>
    <input type="radio" class="x-checkbox-button" name="input1" />
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    选择2
</label>
```

## 状态
```html demo
<label>
    <input type="radio" class="x-checkbox-button" disabled="disabled" name="input2" />
    <i class="x-icon">◯</i>
    <i class="x-icon">🖸</i>
    禁用
</label>
```
