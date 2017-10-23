---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 弹层控件
所有弹层控件的抽象基类。

## 基本用法
在任意元素后添加 `<Popup />` 即可为该元素添加点击后显示的弹层。
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
设置 [`arrow=true`](#api/Popup/arrow) 可显示箭头。箭头样式参考[[typo/arrow]]。
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

## 弹层事件
使用 [`event`](#api/Popup/event) 设置显示弹层的事件名。
```jsx demo
import { VNode, render } from "ui/control";
import Popup from "ui/popup";

render(
    __root__,
    <div>
        <button>按钮</button>
        <Popup event="pointerenter">我是弹层</Popup>
    </div>
);
```
> ##### 另参考
> - [[web/popup#弹层事件]]
