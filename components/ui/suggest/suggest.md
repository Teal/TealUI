---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 提示框

```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";
import { ListItem } from "ui/listBox";
import Suggest from "ui/suggest";

a = render(
    __root__,
    <Suggest>
        <ListItem>你好</ListItem>
        <ListItem>你好啊</ListItem>
        <ListItem>哈</ListItem>
    </Suggest>
);
```