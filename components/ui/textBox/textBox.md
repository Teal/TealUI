---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/grid
    - typo/util
    - typo/icon
keyword:
    - 输入框
    - 输入域
    - input
---
# 文本框
文本框也叫输入框，文本框可用于让用户输入信息。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import TextBox from "ui/textBox";

render(
    __root__,
    <TextBox placeholder="请输入内容..."></TextBox>
);
```

## 密码框
```jsx demo
import { VNode, render } from "ui/control";
import TextBox from "ui/textBox";

render(
    __root__,
    <TextBox type="password" placeholder="请输入密码..."></TextBox>
);
```

## 事件
每次输入时都会触发 [`onInput`](#api/TextBox/onInput) 事件，内容改变后会触发 [`onChange`](#api/TextBox/onChange) 事件。
```jsx demo
import { VNode, render } from "ui/control";
import TextBox from "ui/textBox";

render(
    __root__,
    <TextBox onChange={(e, s) => console.log("值 = " + s.value)}></TextBox>
);
```

## 验证
```jsx demo
import { VNode, render } from "ui/control";
import TextBox from "ui/textBox";

render(
    __root__,
    <TextBox minLength={3} pattern={/^\d+$/} onChange={(e, s) => console.log("验证结果 = " + s.checkValidity().valid)}></TextBox>
);
```
> 更多验证功能请参考[[ui/input#验证]]。

## 样式

<style>
.doc .x-textbox {
    margin-bottom: .5rem;
}
</style>

### 基本样式
```html demo
姓名：<input type="text" class="x-textbox" placeholder="请输入内容..." /> <br />
生日：<input type="date" class="x-textbox" placeholder="请输入内容..." /> <br />
年龄：<select class="x-textbox"><option>已成年</option><option>未成年</option></select> <br />
自我介绍：
<textarea class="x-textbox" placeholder="请输入内容..." rows="7"></textarea>
```

### 状态
```html demo
只读：<input type="text" class="x-textbox" readonly="readonly" value="内容" />
---
禁用：<input type="text" class="x-textbox" disabled="disabled" value="内容" />
```

### 颜色
```html demo
信息：<input type="text" class="x-textbox x-textbox-info" placeholder="请输入内容..." />
---
成功：<input type="text" class="x-textbox x-textbox-success" placeholder="请输入内容..." />
---
警告：<input type="text" class="x-textbox x-textbox-warning" placeholder="请输入内容..." />
---
错误：<input type="text" class="x-textbox x-textbox-error" placeholder="请输入内容..." />
```

### 尺寸
```html demo
更大：<input type="text" class="x-textbox x-textbox-large" />
---
更小：<input type="text" class="x-textbox x-textbox-small" />
```

使用[[typo/grid]]提供的 `.x-col-*` 设置宽度。
```html demo
更宽：<input type="text" class="x-textbox x-col-12" />
---
更窄：<input type="text" class="x-textbox x-col-4" />
```

使用[[typo/util]]提供的 `.x-block` 可占满整行。
```html demo
<input type="text" class="x-textbox x-block" placeholder="任意内容..." />
```

### 选择框
```html demo
<select class="x-textbox">
    <option>A: B 没有说谎</option>
    <option>B: C 说谎了</option>
    <option>C: 我没有说谎</option>
    <option>D: 只一人说谎</option>
</select>
---
<select class="x-textbox x-textbox-warning">
    <option>A: B 没有说谎</option>
    <option>B: C 说谎了</option>
    <option>C: 我没有说谎</option>
    <option>D: 只一人说谎</option>
</select>
---
<select class="x-textbox x-textbox-error">
    <option>A: B 没有说谎</option>
    <option>B: C 说谎了</option>
    <option>C: 我没有说谎</option>
    <option>D: 只一人说谎</option>
</select>
---
<select class="x-textbox x-textbox-success">
    <option>A: B 没有说谎</option>
    <option>B: C 说谎了</option>
    <option>C: 我没有说谎</option>
    <option>D: 只一人说谎</option>
</select>
```

### 列表框
```html demo
<select multiple class="x-textbox">
    <option>A: B 没有说谎</option>
    <option>B: C 说谎了</option>
    <option>C: 我没有说谎</option>
    <option>D: 只一人说谎</option>
</select>
```