---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
    - typo/icon
---
# 填选器
扩展的文本框。用户可手动输入或从下拉菜单中选择输入。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";

render(
    __root__,
    <Picker placeholder="输入或选择..."></Picker>
);
```

## 定制下拉菜单
继承 `Picker` 并重写 [`createMenu()`](#api/Picker/createMenu) 返回菜单控件。
重写 [`updateMenu()`](#api/Picker/updateMenu) 用于将用户输入的内容同步到下拉菜单。

```jsx demo
import { VNode, render } from "ui/control";
import Picker from "ui/picker";
import TextBox from "ui/textBox";

class MyPicker extends Picker {

    createMenu() {
        var txt = new TextBox();        // 创建下拉菜单。
        txt.onInput = e => {            // 在下拉菜单的操作同步到输入框。
        
            this.input.value = txt.value;
        };
        return txt;
    }

    updateMenu() {                      // 在输入框的操作同步到下拉菜单。
        this.menu.value = this.input.value;
    }

}

render(
    __root__,
    <MyPicker resizeMode="fitInput" />
);
```

## 样式

### 基本样式
```html demo
类型：
<span class="x-picker">
    <input type="text" class="x-textbox" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
```

### 状态
```html demo
只读：
<span class="x-picker">
    <input type="text" class="x-textbox" autocomplete="off" placeholder="输入或选择..." readonly />
    <button type="button" class="x-button" tabIndex="-1" disabled><i class="x-icon">⮟</i></button>
</span>
---
禁用：
<span class="x-picker">
    <input type="text" class="x-textbox" autocomplete="off" placeholder="输入或选择..." disabled />
    <button type="button" class="x-button" tabIndex="-1" disabled><i class="x-icon">⮟</i></button>
</span>
```

### 颜色
```html demo
信息：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-info" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
---
成功：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-success" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
---
警告：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-warning" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
---
失败：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-error" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
```

### 大小
```html demo
小：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-small" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button x-button-small" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
---
大：
<span class="x-picker">
    <input type="text" class="x-textbox x-textbox-large" autocomplete="off" placeholder="输入或选择..." />
    <button type="button" class="x-button x-button-large" tabIndex="-1"><i class="x-icon">⮟</i></button>
</span>
```
