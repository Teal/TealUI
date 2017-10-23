---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
---
# 键盘按下事件
绑定常用键盘按键。

```js
import keyPress from "web/keyPress";

keyPress(elem, {
    up() {
        console.log("上");
    },
    enter() {
        console.log("回车");
    }
});
```