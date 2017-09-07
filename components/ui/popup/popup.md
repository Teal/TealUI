---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 弹层控件
所有弹层控件的抽象基类。

## 基本用法
在元素后添加 `<Popup />` 即可为元素添加弹层。
```jsx demo
import { VNode, render } from "ui/control";
import Popup from "ui/popup";

render(
    __root__,
    <div>
        <button>按钮</button>
        <Popup>我是弹层</Popup>
    </div>
);
```

## 箭头
设置 `arrow=true` 可显示箭头。箭头样式参考[[typo/arrow]]。
```jsx demo
import { VNode, render } from "ui/control";
import Popup from "ui/popup";

render(
    __root__,
    <div>
        <button>按钮</button>
        <Popup arrow={true}>我是弹层</Popup>
    </div>
);
```
