---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 列表框
通过基本列表供选择。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import ListBox, { ListItem } from "ui/listBox";

render(
    __root__,
    <ListBox onChange={console.log} value="B">
        <ListItem key="A">A</ListItem>
        <ListItem key="B">B</ListItem>
        <ListItem key="C">C</ListItem>
        <ListItem key="D">D</ListItem>
    </ListBox>
);
```

## 样式

### 基本样式
```html demo
<ul class="x-listbox">
    <li data-key="A"><a href="javascript:;">A</a></li>
    <li data-key="B" class="x-listbox-selected"><a href="javascript:;">B</a></li>
    <li data-key="C"><a href="javascript:;">C</a></li>
    <li data-key="D"><a href="javascript:;">D</a></li>
</ul>
```

### 状态
```html demo
<ul class="x-listbox x-listbox-readonly">
    <li data-key="A"><a href="javascript:;">A</a></li>
    <li data-key="B" class="x-listbox-selected"><a href="javascript:;">B</a></li>
    <li data-key="C"><a href="javascript:;">C</a></li>
    <li data-key="D"><a href="javascript:;">D</a></li>
</ul>
---
<ul class="x-listbox x-listbox-disabled">
    <li data-key="A"><a href="javascript:;">A</a></li>
    <li data-key="B" class="x-listbox-selected"><a href="javascript:;">B</a></li>
    <li data-key="C"><a href="javascript:;">C</a></li>
    <li data-key="D"><a href="javascript:;">D</a></li>
</ul>
```
