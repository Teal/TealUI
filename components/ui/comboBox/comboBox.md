---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 组合框
提供文本框和按钮组合。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";
import { ListItem } from "ui/listBox";
import ComboBox from "ui/comboBox";

a = render(
    __root__,
    <ComboBox>
        <ListItem>A</ListItem>
        <ListItem>B</ListItem>
        <ListItem>C</ListItem>
        <ListItem>D</ListItem>
    </ComboBox>
);
```
