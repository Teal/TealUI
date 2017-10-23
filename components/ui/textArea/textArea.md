---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 文本域
文本域，即多行文本框。

## 基本用法
```tsx demo
import { VNode, render } from "ui/control";
import TextArea from "ui/textArea";

render(
    __root__,
    <TextArea placeholder="请输入内容..." rows={6}></TextArea>
);
```
