---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 选择框

```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";
import { ListItem } from "ui/listBox";
import Select from "ui/select";

a = render(
    __root__,
    <Select>
        <ListItem>A</ListItem>
        <ListItem>B</ListItem>
        <ListItem>C</ListItem>
        <ListItem>D</ListItem>
    </Select>
);
```