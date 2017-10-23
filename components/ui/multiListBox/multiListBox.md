---
version: 0.0.2
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 多选列表框
通过多选列表供选择。

## 基本用法

```jsx demo
import { VNode, render } from "ui/control";
import MultiListBox from "ui/multiListBox";
import { ListItem } from "ui/listBox";

render(
    __root__,
    <MultiListBox onChange={console.log} value={["B", "D"]}>
        <ListItem key="A">A</ListItem>
        <ListItem key="B">B</ListItem>
        <ListItem key="C">C</ListItem>
        <ListItem key="D">D</ListItem>
    </MultiListBox>
);
```
