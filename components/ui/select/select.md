---
version: 0.0.2
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 选择框
提供多个选项供用户选择。

```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";
import { ListItem } from "ui/listBox";
import Select from "ui/select";

render(
    __root__,
    <Select value="2">
        <ListItem key="1">A</ListItem>
        <ListItem key="2">B</ListItem>
        <ListItem key="3">C</ListItem>
        <ListItem key="4">D</ListItem>
    </Select>
);
```
