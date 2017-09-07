---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
---
# 上下按钮文本框
提供上下按钮的文本框。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="../form/button.scss" />
<link rel="stylesheet" href="../input/textBox.scss" />
<link rel="stylesheet" href="../input/inputGroup.scss" />
<link rel="stylesheet" href="../input/upDown.scss" />

## 基本用法
```htm
<span class="x-updown x-inputgroup" x-role="upDown">
    <span><button class="x-button x-updown-up"><span class="x-icon">&#9473;</span></button></span>
    <input type="text" class="x-textbox" value="0">
    <span><button class="x-button x-updown-down"><span class="x-icon">&#10010;</span></button></span>
</span>
```


## 纯 HTML 实现
```htm
<span class="x-updown x-inputgroup">
    <span><button class="x-button x-updown-up" onclick="this.parentNode.nextElementSibling.value--"><span class="x-icon">&#9473;</span></button></span>
    <input type="text" class="x-textbox" value="0">
    <span><button class="x-button x-updown-down" onclick="this.parentNode.previousElementSibling.value++"><span class="x-icon">&#10010;</span></button></span>
</span>
```


    本组件只提供底层的上下切换效果。具体的输入框参考 [数字输入框(numericUpDown)](numericUpDown.html) 组件。

## 基本用法

```htm
<UpDown />
```
# 上下按钮文本框(传统风格)
提供上下按钮的文本框。按钮显示在文本框右边。
<link rel="stylesheet" href="reset.scss" />
<link rel="stylesheet" href="icon.scss" />
<link rel="stylesheet" href="../form/button.scss" />
<link rel="stylesheet" href="../input/textBox.scss" />
<link rel="stylesheet" href="../input/picker.scss" />
<link rel="stylesheet" href="../input/upDown-traditional.scss" />
```htm
<span class="x-picker x-updown" x-role="upDown">
    <input type="text" class="x-textbox">
    <button class="x-button x-updown-up"><i class="x-icon">&#9652;</i></button>
    <button class="x-button x-updown-down"><i class="x-icon">&#9662;</i></button>
</span>
```


    传统风格的文本框按钮显示在文本框右边，不适合触屏操作。建议改用 [上下按钮文本框(upDown)](upDown.html) 组件。
