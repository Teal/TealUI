---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
  - typo/reset
  - typo/icon
  - typo/util
  - ui/textBox
---
# 按钮
经典按钮效果。

## 基本用法
```jsx demo
import { VNode, render } from "ui/control";
import Button from "ui/button";

render(
    __root__,
    <Button onClick={console.log}>按钮</Button>
);
```

## 样式

### 基本样式
```html demo
按钮：
<a href="###" class="x-button">a</a>
<input type="button" class="x-button" value="input" />
<button type="button" class="x-button">button</button>
<span class="x-button">span</span>
```

### 状态
```html demo
<button class="x-button">默认</button>
<button class="x-button x-button-primary">主色调</button>
<button class="x-button x-transparent">透明</button>
<button class="x-button x-button-info">信息</button>
<button class="x-button x-button-success">成功</button>
<button class="x-button x-button-warning">警告</button>
<button class="x-button x-button-error">错误</button>
<button class="x-button" disabled="disabled">禁用</button>
<button class="x-button x-button-active">按下</button>
```

### 尺寸
```html demo
大小：
<button class="x-button x-button-small">小</button>
<button class="x-button">中</button>
<button class="x-button x-button-large">大</button>
```

## 使用场景

### 图标
```html demo
<button class="x-button"><i class="x-icon">&#9733;</i> 固定</button>
<button class="x-button"><i class="x-icon">&#9733;</i></button>
<button class="x-button x-button-small"><i class="x-icon">&#9733;</i> 固定</button>
<button class="x-button x-button-small"><i class="x-icon">&#9733;</i></button>
```

### 占满一行
使用[[typo/util]]的`.x-block`实现占满一行。
```html demo
<button class="x-button x-button-primary x-blank x-block"><i class="x-icon">🤵</i> 登录</button>
<button class="x-button x-block"><i class="x-icon">✍</i> 注册</button>
```

### 多行文本
```html demo
    <a href="###" class="x-button"><i class="x-icon">&#8615;</i><br />立即下载</a>
```

### 组合文本框
```html demo
<input type="text" class="x-textbox" value="输入">
<input type="button" class="x-button" value="按钮">
```

> ##### 另参考
> - [[ui/menuButton]]
> - [[ui/splitButton]]
> - [[typo/buttonGroup]]
> - [[ui/comboBox]]