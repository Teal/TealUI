---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 多选框
多选框

## 基本用法

```jsx demo
import { VNode, render } from "ui/control";
import { ListItem } from "ui/listBox";
import MultiSelect from "ui/multiSelect";

render(
    __root__,
    <MultiSelect value="2">
        <ListItem key="1">A</ListItem>
        <ListItem key="2">B</ListItem>
        <ListItem key="3">C</ListItem>
        <ListItem key="4">D</ListItem>
    </MultiSelect>
);
```
