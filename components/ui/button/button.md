---
version: 0.0.1
author: xuld <xuld@vip.qq.com>
import:
    - typo/reset
	- typo/icon
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
## 基本样式
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
```html demo
<button class="x-button x-button-primary x-blank x-block"><i class="x-icon">🤵</i> 登录</button>
<button class="x-button x-block"><i class="x-icon">✍</i> 注册</button>
```

### 多行文本
```html demo
    <a href="###" class="x-button"><i class="x-icon">&#8615;</i><br />立即下载</a>
```

> 将按钮和其它组件组合使用，另参考：<a href="menuButton.html">菜单按钮(menuButton)</a> 组件、<a href="splitButton.html">分隔按钮(splitButton)</a> 组件、<a href="buttonGroup.html">按钮组(buttonGroup)</a> 组件和 <a href="comboBox.html">组合框(comboBox)</a> 组件。

```html demo
<input type="text" class="x-textbox" value="输入">
<input type="button" class="x-button" value="按钮">
```

		<section class="demo">
			<h3 class="demo">标签</h3>
			<aside class="demo">
				<a href="javascript:;" class="x-button">按钮</a>
			</aside>
			<aside class="demo">
				<button class="x-button">
					按钮
				</button>
			</aside>
			<aside class="demo">
				<input type="button" class="x-button" value="按钮">
			</aside>
		</section>
		<hr class="demo">
		<section class="demo">
			<h3 class="demo">尺寸</h3>
			<aside class="demo">
				<a class="x-button x-button-large">大</a>
			</aside>
			<aside class="demo">
				<a class="x-button">正常</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-small">小</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-smallest">迷你</a>
			</aside>
		</section>
		<hr class="demo">
		<section class="demo">
			<h3 class="demo">状态</h3>
			<aside class="demo">
				<a class="x-button">正常</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-highlight">高亮</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-success">成功</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-warning">警告</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-error">错误</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-info">信息</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-inverse">黑色</a>
			</aside>
		</section>
		<hr class="demo">
		<section class="demo">
			<h3 class="demo">杂项</h3>
			<aside class="demo">
				<a class="x-button">正常</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-active">激活</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-plain">平板</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-disabled" disabled="disabled">禁用</a>
			</aside>
			<aside class="demo">
				<a class="x-button x-button-fixed">固定</a>
			</aside>
		</section>
		<section class="demo-test">
			<hr>
			<a class="x-button x-button-large"><i class="x-icon"></i> 固定</a>
			<a class="x-button"><i class="x-icon"></i> 固定</a>
			<a class="x-button x-button-small"><i class="x-icon"></i> 固定</a>
			<a class="x-button x-button-smallest"><i class="x-icon"></i> 固定</a> 文字
			<br>
			<button class="x-button x-button-large">
				按钮A
			</button>
			<button class="x-button">
				按钮B
			</button>
			<button class="x-button x-button-small">
				按钮C
			</button>
			<button class="x-button x-button-smallest">
				按钮D
			</button>
			<br>
			<a class="x-button x-button-large">按钮A</a>
			<a class="x-button">按钮B</a>
			<a class="x-button x-button-small">按钮C</a>
			<a class="x-button x-button-smallest">按钮D</a>
			<br>
			<input type="button" class="x-button x-button-large" value="按钮A">
			<input type="button" class="x-button" value="按钮B">
			<input type="button" class="x-button x-button-small" value="按钮C">
			<input type="button" class="x-button x-button-smallest" value="按钮D">
			<br>
			<button class="x-button">
				按钮B
			</button>
			<a class="x-button">按钮B</a>
			<input type="button" class="x-button" value="按钮B">
		</section>