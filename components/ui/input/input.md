---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
    - typo/tip
    - typo/spin
    - ui/tipBox/tipBox.scss
---
# 输入控件
所有可输入控件的抽象基类。内置表单验证功能。

## 基本用法
```tsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text"></Input>
);
```

## 表单验证

### 通用验证
| 验证字段 | 说明 | 示例 |
|---------|------|-----|
| required | 必填字段 | true |
| min | 最小值 | 1 |
| max | 最大值 | 100 |
| minLength | 最小长度 | 1 |
| maxLength | 最大长度 | 100 |
| pattern | 匹配指定正则表达式 | /^\d+$/ |

通用验证的提示信息可通过 `字段名Message` 指定。
```tsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" pattern={/^\d+$/} patternMessage="请输入数字"></Input>
);
```

### 自定义验证
使用 `onValidate` 事件实现自定义验证。
如果验证失败，函数返回错误信息。
如果验证通过，函数返回空字符串。

```tsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" onValidate={v => v > 20 ? "" : "请输入大于 20 的值"}></Input>
);
```

### 异步验证
如果验证是异步的，则 `onValidate` 应返回一个 `Promise` 对象。

```tsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" onValidate={v => new Promise(r => setTimeout(() => r(v > 20 ? "" : "请输入大于 20 的值"), 3000))}></Input>
);
```

### 自定义提示
默认地，如果验证失败，`Input` 会自动追加 `.x-{statusClassPrefix}-error`。
如果验证通过，`Input` 会自动追加 `.x-{statusClassPrefix}-success`。

假如字段后紧跟一个 `.x-tipbox` 或 `.x-tip`，则验证结果自动在这些节点显示。

```tsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" onValidate={v => v > 20 ? "" : "请输入大于 20 的值"}></Input>
        &nbsp;<span class="x-tipbox"></span>
    </div>
);
```

```tsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" onValidate={v => v > 20 ? "" : "请输入大于 20 的值"}></Input>
        &nbsp;<span class="x-tip"></span>
    </div>
);
```
