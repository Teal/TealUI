---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 单选按钮组

```tsx demo
import { VNode, render } from "ui/control";
import RadioButton from "ui/radioButton";
import RadioButtonGroup from "ui/radioButtonGroup";

render(
    __root__,
    <RadioButtonGroup name="n" value="B">
        <RadioButton key="A">好</RadioButton>
        <RadioButton key="B">不好</RadioButton>
    </RadioButtonGroup>
);
```
