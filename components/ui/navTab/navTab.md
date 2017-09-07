---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 导航标签页

```jsx demo
import { VNode, render } from "ui/control";
import NavTab from "ui/navTab";

render(
    __root__,
    <div>
        <NavTab id="a"></NavTab>
        <button onclick="from('#a').addTab('xxx' + ~~(Math.random() * 10))">添加标签</button>
    </div>
);
```