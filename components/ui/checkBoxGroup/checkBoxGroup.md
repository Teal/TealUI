---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 复选框组

```tsx demo
import { VNode, render } from "ui/control";
import CheckBox from "ui/checkBox";
import CheckBoxGroup from "ui/checkBoxGroup";

render(
    __root__,
    <CheckBoxGroup value={["A", "D"]} onChange={console.log}>
        <CheckBox key="A">好</CheckBox>
        <CheckBox key="B">不好</CheckBox>
        <CheckBox key="C">不好</CheckBox>
        <CheckBox key="D" disabled>不好</CheckBox>
    </CheckBoxGroup>
);
```
