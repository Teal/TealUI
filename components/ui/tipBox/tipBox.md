---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 提示框
用于信息提示。
<link rel="stylesheet" href="../../typo/utility/utility.scss">
<link rel="stylesheet" href="../../typo/icon/icon.scss">
<link rel="stylesheet" href="../textBox/textBox.scss">

<style>
    .doc-demo {
        line-height: 40px;
    }
</style>

## 基本用法
```tsx demo
<span class="x-tipbox">提示，<a href="###">链接</a>。</span>
<span class="x-tipbox x-tipbox-warning x-transparent">
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</span>
<span class="x-tipbox x-tipbox-success"><span class="x-icon">&#10003;</span> 成功，<a href="###">链接</a>。</span>
<span class="x-tipbox x-tipbox-warning"><span class="x-icon">&#9651;</span> 警告，<a href="###">链接</a>。</span>
<span class="x-tipbox x-tipbox-error"><span class="x-icon">&#33;</span> 错误，<a href="###">链接</a>。</span>
<span class="x-tipbox x-tipbox-info"><span class="x-icon">&#105;</span> 提示，<a href="###">链接</a>。</span>
```

### 带关闭按钮
```tsx demo
<div class="x-tipbox x-tipbox-warning" x-role="tipBox">
    <a href="javascript://隐藏提示" class="x-close">&times;</a>
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</div>
```

### 尺寸
```tsx demo
<span class="x-tipbox x-tipbox-large">
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</span>
<span class="x-tipbox x-tipbox-small">
    <span class="x-icon">&#9733;</span> <strong>注意：</strong>你已被喵星人击倒！
</span>
```

### 占满一行
<p>当使用 <code>div</code> 时，提示框将占满一行。</p>
```tsx demo
<div class="x-tipbox">
    占满一行
</div>
```

```tsx demo
<input type="text" class="x-textbox">
<span class="x-tipbox">提示</span>
```

## 使用场景
```tsx demo
正确：<input type="text" class="x-textbox x-textbox-success" /> <span class="x-tipbox x-tipbox-success x-transparent"><span class="x-icon">&#10003;</span></span><br />
错误：<input type="text" class="x-textbox x-textbox-error" /> <span class="x-tipbox x-tipbox-error"><span class="x-icon">❗</span> 请输入正确的内容</span>
```
