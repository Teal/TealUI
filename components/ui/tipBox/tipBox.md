---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
  - typo/reset
  - typo/util
  - typo/icon
---
# 提示框
用于信息提

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import TipBox from "ui/tipBox";

render(
    __root__,
    <TipBox status="warning"><strong>注意：</strong>你已被喵星人击倒！</TipBox>
);
```

## 样式

### 基本样式
```html demo
<span class="x-tipbox">提示，<a href="###">链接</a>。</span>
---
<span class="x-tipbox x-tipbox-warning x-transparent">
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</span>
```

### 状态
```html demo
<span class="x-tipbox x-tipbox-success"><span class="x-icon">✓</span> 成功，<a href="###">链接</a>。</span>
---
<span class="x-tipbox x-tipbox-warning"><span class="x-icon">⚠</span> 警告，<a href="###">链接</a>。</span>
---
<span class="x-tipbox x-tipbox-error"><span class="x-icon">❗</span> 错误，<a href="###">链接</a>。</span>
---
<span class="x-tipbox x-tipbox-info"><span class="x-icon">🛈</span> 提示，<a href="###">链接</a>。</span>
```

### 带关闭按钮
```html demo
<div class="x-tipbox x-tipbox-warning">
    <button class="x-close x-icon" title="关闭" aria-label="关闭">✖</button>
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</div>
```

### 尺寸
```html demo
<span class="x-tipbox x-tipbox-large">
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</span>
<span class="x-tipbox x-tipbox-small">
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</span>
```

### 占满一行
使用[[typo/util]]的 `.x-block` 占满一行。
```html demo
<div class="x-tipbox x-block">
    占满一行
</div>
```

## 使用场景
```html demo
正确：<input type="text" class="x-textbox x-textbox-success" /> <span class="x-tipbox x-tipbox-success x-transparent"><span class="x-icon">&#10003;</span></span><br />
错误：<input type="text" class="x-textbox x-textbox-error" /> <span class="x-tipbox x-tipbox-error"><span class="x-icon">❗</span> 请输入正确的内容</span>
```
