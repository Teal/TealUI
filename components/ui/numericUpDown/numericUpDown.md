---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 数字输入框

## 基本用法

```htm
<NumericUpDown />
```
# 用于填数字的控件
提供上下按钮的数字输入文本框。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="../form/button.scss" />
<link rel="stylesheet" href="../input/textBox.scss" />
<link rel="stylesheet" href="../input/inputGroup.scss" />
<link rel="stylesheet" href="../input/upDown.scss" />

## 基本用法
```htm
<span class="x-updown x-inputgroup" x-role="numericUpDown">
    <span><button class="x-button x-updown-up"><span class="x-icon">&#9473;</span></button></span>
    <input type="text" class="x-textbox" value="0">
    <span><button class="x-button x-updown-down"><span class="x-icon">&#10010;</span></button></span>
</span>
```


## 设置步长
```htm
<span class="x-updown x-inputgroup" x-role="numericUpDown" x-step="5">
    <span><button class="x-button x-updown-up"><span class="x-icon">&#9473;</span></button></span>
    <input type="text" class="x-textbox" value="0">
    <span><button class="x-button x-updown-down"><span class="x-icon">&#10010;</span></button></span>
</span>
```
