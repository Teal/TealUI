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
```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text"></Input>
);
```

## 验证
建议为输入域添加验证，及时向用户反馈输入错误，改进体验。

### 内置验证
所有输入域都可直接添加以下内置验证字段。
对应的验证失败提示信息可通过 `字段名Message` 指定。

| 验证字段 | 说明 | 示例 |
|---------|------|-----|
| [required](#api/Input/required) | 必填字段 | true |
| [min](#api/Input/min) | 最小值 | 1 |
| [max](#api/Input/max) | 最大值 | 100 |
| [minLength](#api/Input/minLength) | 最小长度 | 1 |
| [maxLength](#api/Input/maxLength) | 最大长度 | 100 |
| [pattern](#api/Input/pattern) | 匹配指定正则表达式 | /^\d+$/ |

```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" pattern={/^\d+$/} patternMessage="请输入数字"></Input>
);
```

### 验证事件
使用 [`validateEvent`](#api/Input/validateEvent) 指定何时触发验证。
```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" pattern={/^\d+$/} patternMessage="请输入数字" validateEvent="input"></Input>
    </div>
);
```

也可以直接调用 [`input.reportValidity()`](#api/Input/reportValidity) 手动触发验证。
```jsx demo
import { VNode, render, from } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input id="input_customValidate" type="text" pattern={/^\d+$/} patternMessage="请输入数字" validateEvent={null}></Input>
        <button onclick="from(input_customValidate).reportValidity()">验证</button>
    </div>
);
```

### 自定义验证
绑定 [`onValidate`](#api/Input/onValidate) 事件实现自定义验证。

验证函数接收一个参数 `value`，表示当前输入域的值。

如果验证通过，验证函数应返回空字符串或 `true`。
如果验证失败，验证函数应返回包含错误信息的字符串 或 `false`（返回 `false` 时使用 [`validateErrorMessage`](#api/Input/validateErrorMessage) 字段的值作为错误提示信息）。
```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" onValidate={myValidate}></Input>
);

function myValidate(value) {
    return value > 20 ? "" : "请输入大于 20 的值";
}
```

验证函数也可返回一个包含更多信息的[验证结果对象](#api/NormalizedValidityResult)：
```js
function myValidate(value) {
    return {
        valid: true,
        status: "success",
        message:"验证成功"
    }
}
```

验证函数也可返回一个 `Promise` 对象，表示该验证是异步的。
```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" onValidate={myValidate}></Input>
);

function myValidate(value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value > 20 ? "" : "请输入大于 20 的值") ;
        }, 3000);
    });
}
```
> ##### (!)注意
> `Promise` 对象仅最新浏览器支持，如果需要兼容老浏览器，建议首先引入[[util/shim#建议]]组件。

#### 如何：调用后端接口验证
```jsx
import { VNode, render } from "ui/control";
import ajax from "web/ajax";
import Input from "ui/input";

render(
    __root__,
    <Input type="text" onValidate={myValidate} validateStartMessage="正在查询服务器..."></Input>
);

function myValidate(value) {
    return new Promise(resolve => {
        ajax({
            type: "POST",
            url: "后端接口地址",
            data: {
                "value": value   // 传递给后端的数据
            },
            success: data => {
                if (data.code == 0) {
                    resolve("");
                } else {
                    resolve("服务端验证失败：" + data.message);
                }
            }
        });
    });
}
```

### 错误提示
验证完成后，[`input.status`](#api/Input/status) 会被更新为最新的状态值（状态值可能为：`info`、`success`、`warning` 或 `error`）。

默认地，`input.status` 内部会追加 `.{statusClassPrefix}-{状态}` CSS 类到组件根节点。
```html demo
<style>
    .hello-error {
        color: red;
    }
</style>
<script>
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" pattern={/^\d+$/} statusClassPrefix="hello-"></Input>
    </div>
);
</script>
```

如果需要屏蔽成功状态提示，可设置 [`hideSuccess`](#api/Input/hideSuccess) 为 `true`。

假如输入域后紧跟了一个 `.x-tipbox` 或 `.x-tip` 元素，则验证结果会自动在这些节点显示。
```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" onValidate={value => value > 20 ? "" : "请输入大于 20 的值"}></Input>
        &nbsp;
        <span class="x-tip">输入一个数值</span>
    </div>
);
---
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" onValidate={value => value > 20 ? "" : "请输入大于 20 的值"}></Input>
        &nbsp;
        <span class="x-tipbox"></span>
    </div>
);
```

假如找不到 `.x-tipbox` 或 `.x-tip` 元素，每个输入域内部会创建一个对应的[[ui/toolTip]]组件用于报告错误信息。
可以使用 [`validityToolTipOptions`](#api/Input/validityToolTipOptions) 属性设置提示框的附加属性。
```jsx demo
import { VNode, render, from } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" pattern={/^\d+$/} patternMessage="请输入数字" validityToolTipOptions={{align: "right"}}></Input>
    </div>
);
```

绑定 [`onReportValidity`](#api/Input/onReportValidity) 事件可自定义报告验证结果的方案。
如果事件函数返回 `false` 将禁用默认的错误报告。
```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

render(
    __root__,
    <div>
        <Input type="text" pattern={/^\d+$/} patternMessage="请输入数字" onReportValidity={e => { console.log(e); return false; }></Input>
    </div>
);
```

### 手动验证
程序中可以使用 [`input.checkValidity().valid`](#api/Input/checkValidity) 获取当前的验证状态。
使用 [`input.setCustomValidity("message")`](#api/Input/setCustomValidity)  手动报告一个验证信息。

如果在[[ui/form]]组件中使用输入域，则表单组件会自动验证内部的所有输入域。

## 创建输入域
所有可输入数据的表单控件都应该继承自 `Input`。

无论是什么输入控件，用户输入的值统一通过 [`value`](#api/Input/value) 读写。`value` 属性可以是 JSON 对象。

子类将自动拥有验证功能。子类可以重写 [`validate`](#api/Input/validate) 添加内置的验证逻辑。

```jsx demo
import { VNode, render } from "ui/control";
import Input from "ui/input";

class MyInput extends Input {

    render(){
        return <textarea></textarea>;
    }

    validate(value) {
        var r = super.validate(value);
        if(r) return r;
        if (value.length % 2 == 1) {
            return "必须输入偶数个字";
        }
        return "";
    }

}

render(
    __root__,
    <MyInput />
);
```
